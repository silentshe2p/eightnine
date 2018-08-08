import React from 'react';
import { Container, Divider, Embed, Header } from 'semantic-ui-react';

export const Card = (props) => {
    return <Container fluid>
        <Divider hidden />
        <Header as='h2'>Good job reaching here!</Header>
        <Divider hidden />
        <Header as='h3'>Hope you like the video below!</Header>
        <Divider hidden />
        <Divider hidden />
        <Embed url={ props.url } />
    </Container>
}
