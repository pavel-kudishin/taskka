import * as React from 'react';
import { Container } from 'reactstrap';
import NavMenu from './NavMenu';

export default (props: { children: any; }) => (
  <div>
    <NavMenu />
    <Container>
      {props.children}
    </Container>
  </div>
);
