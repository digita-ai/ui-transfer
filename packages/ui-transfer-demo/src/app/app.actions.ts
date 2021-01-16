import { createAction, props } from '@ngrx/store';
import { Session } from '@inrupt/solid-client-authn-browser';
import { PaySlip } from './models/payslip.model';

/* eslint @typescript-eslint/naming-convention: 0 */
export const ACTION_TYPES = {
    CONNECT: '[App] Connect',
    LOAD_PROFILE: '[App] Load profile',
    LOAD_PROFILE_FINISHED: '[App] Load profile finished',
    SAVE_CONSENT: '[App] Save Consent',
};

export const connect = createAction(
    ACTION_TYPES.CONNECT,
    props<{ session: Session; provider: string }>(),
);

export const loadProfile = createAction(
    ACTION_TYPES.LOAD_PROFILE,
    props<{ session: Session }>(),
);

export const loadProfileFinished = createAction(
    ACTION_TYPES.LOAD_PROFILE_FINISHED,
    props<{ name: string; payslips: PaySlip[]; session: Session }>(),
);

export const saveConsent = createAction(
    ACTION_TYPES.SAVE_CONSENT,
    props<{ session: Session }>(),
);
