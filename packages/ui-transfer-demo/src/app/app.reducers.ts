import { createReducer, on } from '@ngrx/store';
import { Session } from '@inrupt/solid-client-authn-browser';
import * as actions from './app.actions';

export const initialState = {
  session: new Session(),
  name: null,
  payslips: null,
};

const appReducerFactory = createReducer(
  initialState,
  on(actions.loadProfileFinished, (state, { name, payslips }) => ({
    ...state,
    name,
    payslips,
  })),
);

export const appReducer = (state, action): any =>
  appReducerFactory(state, action);
