import * as React from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { RouterState } from 'react-router-redux';

import './NavMenu.css';

interface INavMenuProps {
}

interface INavMenuState {
    isOpen: boolean;
}

type NavMenuProps = INavMenuProps
    & RouterState;

export default class NavMenu extends React.Component<NavMenuProps, INavMenuState> {
    constructor(props: NavMenuProps) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle () {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render () {
    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm border-bottom box-shadow mb-3" light >
          <Container>
            <NavbarBrand tag={Link} to="/">Джина</NavbarBrand>
            <NavbarToggler onClick={this.toggle} className="mr-2" />
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={this.state.isOpen} navbar>
              <ul className="navbar-nav flex-grow">
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/">Проекты</NavLink>
                </NavItem>
				<NavItem>
					<NavLink tag={Link} className="text-dark" to="/counter">Пользователи</NavLink>
				</NavItem>
				<NavItem>
					<NavLink tag={Link} className="text-dark" to="/board">Доска</NavLink>
				</NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/fetch-data">Задачи</NavLink>
                </NavItem>
              </ul>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}
