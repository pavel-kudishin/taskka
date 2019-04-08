import { Action, Reducer } from 'redux';
import { IAppThunkAction } from './';

export interface IBoardState {
   
}

const initialState = { isLoading: false };

export interface ISettingsState {
    isLoading: boolean;
    isSuccess: boolean;
    token: string;
}


// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface IRequestMenuItemsAction {
    type: 'REQUEST_MENU_ITEMS';
}

interface IReceiveMenuItemsAction {
    type: 'RECEIVE_MENU_ITEMS';
    isSuccess: boolean;
}

interface IReceiveAccessTokenAction {
    type: 'RECEIVE_ACCESS_TOKEN';
    token: string | undefined;
}


// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = IRequestMenuItemsAction | IReceiveMenuItemsAction | IReceiveAccessTokenAction;


export const actionCreators = {
    getAccessToken: (): IAppThunkAction<KnownAction> => (dispatch, getState) => {
    }
};

export const reducer: Reducer<ISettingsState> = (state: ISettingsState, incomingAction: Action) => {
    state = state || initialState;
    const action = incomingAction as KnownAction;

    if (action.type === 'RECEIVE_ACCESS_TOKEN') {
        return { ...state, isLoading: state.isLoading };
    }

    return state;
};

