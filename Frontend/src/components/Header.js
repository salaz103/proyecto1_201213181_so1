import React from 'react';
import {NavLink} from 'react-router-dom';


const Header = (props) => (
  <div className="header">
      <h1 className="header__title">{props.title}</h1>
      {props.subtitle && <h2 className="header__subtitle">{props.subtitle}</h2>}
      <button><NavLink to="/" activeClassName="is-active" exact={true}>Home</NavLink></button>
      <button><NavLink to="/ram" activeClassName="is-active" >Monitor Ram</NavLink></button>
      <button><NavLink to="/cpu" activeClassName="is-active" >Monitor CPU</NavLink></button>
  </div>
  
);

Header.defaultProps = {
  title: 'Matrioshts'
};

export default Header;