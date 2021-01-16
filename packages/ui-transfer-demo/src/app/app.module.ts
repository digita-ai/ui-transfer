import { BrowserModule } from '@angular/platform-browser';
import { ModuleWithProviders, NgModule, Type } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { appReducer } from './app.reducers';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { RootPageComponent } from './pages/root-page/root-page.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HeaderComponent } from './components/header/header.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { DescriptionPageComponent } from './pages/description-page/description-page.component';
import { ConnectPageComponent } from './pages/connect-page/connect-page.component';
import { SeparatorComponent } from './components/separator/separator.component';
import { SourceComponent } from './components/source/source.component';
import { MatIconModule } from '@angular/material/icon';
import { AppEffects } from './app.effects';
import { EffectsModule } from '@ngrx/effects';
import { ConfirmationPageComponent } from './pages/confirmation-page/confirmation-page.component';
import { ConnectionService } from './services/connection.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader, } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RequestedDataComponent } from './components/requested-data/requested-data.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { LoginButtonComponent } from './components/login-button/login-button.component';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

export const imports: (any[] | Type<any> | ModuleWithProviders<{}>)[] = [
  FlexLayoutModule,
  BrowserModule,
  AppRoutingModule,
  BrowserAnimationsModule,
  CommonModule,
  MatButtonModule,
  MatToolbarModule,
  MatDividerModule,
  MatIconModule,
  HttpClientModule,
  StoreModule.forRoot({ app: appReducer }, {
    runtimeChecks: {
      strictStateImmutability: false,
      strictActionImmutability: false,
    },
  }),
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient],
    }
  }),
  EffectsModule.forRoot([AppEffects]),
  StoreRouterConnectingModule.forRoot(),
  StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
];

export const declarations = [
  AppComponent,
  RootPageComponent,
  HeaderComponent,
  LandingPageComponent,
  ConnectPageComponent,
  DescriptionPageComponent,
  SeparatorComponent,
  SourceComponent,
  ConfirmationPageComponent,
  RequestedDataComponent,
  LoginButtonComponent,
  LoginPageComponent,
];

export const providers = [
  ConnectionService,
];

@NgModule({
  declarations,
  imports,
  providers,
  bootstrap: [AppComponent],
})

export class AppModule { }


