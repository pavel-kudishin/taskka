import * as React from 'react';
import {
	Collapse, Container, Navbar, NavbarBrand,
	NavbarToggler, NavItem, NavLink
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { RouterState } from 'react-router-redux';
import './NavMenu.css';
import { IApplicationState } from '../store';
import { connect } from 'react-redux';

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
			<Navbar className="navbar-expand-sm navbar-toggleable-sm border-bottom box-shadow mb-3" light>
				<Container>
					<NavbarBrand tag={Link} to="/">Джина</NavbarBrand>
					<NavbarToggler onClick={this.toggle} className="mr-2"/>
					<Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={this.state.isOpen} navbar>
						<ul className="navbar-nav flex-grow">
							<NavItem>
								<NavLink tag={Link} className="text-dark" to="/create-task">Создать задачу</NavLink>
							</NavItem>
							<NavItem>
								<NavLink tag={Link} className="text-dark" to="/board">Доска</NavLink>
							</NavItem>
							<NavItem>
								<NavLink tag={Link} className="text-dark" to="/">Проекты</NavLink>
							</NavItem>
							<NavItem>
								<NavLink tag={Link} className="text-dark" to="/counter">Пользователи</NavLink>
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

// Wire up the React component to the Redux store
let mapStateToProps = (state: IApplicationState, ownProps: any): NavMenuProps => {
	const result: NavMenuProps = Object.assign({}, state.routing) as NavMenuProps;
	return result;
};

const navMenuConnected = connect(
	mapStateToProps, // Selects which state properties are merged into the component's props
)(NavMenu);

export { navMenuConnected as NavMenu };

