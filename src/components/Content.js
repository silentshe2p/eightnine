import React, { Component } from 'react';
import { Menu, Icon } from 'semantic-ui-react';

import { Card } from './Card';
import Crossword from './Crossword';
import DisplayText from './DisplayText';

import intro from '../intro.json';
import outro from '../outro.json';
import avatar from '../images/act-avatar.png';

const cardUrl = "https://drive.google.com/file/d/1EOKqj_uIlbfwrXiYHLTRCbJiG-ieb1R1/preview";

class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showing: "intro"
        };
        this.setNextPart = this.setNextPart.bind(this);
    }

    setNextPart(part) {
        this.setState({ showing: part })
    }

    render() {
        console.log(this.state.showing);
        return <div>
            <Menu stackable>
                <Menu.Item>
                    <img src={ avatar } alt="unagi"/>                    
                </Menu.Item>
                <Menu.Item>
                    <Icon name='caret right' />
                    { this.state.showing.toUpperCase() }
                    <Icon name='caret left' />
                </Menu.Item>
                <Menu.Item name="logout" onClick={ this.props.handleLogout }>
                    Logout
                </Menu.Item>
            </Menu>
            { (this.state.showing === "intro") && 
                <DisplayText nextPart="crossword" 
                    setNextPart={ this.setNextPart } 
                    toPlay={intro} /> }
            { (this.state.showing === "crossword") 
                && <Crossword nextPart="outro" 
                    setNextPart={ this.setNextPart } /> }
            { (this.state.showing === "outro") 
                && <DisplayText nextPart="card" 
                    setNextPart={ this.setNextPart } 
                    toPlay={outro} /> }
            { (this.state.showing === "card") && <Card url={ cardUrl } /> }
        </div>;
    }
}

export default Content;
