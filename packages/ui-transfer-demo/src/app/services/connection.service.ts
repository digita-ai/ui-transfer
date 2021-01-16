import { Injectable } from '@angular/core';
import { Observable, forkJoin, from, of } from 'rxjs';
import { Session } from '@inrupt/solid-client-authn-browser';
import {
  SolidDataset,
  Thing,
  addDatetime,
  addUrl,
  createThing,
  getDatetime,
  getSolidDataset,
  getStringNoLocale,
  getThing,
  getThingAll,
  getUrl,
  saveSolidDatasetAt,
  setThing,
} from '@inrupt/solid-client';
import { catchError, map, switchMap } from 'rxjs/operators';
import { PaySlip } from '../models/payslip.model';
import * as _ from 'lodash';
import { Consent } from '../models/consent.model';

@Injectable()
export class ConnectionService {
  private pay = 'http://digita.ai/voc/payslip#';
  private consent = 'http://digita.ai/voc/consent#';
  private defaultConsentFile = '/consents/consents.ttl';
  private solid = 'http://www.w3.org/ns/solid/terms#';

  constructor() {}

  public connect(session: Session, provider: string): Observable<void> {
    console.log('Starting to connect', { session, provider });

    if (!session) {
      throw Error('Parameter session should be set');
    }

    if (!provider) {
      throw Error('Parameter provider be set');
    }

    return from(
      session.login({
        oidcIssuer: provider,
        redirectUrl: `${window.location.origin}/confirm`,
      }),
    );
  }
  public getName(session: Session): Observable<string> {
    console.log('Starting to get name', { session });

    if (!session) {
      throw Error('Parameter session should be set');
    }

    return of({ session }).pipe(
      switchMap((data) =>
        from(
          getSolidDataset(data.session.info.webId, {
            fetch: data.session.fetch,
          }),
        ).pipe(map((response) => ({ ...data, response }))),
      ),
      map((data) => ({
        ...data,
        profile: getThing(data.response, data.session.info.webId),
      })),
      map((data) =>
        getStringNoLocale(data.profile, 'http://www.w3.org/2006/vcard/ns#fn'),
      ),
    );
  }
  public getAllFilesForClass(
    session: Session,
    forClass: string,
  ): Observable<string[]> {
    if (!session) {
      throw Error('Parameter session should be set');
    }

    return of({ session }).pipe(
      // read profile
      switchMap((data) =>
        from(
          getSolidDataset(data.session.info.webId, {
            fetch: data.session.fetch,
          }),
        ).pipe(map((profileResponse) => ({ ...data, profileResponse }))),
      ),
      map((data) => ({
        ...data,
        profile: getThing(data.profileResponse, data.session.info.webId),
      })),
      // handle privateTypeIndex
      map((data) => ({
        ...data,
        privateTypeIndex: getUrl(data.profile, this.solid + 'privateTypeIndex'),
      })),
      switchMap((data) =>
        from(
          getSolidDataset(data.privateTypeIndex, { fetch: data.session.fetch }),
        ).pipe(map((privateResponse) => ({ ...data, privateResponse }))),
      ),
      map((data) => ({
        ...data,
        privateFoundForClass: getThingAll(data.privateResponse)
          .filter(
            (thing) => getUrl(thing, this.solid + 'forClass') === forClass,
          )
          .map((thing) => getUrl(thing, this.solid + 'instance')),
      })),
      // handle publicTypeIndex
      map((data) => ({
        ...data,
        publicTypeIndex: getUrl(data.profile, this.solid + 'publicTypeIndex'),
      })),
      switchMap((data) =>
        from(
          getSolidDataset(data.publicTypeIndex, { fetch: data.session.fetch }),
        ).pipe(map((publicResponse) => ({ ...data, publicResponse }))),
      ),
      map((data) => ({
        ...data,
        publicFoundForClass: getThingAll(data.publicResponse)
          .filter(
            (thing) => getUrl(thing, this.solid + 'forClass') === forClass,
          )
          .map((thing) => getUrl(thing, this.solid + 'instance')),
      })),
      // wrap up
      map((data) => [
        ...data.privateFoundForClass,
        ...data.publicFoundForClass,
      ]),
    ) as Observable<string[]>;
  }
  public getPaySlips(session: Session): Observable<PaySlip[]> {
    if (!session) {
      throw Error('Parameter session should be set');
    }

    return of({ session }).pipe(
      switchMap((data) =>
        this.getAllFilesForClass(session, this.pay + 'payslips').pipe(
          map((payslipfiles) => ({ ...data, payslipfiles })),
        ),
      ),
      switchMap((data) =>
        data.payslipfiles && data.payslipfiles.length > 0
          ? forkJoin(
              data.payslipfiles.map((file) =>
                this.getAllPaySlipsFromFile(data.session, file),
              ),
            )
          : [[]],
      ),
      map((data) => _.flatten(data)),
    ) as Observable<PaySlip[]>;
  }
  public saveConsent(session: Session): Observable<Consent> {
    if (!session) {
      throw new Error('Parameter session should be set');
    }
    return of({ session }).pipe(
      // generate a consent
      map((data) => ({ ...data, consent: this.generateConsent(data.session) })),
      // Determine file location in pod
      switchMap((data) =>
        this.getAllFilesForClass(session, this.consent + 'consents').pipe(
          map((files) => ({ ...data, files })),
        ),
      ),
      map((data) => ({
        ...data,
        file: data.files.length
          ? data.files[0]
          : // assuming webids always end in /profile/card#me
            data.session.info.webId.slice(0, -16) + this.defaultConsentFile,
      })),
      map((data) => ({
        ...data,
        consentThing: this.convertConsentToThing(data.consent),
      })),
      // Update in pod
      switchMap((data) =>
        from(getSolidDataset(data.file, { fetch: data.session.fetch })).pipe(
          map((dataset: SolidDataset) => ({ ...data, dataset })),
          catchError(() =>
            // This should catch a 404 if the file doesnt exist yet
            from(
              saveSolidDatasetAt(data.file, createThing(), {
                fetch: data.session.fetch,
              }),
            ).pipe(
              switchMap(() =>
                from(getSolidDataset(data.file, { fetch: data.session.fetch })),
              ),
              map((dataset: SolidDataset) => ({ ...data, dataset })),
            ),
          ),
        ),
      ),
      map((data) => ({
        ...data,
        updatedDataSet: setThing(data.dataset, data.consentThing),
      })),
      switchMap((data) =>
        from(
          saveSolidDatasetAt(data.file, data.updatedDataSet, {
            fetch: data.session.fetch,
          }),
        ).pipe(map(() => data)),
      ),
      map((data) => data.consent),
    ) as Observable<Consent>;
  }
  private getAllPaySlipsFromFile(
    session: Session,
    file: string,
  ): Observable<PaySlip[]> {
    if (!session) {
      throw Error('Parameter session should be set');
    }
    if (!file) {
      throw Error('Parameter file should be set');
    }

    return of({ session, file }).pipe(
      switchMap((data) =>
        from(getSolidDataset(data.file, { fetch: data.session.fetch })).pipe(
          map((paySlipResponse) => ({ ...data, paySlipResponse })),
        ),
      ),
      map((data) => ({
        ...data,
        allThings: getThingAll(data.paySlipResponse).filter(
          (thing) =>
            getUrl(thing, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type') ===
            this.pay + 'payslip',
        ),
      })),
      map((data) => ({
        ...data,
        finalpayslips: data.allThings.map((thing) =>
          this.transformOneToDomaion(thing),
        ),
      })),
      map((data) => data.finalpayslips),
      catchError(() => of([])),
    ) as Observable<PaySlip[]>;
  }
  private transformOneToDomaion(thing: Thing): PaySlip {
    if (!thing) {
      throw Error('Parameter thing should be set');
    }
    // Using this syntax, if the predicate does not exists,
    // it will still output the number '0'
    const netAmount = +getStringNoLocale(thing, this.pay + 'net-amount');
    const taxableAmount = +getStringNoLocale(
      thing,
      this.pay + 'taxable-amount',
    );
    const grossAmount = +getStringNoLocale(thing, this.pay + 'gross-amount');

    return {
      employer: getUrl(thing, this.pay + 'employer'),
      employee: getUrl(thing, this.pay + 'employee'),
      from: getDatetime(thing, this.pay + 'from'),
      until: getDatetime(thing, this.pay + 'until'),
      stature: getStringNoLocale(thing, this.pay + 'stature'),
      dependent: +getStringNoLocale(thing, this.pay + 'dependent'),
      wageUnit: getUrl(thing, this.pay + 'wage-unit'),
      // If these amounts are 0 it means there was no value
      // found on the solid server. This check is correct since
      // a payslip where any of there numbers are 0 does not exist
      grossAmount: grossAmount ? grossAmount : null,
      taxableAmount: taxableAmount ? taxableAmount : null,
      netAmount: netAmount ? netAmount : null,
    } as PaySlip;
  }
  private generateConsent(session: Session): Consent {
    return {
      subject: session.info.webId,
      controller: 'https://vlaanderen.be/',
      for: 'https://vlaanderen.be/consents/payslips',
      created: new Date(),
      expires: new Date(),
    };
  }
  private convertConsentToThing(consent: Consent): Thing {
    if (!consent) {
      throw new Error('Parameter consent should be set');
    }
    let thing = createThing();
    thing = addUrl(
      thing,
      'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
      this.consent + 'consent',
    );
    thing = addUrl(thing, this.consent + 'subject', consent.subject);
    thing = addUrl(thing, this.consent + 'for', consent.for);
    thing = addUrl(thing, this.consent + 'controller', consent.controller);
    thing = addDatetime(thing, this.consent + 'created', consent.created);
    thing = addDatetime(thing, this.consent + 'expires', consent.expires);
    return thing;
  }
}
