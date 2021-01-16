import { Component } from '@angular/core';
import { Session } from '@inrupt/solid-client-authn-browser';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { loadProfile } from './app.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private session: Session;

  constructor(
    private store: Store<{ app: { session: Session } }>,
    private translate: TranslateService,
  ) {
    this.store.select<Session>(state => state.app.session).subscribe(session => {
      this.session = session;

      this.checkIncomingRedirect(this.session);
    });

    // Init translations
    this.translate.setDefaultLang('nl_BE');
    this.translate.use('nl_BE');
  }

  private async checkIncomingRedirect(session: Session): Promise<void> {
    if (session && !session.info.isLoggedIn) {
      await session.handleIncomingRedirect(window.location.href).then(info => {
        console.log('Saving info', info);

        if (session.info.isLoggedIn) {
          this.store.dispatch(loadProfile({ session }));
        }
      });
    }
  }
}
