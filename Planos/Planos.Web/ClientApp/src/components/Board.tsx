import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators, IBoardState, IColumns } from '../store/BoardStore';
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

// a little function to help us with reordering the result
const reorder = (list: HttpClient.TaskDto[], startIndex: number, endIndex: number): HttpClient.TaskDto[] => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

/**
 * Moves an item from one list to another list.
 */
const move =
(source: HttpClient.TaskDto[],
	destination: HttpClient.TaskDto[],
	droppableSource: DraggableLocation,
	droppableDestination?: DraggableLocation | null | undefined): IColumns => {

	const sourceClone = Array.from(source);
	const destClone = Array.from(destination);
	const [removed] = sourceClone.splice(droppableSource.index, 1);

	const result: IColumns = { [droppableSource.droppableId]: sourceClone };

	if (droppableDestination) {
		destClone.splice(droppableDestination.index, 0, removed);
		result[droppableDestination.droppableId] = destClone;
	}

	return result;
};

const grid = 8;

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
	width: 250
});

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
			this.state.hubConnection.on('RefreshBoard', (board: HttpClient.StatusDto[]) => {
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

	getList = (id: string): HttpClient.StatusDto | undefined => this.props.board.find(e => e.id === parseInt(id));
	getDroppableId = (id: number): string => id.toString();
	getDraggableId = (id: number): string => `draggable_${id}`;

	onDragEnd = (result: DropResult, provided: ResponderProvided) => {
		const { source, destination }:
			{ source: DraggableLocation, destination?: DraggableLocation | null | undefined } = result;

		// dropped outside the list
		if (!destination) {
			return;
		}

		const sourceStatus = this.getList(source.droppableId);
		if (sourceStatus == undefined) {
			return;
		}

		let boardChanges: IColumns;
		if (source.droppableId === destination.droppableId) {
			const tasks = reorder(
				sourceStatus!.tasks,
				source.index,
				destination.index
			);

			boardChanges = { [source.droppableId]: tasks };
		} else {
			const destinationStatus = this.getList(destination.droppableId);
			if (!destinationStatus) {
				return;
			}
			boardChanges = move(
				sourceStatus!.tasks,
				destinationStatus!.tasks,
				source,
				destination
			);
		}
		this.props.saveBoard(boardChanges);
	};

	getColumn = (status: HttpClient.StatusDto) => (
		<div className="col-sm-3" key={status.id}>
			<div>
				{status.title}
			</div>
			<Droppable droppableId={this.getDroppableId(status.id)}>
				{(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
					<div
						ref={provided.innerRef}
						style={getListStyle(snapshot.isDraggingOver)}>
						{status.tasks.map((item, index) => (
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
										{item.title}
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

	// Normally you would want to split things out into separate components.
	// But in this example everything is just done in one place for simplicity
	render() {
		if (this.props.isLoading) {
			return (
				<div>Идет загрузка...</div>
				);
		}
		const columns = this.props.board.map(this.getColumn);
		return (
			<div>
				<div>{this.props.backgroundWorks > 0 ? 'Идет обмен данными...' : ' '}</div>
				<DragDropContext onDragEnd={this.onDragEnd}>
					<div className="row">
						{columns}
					</div>
				</DragDropContext>
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