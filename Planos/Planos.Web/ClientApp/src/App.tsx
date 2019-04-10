import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Board from './components/Board';

export default () => (
    <Layout>
        <Route exact path="/" component={Home}/>
        <Route path="/board" component={Board}/>
    </Layout>
);