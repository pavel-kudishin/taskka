import { Action, Reducer } from 'redux';
import { IAppThunkAction } from './';

export interface IBoardState {
   
}

const initialState: ISettingsState = { isLoading: false, isSuccess: true, token: null };

export interface ISettingsState {
	isLoading: boolean;
	isSuccess: boolean;
	token: string | null;
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
	},
	getBoard: (): IAppThunkAction<KnownAction> => async (dispatch, getState) => {
//		if (startDateIndex === getState().weatherForecasts.startDateIndex) {
//			// Don't issue a duplicate request (we already have or are loading the requested data)
//			return;
//		}
//
//		dispatch({ type: requestWeatherForecastsType, startDateIndex });
//
//		const url = `api/SampleData/WeatherForecasts?startDateIndex=${startDateIndex}`;
//		const response = await fetch(url);
//		const forecasts = await response.json();
//
//		dispatch({ type: receiveWeatherForecastsType, startDateIndex, forecasts });
	}
};

export const reducer: Reducer<ISettingsState> = (state: ISettingsState, action: KnownAction) => {
	state = state || initialState;

	if (action.type === 'RECEIVE_ACCESS_TOKEN') {
		return { ...state, isLoading: state.isLoading };
	}

	return state;
};

