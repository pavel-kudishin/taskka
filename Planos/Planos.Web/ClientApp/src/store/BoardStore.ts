import { Action, Reducer } from 'redux';
import { IAppThunkAction } from './';
import * as HttpClient from '../httpClient'

export interface IColumns {
	[x: string]: HttpClient.TaskDto[]
}

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
	| ISetLoadingAction;

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
	saveBoard: (boardChanges: IColumns): IAppThunkAction<KnownAction> => (dispatch, getState) => {

		dispatch({ type: 'SET_BACKGROUND_WORK', isBackgroundWork: true });

		const board: HttpClient.StatusDto[] = Array.from(getState().board.board);
		for (let statusId in boardChanges) {
			if (boardChanges.hasOwnProperty(statusId)) {
				const status = board.find((status: HttpClient.StatusDto) => status.id.toString() === statusId);
				if (status) {
					status.tasks = boardChanges[statusId];
					for (let i = 0; i < status.tasks.length; i++) {
						const task = status.tasks[i];
						task.statusId = status.id;
						task.priority = i;
					}
				}
			}
		}

		dispatch({ type: 'RECEIVE_BOARD', isSuccess: true, board: board });

		const tasks: HttpClient.TaskDto[] = [];
		for (let j = 0; j < board.length; j++) {
			const statusDto = board[j];
			for (let k = 0; k < statusDto.tasks.length; k++) {
				tasks.push(statusDto.tasks[k]);
			}
		}

		const client: HttpClient.Client = createHttpClient('');
		return client
			.saveBoardChanges(tasks)
			.then(() => {
				dispatch({ type: 'SET_BACKGROUND_WORK', isBackgroundWork: false });
			});
		},
	refreshBoard: (board: HttpClient.StatusDto[]): IAppThunkAction<KnownAction> => (dispatch, getState) => {
		dispatch({ type: 'RECEIVE_BOARD', isSuccess: true, board: board });
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
