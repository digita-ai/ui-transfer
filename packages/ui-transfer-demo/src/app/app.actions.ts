import { createAction, props } from '@ngrx/store';
import { Session } from '@inrupt/solid-client-authn-browser';
import { PaySlip } from './models/payslip.model';

export const ActionTypes = {
    CONNECT: '[App] Connect',
    LOAD_PROFILE: '[App] Load profile',
    LOAD_PROFILE_FINISHED: '[App] Load profile finished',
    SAVE_CONSENT: '[App] Save Consent',
};

export const connect = createAction(
    ActionTypes.CONNECT,
    props<{ session: Session, provider: string }>(),
);

export const loadProfile = createAction(
    ActionTypes.LOAD_PROFILE,
    props<{ session: Session }>(),
);

export const loadProfileFinished = createAction(
    ActionTypes.LOAD_PROFILE_FINISHED,
    props<{ name: string, payslips: PaySlip[], session: Session }>(),
);

export const saveConsent = createAction(
    ActionTypes.SAVE_CONSENT,
    props<{ session: Session }>(),
);
