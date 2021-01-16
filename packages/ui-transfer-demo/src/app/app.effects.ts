import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as actions from './app.actions';
import { ConnectionService } from './services/connection.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AppEffects {
  @Effect({ dispatch: false })
  connectProvider$ = this.actions$.pipe(
    ofType(actions.connect),
    switchMap((action) =>
      this.service.connect(action.session, action.provider),
    ),
  );

  @Effect()
  loadProfile$ = this.actions$.pipe(
    ofType(actions.loadProfile),
    switchMap((action) =>
      this.service
        .getName(action.session)
        .pipe(map((name) => ({ action, name }))),
    ),
    switchMap((data) =>
      this.service
        .getPaySlips(data.action.session)
        .pipe(map((payslips) => ({ ...data, payslips }))),
    ),
    switchMap((data) =>
      of(
        actions.loadProfileFinished({
          name: data.name,
          payslips: data.payslips,
          session: data.action.session,
        }),
      ),
    ),
  );

  @Effect()
  loadProdileFinished$ = this.actions$.pipe(
    ofType(actions.loadProfileFinished),
    map((action) => actions.saveConsent({ session: action.session })),
  );

  @Effect({ dispatch: false })
  saveConsent$ = this.actions$.pipe(
    ofType(actions.saveConsent),
    switchMap((action) => this.service.saveConsent(action.session)),
    tap((consent) => console.log('Saved consent to the pod', consent)),
  );

  constructor(private actions$: Actions, private service: ConnectionService) {}
}
