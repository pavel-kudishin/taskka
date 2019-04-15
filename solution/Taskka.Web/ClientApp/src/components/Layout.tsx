import * as React from 'react';
import { Container } from 'reactstrap';
import NavMenu from './NavMenu';
import { RouterState } from 'react-router-redux';
import { IApplicationState } from '../store';
import { connect } from 'react-redux';

type LayoutProps =
	RouterState;

class Layout extends React.Component<LayoutProps> {
	constructor(props: LayoutProps) {
		super(props);
	}

	public render() {
		return (
			<div>
				<NavMenu location={this.props.location}/>
				<Container style={{maxWidth: '100%'}}>
					{this.props.children}
				</Container>
			</div>
		);
	}
}

// Wire up the React component to the Redux store
let mapStateToProps = (state: IApplicationState, ownProps: any): LayoutProps => {
	const result: LayoutProps = Object.assign({}, state.routing) as LayoutProps;
	return result;
};

const mapDispatchToProps = Object.assign({},
);

const layoutConnected = connect(
	mapStateToProps, // Selects which state properties are merged into the component's props
	mapDispatchToProps // Selects which action creators are merged into the component's props
)(Layout);

export default layoutConnected;
