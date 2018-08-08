import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Container, Form, Header, Message } from 'semantic-ui-react';
import store from 'store';

import recipient from '../recipient.json';

const IntroMsg = () => {
    return <Message info>
        <Message.Header>Are you the person this app was created for?</Message.Header>
        <p>Try to input your name below!</p>
    </Message>;
}

const ErrorMsg = () => {
    return <Message negative>
        <Message.Header>Unrecognizable name :(</Message.Header>
        <p>Did you input your name correctly?</p>
    </Message>;
}

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            redirectToRef: store.get('loggedIn'),
            incorrect: false
        };
        this.onChange = this.onChange.bind(this);
        this.login = this.login.bind(this);
    }

    onChange(e) {
        this.setState({ [e.currentTarget.name]: e.currentTarget.value });
    }

    login() {
        if (this.state.firstName.toLowerCase() === recipient.firstName && 
            this.state.lastName.toLowerCase() === recipient.lastName) {
            this.props.handleSetLogin();
            this.setState({ redirectToRef: true });
        }
        else {
            this.setState({
                firstName: "",
                lastName: "",
                incorrect: true
            })
        }
    }

    render() {
        const { from } = this.props.location.state || { from: { pathname: '/' } };
        const { redirectToRef } = this.state;

        if (redirectToRef) {
            return <Redirect to={ from } />;
        }

        return <Container fluid>
            <Header as='h2'>Login</Header>
            { (this.state.incorrect) ? <ErrorMsg /> : <IntroMsg /> }
            <Form>
                <Form.Input label="First name" name="firstName"
                    value={ this.state.firstName } onChange={ this.onChange } />
                <Form.Input label="Last name" name="lastName"
                    value={ this.state.lastName } onChange={ this.onChange } />
                <Button onClick={ this.login }>I am!!!</Button>
            </Form>
        </Container>
    }
}

export default Login;
