import ReactDOM from 'react-dom';
import React from 'react';

import {BrowserRouter, Route, Switch} from 'react-router-dom'

import "./service/SecurityInterceptor.js";
import Layout from './layout/Layout';


ReactDOM.render((
  <BrowserRouter>
    <Layout>
      <Switch>
        <Route exact path='/app/videos/list' component={ListView}/>
        <Route exact path='/app/videos/details' component={DetailsView}/>
        <Route exact path='/app/login' component={Login}/>
        <Route component={ListView}/>
      </Switch>
    </Layout>
  </BrowserRouter>
), document.getElementById('root'));
