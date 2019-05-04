import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators, IBoardState } from '../store/BoardStore';
import { Component } from 'react';
import * as React from 'react';
import {
	DragDropContext,
	Droppable,
	Draggable,
	DropResult,
	ResponderProvided,
	DraggableLocation,
	DroppableStateSnapshot,
	DroppableProvided,
	DraggableStateSnapshot,
	DraggableProvided
} from 'react-beautiful-dnd';
import { RouterState } from 'react-router-redux';
import { IApplicationState } from '../store';
import * as HttpClient from '../httpClient';
import { HubConnectionBuilder, HubConnection } from '@aspnet/signalr';
import { Helmet } from 'react-helmet';
import Spinners from './Spinners';

const grid = 4;

const getItemStyle = (isDragging: boolean, draggableStyle: any): React.CSSProperties => ({
	// some basic styles to make the items look a bit nicer
	userSelect: 'none',
	padding: grid * 2,
	margin: `0 0 ${grid}px 0`,

	// change background colour if dragging
	background: isDragging ? 'lightgreen' : '#ffffff',

	// styles we need to apply on draggables
	...draggableStyle
} as React.CSSProperties);

const getListStyle = (isDraggingOver: boolean) => ({
	background: isDraggingOver ? 'lightblue' : 'lightgrey',
	padding: grid,
	//width: 100
});

const getPriority = (index: number, tasks: HttpClient.TaskDto[]): number => {
	if (index === 0) {
		if (tasks.length === 0) {
			return 100;
		}
		return tasks[0].priority - 1;
	}
	if (index >= tasks.length - 1) {
		const lastTask = tasks[tasks.length - 1];
		return lastTask.priority + 1;
	}
	const previousTask = tasks[index - 1];
	const nextTask = tasks[index];
	return (previousTask.priority + nextTask.priority) / 2;
}

interface IBoardProps {

}

interface IState {
	hubConnection: HubConnection;
}

type BoardProps = IBoardProps
	& IBoardState
	& typeof actionCreators // ... plus action creators we've requested
	& RouterState;

class Board extends Component<BoardProps, IState> {
	constructor(props: BoardProps) {
		super(props);
	}

	componentDidMount() {
		// This method is called when the component is first added to the document
		this.ensureDataFetched();

		const hubConnection = new HubConnectionBuilder()
			.withUrl('/signal-board')
			.build();

		this.setState({ hubConnection }, () => {
			this.state.hubConnection
				.start()
				.then(() => console.log('Board connection started!'))
				.catch(err => console.log('Error while starting Board connection: ' + err));

			this.state.hubConnection.on('sendToAll', (nick, receivedMessage) => {
				const text = `${nick}: ${receivedMessage}`;
				console.log(text);
			});
			this.state.hubConnection.on('RefreshBoard', (board: HttpClient.BoardDto) => {
				console.log('RefreshBoard');
				this.props.refreshBoard(board);
			});
		});
	}

	componentDidUpdate() {
		// This method is called when the route parameters change
		//this.ensureDataFetched();
	}

	componentWillUnmount() {
		this.state.hubConnection
			.stop()
			.then(() => console.log('Board connection stopped!'))
			.catch(err => console.log('Error while stopping Board connection: ' + err));
	}

	ensureDataFetched() {
		this.props.getBoard();
	}

	getColumnTasks = (droppableId: string): HttpClient.TaskDto[] => {
		if (this.props.board) {
			return this.props.board
				.tasks
				.filter((task) => task.statusId === this.getStatusId(droppableId))
				.sort((a, b) => a.priority - b.priority !== 0 ? a.priority - b.priority : a.id - b.id);
		} else {
			return [];
		}
	};
	getDroppableId = (statusId: number): string => statusId.toString();
	getDraggableId = (id: number): string => `draggable_${id}`;
	getStatusId = (droppableId: string): number => parseInt(droppableId);

	onDragEnd = (result: DropResult, provided: ResponderProvided) => {
		const { source, destination }:
			{ source: DraggableLocation, destination?: DraggableLocation | null | undefined } = result;

		// dropped outside the list
		if (!destination) {
			return;
		}

		const sourceTasks = this.getColumnTasks(source.droppableId);
		if (!sourceTasks) {
			return;
		}
		const destinationTasks = this.getColumnTasks(destination.droppableId);
		if (!destinationTasks) {
			return;
		}

		const task = sourceTasks[source.index];
		const priority = getPriority(destination.index, destinationTasks);
		const statusId = this.getStatusId(destination.droppableId);
		this.props.updateTask(task.id, priority, statusId);
	};

	getColumn = (status: HttpClient.StatusDto) => {
		const droppableId = this.getDroppableId(status.id);
		const tasks = this.getColumnTasks(droppableId);
		return (
			<div className="col" key={status.id} style={{minWidth: '150px', maxWidth: '300px', padding: '0px 2px 10px 2px'}}>
				<div style={{backgroundColor: 'lightblue', paddingLeft: '8px'}}>
					{status.name}
				</div>
				<Droppable droppableId={droppableId}>
					{(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
						<div
							ref={provided.innerRef}
							style={getListStyle(snapshot.isDraggingOver)}>
							{tasks.map((item, index) => (
								<Draggable
									key={item.id}
									draggableId={this.getDraggableId(item.id)}
									index={index}>
									{(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
										<div
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
											style={getItemStyle(
													snapshot.isDragging,
													provided.draggableProps.style
												)}>
											{item.summary}
										</div>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</div>
		);
	}

	// Normally you would want to split things out into separate components.
	// But in this example everything is just done in one place for simplicity
	render() {
		const boardName = 'Main board';
		if (this.props.isLoading) {
			return (
				<div>
					<Helmet>
						<title>Loading | {boardName} | Taskka</title>
					</Helmet>
					<Spinners.Spinner />
				</div>
				);
		}
		if (!this.props.board) {
			return (
				<div>
					<Helmet>
						<title>Empty | {boardName} | Taskka</title>
					</Helmet>
					No data
				</div>
			);
		}
		const columns = this.props.board.statuses.map(this.getColumn);
		return (
			<div>
				<Helmet>
					<title>{this.props.backgroundWorks > 0 ? '... | ' : ''}{boardName} | Taskka</title>
				</Helmet>
				<DragDropContext onDragEnd={this.onDragEnd}>
					<div className="row">
						{columns}
					</div>
				</DragDropContext>
				<div>{this.props.backgroundWorks > 0 ? <Spinners.LoadingBar /> : ' '}</div>
			</div>
		);
	}
}

// Wire up the React component to the Redux store
let mapStateToProps = (state: IApplicationState, ownProps: any): BoardProps => {
	const result = Object.assign({}, state.board, state.routing) as BoardProps;
	return result;
};


export default connect(
	mapStateToProps,
	dispatch => bindActionCreators(actionCreators, dispatch)
)(Board);