import React from 'react';
import {BrowserRouter, Route, Switch, Link, NavLink} from 'react-router-dom';
import Header from '../components/Header';
import Home from '../components/Home';
import MonitorRam from "../components/MonitorRam";

const AppRouter=()=>(
    <BrowserRouter >
    <div>
    <Header title='PY1_SOPES1- 201213181'></Header>
      <Switch>
      <Route path="/" component={Home} exact={true}/>
      <Route path="/ram" component={MonitorRam}/> 
      </Switch>  
    </div>
    </BrowserRouter>
);

export default AppRouter;