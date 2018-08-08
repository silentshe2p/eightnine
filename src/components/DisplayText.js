import React, { Component } from 'react';
import { Container, Comment, Divider, Icon, Message, Transition, Segment } from 'semantic-ui-react';

import mainAvatar from '../images/myr-avatar.png';
import bossAvatar from '../images/bos-avatar.png';

class DisplayText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
            sectionIdx: 0,
            contentIdx: 0
        }
        this.transitionTimer = null;
        this.text = props.toPlay;
        this.lastIdx = this.text.length - 1;
        this.transition = this.transition.bind(this);
        this.renderText = this.renderText.bind(this);
    }

    componentDidMount() {
        window.addEventListener('click', this.transition);
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.transition);
        clearInterval(this.transitionTimer);
    }

    transition() {
        // At the last section -> transite to the next part
        if (this.state.sectionIdx >= this.lastIdx && 
            this.state.contentIdx >= this.text[this.state.sectionIdx].content.length - 1) {
            this.toggleVisibility();
            // Set next part after transition of this part is done
            this.transitionTimer = setInterval(() => {
                this.props.setNextPart(this.props.nextPart);
            }, 300);
        }

        // At the end of current content -> move on to the next section
        else if (this.state.sectionIdx <= this.lastIdx && 
                this.state.contentIdx >= this.text[this.state.sectionIdx].content.length - 1) {
            this.setState({ 
                sectionIdx: this.state.sectionIdx + 1,
                contentIdx: 0
            });
        }

        // Continue along the current content
        else if (this.state.sectionIdx <= this.lastIdx && 
                this.state.contentIdx < this.text[this.state.sectionIdx].content.length - 1) {
            this.setState({
                contentIdx: this.state.contentIdx + 1
            });
        }
    }

    renderText(textObj) {
        switch(textObj.type) {
            case "nar": // Narration
                return <Container fluid>
                    <Divider hidden />
                    <Divider hidden />
                    <Message icon floating size='massive' color='green'>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            { textObj.content[this.state.contentIdx] }
                        </Message.Content>
                    </Message>
                </Container>;

            case "cvs": // Conversation
                let scene = textObj.content[this.state.contentIdx];
                let whom = Object.keys(scene)[0];
                let said = scene[whom];
                return <Comment.Group size='massive'>
                    <Divider hidden />
                    <Comment>
                        <Comment.Avatar as='a' src={ bossAvatar } />
                        <Comment.Content>
                            <Comment.Author>ボス</Comment.Author>
                            <Comment.Text>
                                <Segment color='red'>
                                    { whom === "ボス" ? said : "..." }
                                </Segment>
                            </Comment.Text>
                        </Comment.Content>
                    </Comment>
                    <Divider hidden />
                    <Divider hidden />
                    <Comment>
                        <Comment.Avatar as='a' src={ mainAvatar } />
                        <Comment.Content>
                            <Comment.Author>あなた</Comment.Author>
                            <Comment.Text>
                                <Segment color='teal'>
                                    { whom === "あなた" ? said : "..." }
                                </Segment>
                            </Comment.Text>
                        </Comment.Content>
                    </Comment>
                </Comment.Group>

            default:
                return <div/>;
        }
    }

    toggleVisibility = () => this.setState({ visible: !this.state.visible });

    render() {
        return <Transition visible={ this.state.visible } animation='slide right' duration={300}>
            { this.renderText(this.text[this.state.sectionIdx]) }
        </Transition>
    }
}

export default DisplayText;
