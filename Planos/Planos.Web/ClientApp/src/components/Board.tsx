import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/BoardStore';
import { Component } from 'react';
import * as React from 'react';
import {
    DragDropContext, Droppable, Draggable, DropResult, ResponderProvided,
    DraggableLocation, DroppableStateSnapshot, DroppableProvided,
    DraggableStateSnapshot, DraggableProvided
} from 'react-beautiful-dnd';
import { RouterState } from 'react-router-redux';
import { IApplicationState } from '../store';

interface IStatus {
    id: number;
    title: string;
}

interface ITask {
    id: string;
    content: string;
}

const statuses: IStatus[] = [
	{
		id: 1,
        title: 'План'
	},
	{
		id: 2,
        title: 'В работе'
	},
	{
		id: 3,
		title: 'Тестирование'
	},
	{
		id: 4,
		title: 'Проверено'
	},
];

// fake data generator
const getItems = (count: number, offset: number = 0): ITask[] =>
	Array.from({ length: count }, (v, k) => k).map(k => ({
		id: `task-${k + offset}`,
		content: `Реализовать отчет ${k + offset}`
    } as ITask));

// a little function to help us with reordering the result
const reorder = (list: ITask[], startIndex: number, endIndex: number): ITask[] => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source: ITask[], destination: ITask[], droppableSource: DraggableLocation, droppableDestination?: DraggableLocation | null | undefined): IColumns => {
	const sourceClone = Array.from(source);
	const destClone = Array.from(destination);
	const [removed] = sourceClone.splice(droppableSource.index, 1);

    if (droppableDestination) {
        destClone.splice(droppableDestination.index, 0, removed);
    }

    const result: { [x: string]: ITask[] } = {};

    result[droppableSource.droppableId] = sourceClone;
    if (droppableDestination) {
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

interface IColumns {
    [x: string]: ITask[]
}

interface IBoardState {
    [x: string]: ITask[]
}

type BoardProps = IBoardProps
    & RouterState;

class Board extends Component<BoardProps, IBoardState> {
    constructor(props: BoardProps) {
		super(props);

        const state: IBoardState = {};
		let offset = 0;
        for (let i = 0; i < statuses.length; i++) {
			const count = Math.round(Math.random() * 10);
            state[this.getName(statuses[i].id)] = getItems(count, offset);
			offset += count;
        }

        this.state = state;
    }

    getName = (id: number) => `droppable${id}`;

    getList = (id: string): ITask[] => this.state[id];
    
    onDragEnd = (result: DropResult, provided: ResponderProvided) => {
        const { source, destination}: { source: DraggableLocation, destination?: DraggableLocation | null | undefined } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                this.getList(source.droppableId),
                source.index,
                destination.index
            );

			const state = { [source.droppableId]: items };

            this.setState(state);
        } else {
            const result = move(
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination
            );

            this.setState(result);
        }
    };

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {
		const me = this;
		const columns = statuses.map((status) => (
				<div className="col-sm-3">
                <div>
                    {status.title}
                 </div>
                <Droppable droppableId={me.getName(status.id)}>
                    {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
						<div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}>
                            {me.getList(me.getName(status.id)).map((item, index) => (
								<Draggable
                                    key={item.id}
                                    draggableId={item.id}
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
                                            {item.content}
                                        </div>
									)}
                                </Draggable>
							))}
                            {provided.placeholder}
                        </div>
					)}
                </Droppable>
            </div>
			)
		);
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <div className="row">
                    {columns}
                </div>
            </DragDropContext>
        );
    }
}

// Wire up the React component to the Redux store
let mapStateToProps = (state: IApplicationState, ownProps: any): BoardProps => {
    const result: BoardProps = Object.assign({}, state.board, state.routing) as BoardProps;
    return result;
};


export default connect(
    mapStateToProps,
	dispatch => bindActionCreators(actionCreators, dispatch)
)(Board);