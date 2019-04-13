import {
	applyMiddleware,
	combineReducers,
	compose,
	createStore,
	StoreEnhancerStoreCreator
} from 'redux';
import thunk from 'redux-thunk';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { History } from 'history';
import * as Board from './BoardStore'

export interface IInitialState {
}

export interface IWindow {
	initialReduxState: IInitialState;
	devToolsExtension?: () => any;
}

export default function configureStore(history: History, initialState: IInitialState) {
	const reducers = {
		board: Board.reducer
	};

	const middleware = [
		thunk,
		routerMiddleware(history)
	];

	// In development, use the browser's Redux dev tools extension if installed
	const enhancers: StoreEnhancerStoreCreator<{}>[] = [];
	const isDevelopment = process.env.NODE_ENV === 'development';
	const w = ((window as any) as IWindow);
	if (isDevelopment && typeof window !== 'undefined' && w.devToolsExtension) {
		enhancers.push(w.devToolsExtension());
	}

	const rootReducer = combineReducers({
		...reducers,
		routing: routerReducer
	});

	const storeEnhancer = applyMiddleware(...middleware);
	const enhancer = compose<StoreEnhancerStoreCreator<{}>>(storeEnhancer, ...enhancers);
	return createStore(
		rootReducer,
		initialState,
		enhancer
	);
}