import React from 'react';
import {BrowserRouter, Route, Switch, Link, NavLink} from 'react-router-dom';
import Header from '../components/Header';
import Home from '../components/Home';


const AppRouter=()=>(
    <BrowserRouter >
    <div>
    <Header title='PY1_SOPES1- 201213181'></Header>
      <Switch>
      <Route path="/" component={Home} exact={true}/>
      {/* <Route path="/ast" component={ReporteAST}/> */}
      </Switch>  
    </div>
    </BrowserRouter>
);

export default AppRouter;