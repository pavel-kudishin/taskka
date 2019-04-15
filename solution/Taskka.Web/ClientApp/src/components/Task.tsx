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
import Spinners from './Spinners';

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
		this.mySubmitFunction = this.mySubmitFunction.bind(this);
	}

	mySubmitFunction(values: IFormData): void {
		const task: HttpClient.TaskDto = new HttpClient.TaskDto({
				title: values.title||'', id: 0, priority: 0, statusId: 0
			});
		this.props.saveTask(task);
		this.props.reset();
	}

	render() {
		if (this.props.isSaving) {
			return (
				<div>
					<Helmet>
						<title>Saving | Create task | Taskka</title>
					</Helmet>
					<Spinners.Spinner />
				</div>
			);
		}
		const { handleSubmit, pristine, reset, submitting } = this.props;
		return (
			<div>
				<Helmet>
					<title>{this.props.backgroundWorks > 0 ? '... | ' : ''}Create task | Taskka</title>
				</Helmet>
				<div>{this.props.backgroundWorks > 0 ? 'Идет обмен данными...' : ' '}</div>
				<form onSubmit={this.props.handleSubmit(this.mySubmitFunction)}>
					<div>
						<label>Title</label>
						<div>
							<ReduxForm.Field
								name="title"
								component="input"
								type="text"
								placeholder="Task title" />
						</div>
					</div>
					<div>
						<button type="submit" disabled={pristine || submitting} className="btn btn-primary btn-sm">
							Save
						</button>
					</div>
				</form>
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
	const result = Object.assign({}, state.task, state.routing) as TaskProps;
	return result;
};


export default connect(
	mapStateToProps,
	dispatch => bindActionCreators(actionCreators, dispatch)
)(taskForm as any);