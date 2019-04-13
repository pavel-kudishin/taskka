import { RouterState } from 'react-router-redux';
import { IBoardState } from './BoardStore';
import * as HttpClient from '../httpClient'

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
