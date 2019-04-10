import { Action, Reducer } from 'redux';
import { IAppThunkAction } from './';
import * as HttpClient from '../httpClient'

const initialState: IBoardState = { isLoading: false, isSuccess: true, token: null };

export interface IBoardState {
	isLoading: boolean;
	isSuccess: boolean;
	token: string | null;
}


// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface IRequestBoardAction {
	type: 'REQUEST_BOARD';
}

interface IReceiveBoardAction {
	type: 'RECEIVE_BOARD';
	isSuccess: boolean;
}

interface ISetLoadingAction {
	type: 'SET_LOADING';
	isLoading: boolean;
}

interface IReceiveAccessTokenAction {
	type: 'RECEIVE_ACCESS_TOKEN';
	token: string | undefined;
}


// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = IRequestBoardAction | IReceiveBoardAction | IReceiveAccessTokenAction
	| ISetLoadingAction;

export const actionCreators = {
	getAccessToken: (): IAppThunkAction<KnownAction> => (dispatch, getState) => {
	},
	getBoard: (): IAppThunkAction<KnownAction> => (dispatch, getState) => {
		dispatch({ type: 'SET_LOADING', isLoading: true });

		const client: HttpClient.Client = createHttpClient('');
		return client
			.getBoard()
			.then((res: HttpClient.StatusDto[]) => {
				dispatch({ type: 'SET_LOADING', isLoading: false });
				return res;
			});


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

export const reducer: Reducer<IBoardState> = (state: IBoardState, action: KnownAction) => {
	state = state || initialState;

	if (action.type === 'SET_LOADING') {
		return {
			...state,
			isLoading: action.isLoading
		};
	}

	return state;
};


export function createHttpClient(token: string): HttpClient.Client {
	const options: RequestInit = {
		credentials: 'include',
		headers: {
			"Authorization": `Bearer ${token}`
		}
	};

	const http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> } =
	{
		fetch: (url, init) => {
			let newOptions = options;
			if (init != undefined) {
				newOptions = Object.assign({}, init, options);
				newOptions.headers = Object.assign({}, init.headers, options.headers);
			}

			return fetch(url, newOptions);
		}
	};
	const client: HttpClient.Client = new HttpClient.Client(undefined, http);
	return client;
}
