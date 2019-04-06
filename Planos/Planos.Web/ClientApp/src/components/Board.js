﻿import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/Counter';
import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const statuses = [
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
const getItems = (count, offset = 0) =>
	Array.from({ length: count }, (v, k) => k).map(k => ({
		id: `task-${k + offset}`,
		content: `Реализовать отчет ${k + offset}`
	}));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
	const sourceClone = Array.from(source);
	const destClone = Array.from(destination);
	const [removed] = sourceClone.splice(droppableSource.index, 1);

	destClone.splice(droppableDestination.index, 0, removed);

	const result = {};
	result[droppableSource.droppableId] = sourceClone;
	result[droppableDestination.droppableId] = destClone;

	return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
	// some basic styles to make the items look a bit nicer
	userSelect: 'none',
	padding: grid * 2,
	margin: `0 0 ${grid}px 0`,

	// change background colour if dragging
	background: isDragging ? 'lightgreen' : '#ffffff',

	// styles we need to apply on draggables
	...draggableStyle
});

const getListStyle = isDraggingOver => ({
	background: isDraggingOver ? 'lightblue' : 'lightgrey',
	padding: grid,
	width: 250
});

class Board extends Component {
    constructor(props) {
		super(props);
		this.state = {
		};

		let offset = 0;
        for (let i = 0; i < statuses.length; i++) {
			const count = Math.round(Math.random() * 10);
            this.state[this.getName(statuses[i].id)] = getItems(count, offset);
			offset += count;
		}
    }

    getName = id => `droppable${id}`;

    getList = id => this.state[id];
    
    onDragEnd = result => {
        const { source, destination } = result;

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
                    {(provided, snapshot) => (
						<div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}>
                            {me.getList(me.getName(status.id)).map((item, index) => (
								<Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}>
                                    {(provided, snapshot) => (
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

export default connect(
	state => state.counter,
	dispatch => bindActionCreators(actionCreators, dispatch)
)(Board);