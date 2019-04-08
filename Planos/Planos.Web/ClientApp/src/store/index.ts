import { RouterState } from 'react-router-redux';
import { IBoardState } from './BoardStore';

export type ThunkAction<TAction> = (action: TAction) => void;

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface IAppThunkAction<TAction> {
    (dispatch: ThunkAction<TAction>, getState: () => IApplicationState): any;
}

// The top-level state object
export interface IApplicationState {
    //alerts: IAlertsState,
    //confirm: IConfirmState,
    //settings: SettingsState.ISettingsState;
    board: IBoardState;
    routing: RouterState;
}

