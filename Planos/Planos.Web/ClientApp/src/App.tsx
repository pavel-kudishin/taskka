import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Board from './components/Board';
import Task from './components/Task';

export default () => (
	<Layout>
		<Route exact path="/" component={Home}/>
		<Route path="/board" component={Board}/>
		<Route path="/create-task" component={Task}/>
	</Layout>
);