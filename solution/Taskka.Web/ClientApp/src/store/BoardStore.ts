import { Action, Reducer } from 'redux';
import { IAppThunkAction, createHttpClient } from './';
import * as HttpClient from '../httpClient'
import { cloneDeep } from 'lodash';

export interface IColumns {
	[x: string]: HttpClient.TaskDto[]
}

const initialState: IBoardState = { isLoading: false, isSuccess: true, token: null, board: undefined, backgroundWorks: 0 };

export interface IBoardState {
	isLoading: boolean;
	backgroundWorks: number;
	board?: HttpClient.BoardDto;
	isSuccess: boolean;
	token: string | null;
}


// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface IRequestBoardAction {
	type: 'BOARD/REQUEST_BOARD';
}

interface IReceiveBoardAction {
	type: 'BOARD/RECEIVE_BOARD';
	isSuccess: boolean;
	board: HttpClient.BoardDto;
}

interface ISetLoadingAction {
	type: 'BOARD/SET_BACKGROUND_WORK';
	isBackgroundWork: boolean;
}

interface IReceiveAccessTokenAction {
	type: 'BOARD/RECEIVE_ACCESS_TOKEN';
	token: string | undefined;
}

interface IUpdateTaskAction {
	type: 'BOARD/UPDATE_TASK';
	taskId: number;
	priority: number;
	statusId: number;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = IRequestBoardAction | IReceiveBoardAction | IReceiveAccessTokenAction
	| ISetLoadingAction | IUpdateTaskAction;

export const actionCreators = {
	getAccessToken: (): IAppThunkAction<KnownAction> => (dispatch, getState) => {
	},
	getBoard: (): IAppThunkAction<KnownAction> => (dispatch, getState) => {
		dispatch({ type: 'BOARD/REQUEST_BOARD' });

		const client: HttpClient.Client = createHttpClient('');
		return client
			.getBoard()
			.then((board: HttpClient.BoardDto) => {
				dispatch({ type: 'BOARD/RECEIVE_BOARD', isSuccess: true, board: board });
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
	refreshBoard: (board: HttpClient.BoardDto): IAppThunkAction<KnownAction> => (dispatch, getState) => {
		dispatch({ type: 'BOARD/RECEIVE_BOARD', isSuccess: true, board: board });
	},
	updateTask: (taskId: number, priority: number, statusId: number): IAppThunkAction<KnownAction> => (dispatch, getState) => {
		dispatch({ type: 'BOARD/SET_BACKGROUND_WORK', isBackgroundWork: true });
		dispatch({ type: 'BOARD/UPDATE_TASK', taskId: taskId, priority: priority, statusId: statusId });
		const client: HttpClient.Client = createHttpClient('');
		return client
			.updateTask(taskId, priority, statusId)
			.then(() => {
				dispatch({ type: 'BOARD/SET_BACKGROUND_WORK', isBackgroundWork: false });
			});
	},
};

export const reducer: Reducer<IBoardState> = (state: IBoardState, action: KnownAction) => {
	state = state || initialState;

	if (action.type === 'BOARD/SET_BACKGROUND_WORK') {
		const newState = cloneDeep(state);
		if (action.isBackgroundWork) {
			newState.backgroundWorks++;
		} else {
			newState.backgroundWorks--;
		}
		return newState;
	}
	if (action.type === 'BOARD/REQUEST_BOARD') {
		const newState = cloneDeep(state);
		newState.isLoading = true;
		return newState;
	}
	if (action.type === 'BOARD/RECEIVE_BOARD') {
		const newState = cloneDeep(state);
		newState.isSuccess= action.isSuccess;
		newState.board = action.board;
		newState.isLoading = false;
		return newState;
	}
	if (action.type === 'BOARD/UPDATE_TASK') {
		const newState = cloneDeep(state);
		if (newState.board) {
			const task = newState.board.tasks.find((t: HttpClient.TaskDto) => t.id === action.taskId);
			if (task) {
				task.priority = action.priority;
				task.statusId = action.statusId;
			}

		}
		return newState;
	}

	return state;
};

