import { Action, Reducer } from 'redux';
import { IAppThunkAction } from './';
import * as HttpClient from '../httpClient'

const initialState: IBoardState = { isLoading: false, isSuccess: true, token: null, board: [], backgroundWorks: 0 };

export interface IBoardState {
	isLoading: boolean;
	backgroundWorks: number;
	board: HttpClient.StatusDto[];
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
	board: HttpClient.StatusDto[];
}

interface IUpdateBoardAction {
	type: 'UPDATE_BOARD';
	data: { [key: string]: HttpClient.TaskDto[]};
}

interface ISetLoadingAction {
	type: 'SET_BACKGROUND_WORK';
	isBackgroundWork: boolean;
}

interface IReceiveAccessTokenAction {
	type: 'RECEIVE_ACCESS_TOKEN';
	token: string | undefined;
}


// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = IRequestBoardAction | IReceiveBoardAction | IReceiveAccessTokenAction
	| ISetLoadingAction | IUpdateBoardAction;

export const actionCreators = {
	getAccessToken: (): IAppThunkAction<KnownAction> => (dispatch, getState) => {
	},
	getBoard: (): IAppThunkAction<KnownAction> => (dispatch, getState) => {
		dispatch({ type: 'REQUEST_BOARD' });

		const client: HttpClient.Client = createHttpClient('');
		return client
			.getBoard()
			.then((board: HttpClient.StatusDto[]) => {
				dispatch({ type: 'RECEIVE_BOARD', isSuccess: true, board: board });
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
	},
	saveBoard: (rawData: { [key: string]: HttpClient.TaskDto[] })
		: IAppThunkAction<KnownAction> => (dispatch, getState) => {
		//dispatch({ type: 'SET_LOADING', isLoading: true });
		dispatch({ type: 'UPDATE_BOARD', data: rawData });

		const data: { [key: string]: string[]; } = {};
		for (let statusId in rawData) {
			if (rawData.hasOwnProperty(statusId)) {
				data[statusId] = rawData[statusId].map((task) => task.id);
			}
		}

		const client: HttpClient.Client = createHttpClient('');
		return client
			.saveBoardPriority(data)
			.then(() => {
				dispatch({ type: 'SET_BACKGROUND_WORK', isBackgroundWork: false });
			});
	},
};

export const reducer: Reducer<IBoardState> = (state: IBoardState, action: KnownAction) => {
	state = state || initialState;

	if (action.type === 'SET_BACKGROUND_WORK') {
		const newState = { ...state };
		if (action.isBackgroundWork) {
			newState.backgroundWorks++;
		} else {
			newState.backgroundWorks--;
		}
		return newState;
	}
	if (action.type === 'REQUEST_BOARD') {
		return {
			...state,
			isLoading: true
		};
	}
	if (action.type === 'RECEIVE_BOARD') {
		return {
			...state,
			isSuccess: action.isSuccess,
			board: action.board,
			isLoading: false
		};
	}
	if (action.type === 'UPDATE_BOARD') {
		const newState = { ...state };
		newState.backgroundWorks++;

		for (let statusId in action.data) {
			if (action.data.hasOwnProperty(statusId)) {
				const status = newState.board.find((value: HttpClient.StatusDto) => value.id === statusId);
				if (status) {
					status.tasks = action.data[statusId];
				}
			}
		}

		return newState;
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
