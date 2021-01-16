import { Component, OnInit } from '@angular/core';
import { Session } from '@inrupt/solid-client-authn-browser';
import { Store } from '@ngrx/store';
import { connect } from '../../app.actions';

@Component({
  selector: 'app-connect-page',
  templateUrl: './connect-page.component.html',
  styleUrls: ['./connect-page.component.scss']
})
export class ConnectPageComponent implements OnInit {
  public session: Session;

  constructor(
    private store: Store<{ app: { session: Session } }>
  ) {
    this.store.select<Session>(state => state.app.session).subscribe(session => this.session = session);
  }

  ngOnInit(): void { }

  public connect(session: Session, provider: string): void {
    console.log('User clicked connect button', { session, provider });

    if (!session) {
        throw Error('Paramet session should be set');
    }

    if (!provider) {
        throw Error('Paramet provider should be set');
    }

    this.store.dispatch(connect({ session: this.session, provider: 'https://inrupt.net' }));
  }
}
