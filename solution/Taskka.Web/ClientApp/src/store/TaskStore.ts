import { Action, Reducer } from 'redux';
import { IAppThunkAction, createHttpClient } from './';
import * as HttpClient from '../httpClient'
import { cloneDeep } from 'lodash';

export interface IFormData {
	id?: number;
	title?: string;
}


export interface IColumns {
	[x: string]: HttpClient.TaskDto[]
}

const initialState: ITaskState = { isSaving: false, isSuccess: true, backgroundWorks: 0 };

export interface ITaskState {
	isSaving: boolean;
	backgroundWorks: number;
	isSuccess: boolean;
}


// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface ISavingTaskAction {
	type: 'TASK/SAVING_TASK';
}

interface ITaskSavedAction {
	type: 'TASK/TASK_SAVED';
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = ITaskSavedAction | ISavingTaskAction;

export const actionCreators = {
	saveTask: (task: HttpClient.TaskDto): IAppThunkAction<KnownAction> => (dispatch, getState) => {
		dispatch({ type: 'TASK/SAVING_TASK' });
		const client: HttpClient.Client = createHttpClient('');
		return client
			.saveTask(task)
			.then(() => {
				dispatch({ type: 'TASK/TASK_SAVED' });
			});
	},
};

export const reducer: Reducer<ITaskState> = (state: ITaskState, action: KnownAction) => {
	state = state || initialState;

	if (action.type === 'TASK/SAVING_TASK') {
		const newState = cloneDeep(state);
		newState.isSaving = true;
		return newState;
	}
	if (action.type === 'TASK/TASK_SAVED') {
		const newState = cloneDeep(state);
		newState.isSaving = false;
		return newState;
	}

	return state;
};
