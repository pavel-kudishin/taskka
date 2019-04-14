import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Component } from 'react';
import * as React from 'react';
import { RouterState } from 'react-router-redux';
import { IApplicationState } from '../store';
import * as HttpClient from '../httpClient';
import { actionCreators, ITaskState, IFormData } from '../store/TaskStore';
import * as ReduxForm from 'redux-form';
import { Helmet } from 'react-helmet';

interface IState {
}

interface ITaskProps {

}

type TaskProps = ITaskProps
	& ITaskState
	& typeof actionCreators // ... plus action creators we've requested
	& RouterState
	& ReduxForm.InjectedFormProps<IFormData>;

class Task extends Component<TaskProps, IState> {
	constructor(props: TaskProps) {
		super(props);
	}
	render() {
		if (this.props.isLoading) {
			return (
				<div>
					<Helmet>
						<title>Loading | Create task | Taskka</title>
					</Helmet>
					Идет загрузка...
				</div>
			);
		}
		if (!this.props.board) {
			return (
				<div>
					<Helmet>
						<title>Empty | Task | Taskka</title>
					</Helmet>
					Нет данных
				</div>
			);
		}
		return (
			<div>
				<Helmet>
					<title>{this.props.backgroundWorks > 0 ? '... | ' : ''}Create task | Taskka</title>
				</Helmet>
				<div>{this.props.backgroundWorks > 0 ? 'Идет обмен данными...' : ' '}</div>
			</div>
		);
	}
}

const newForm: ReduxForm.FormDecorator<{}, TaskProps, Partial<ReduxForm.ConfigProps<{}, TaskProps>>> =
	ReduxForm.reduxForm<{}, TaskProps>({
		form: 'taskForm'
	});

const taskForm: ReduxForm.DecoratedComponentClass<{}, TaskProps & Partial<ReduxForm.ConfigProps<{}, TaskProps>>, string> =
	newForm(Task as any);


// Wire up the React component to the Redux store
let mapStateToProps = (state: IApplicationState, ownProps: any): TaskProps => {
	const result = Object.assign({}, state.board, state.routing) as TaskProps;
	return result;
};


export default connect(
	mapStateToProps,
	dispatch => bindActionCreators(actionCreators, dispatch)
)(taskForm as any);