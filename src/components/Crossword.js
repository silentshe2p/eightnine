import React, { Component } from 'react';
import { Button, Dimmer, Header, Icon, Tab, Popup, Segment, Divider } from 'semantic-ui-react';
import $ from 'jquery';

import { NormalHint, MusicHint, PictureHint } from './Hints';
import '../css/Crossword.css';
import cwdata from '../cwdata.json';

// Layout of the crossword, non-zero numbers represent input cells
const grid = [
    [0  , 0  , 0  , 0  , 0  , 1  , 0  , 0  , 0  , 0  , 0  , 0  , 0  , 0  , 0],
    [0  , 0  , 0  , 0  , 0  , 1  , 3  , 0  , 0  , 0  , 0  , 8  , 0  , 0  , 0],
    [2  , 2  , 2  , 2  , 2  , 1.2, 2.3, 2  , 2.4, 0  , 0  , 8  , 0  , 0  , 0],
    [0  , 0  , 0  , 0  , 0  , 0  , 3  , 0  , 4  , 0  , 0  , 8  , 0  , 0  , 0],
    [0  , 0  , 0  , 0  , 0  , 0  , 3  , 0  , 4  , 0  , 0  , 8  , 0  , 0  , 0],
    [0  , 0  , 0  , 0  , 0  , 0  , 0  , 0  , 4  , 0  , 0  , 8  , 0  , 0  , 0],
    [0  , 0  , 0  , 0  , 0  , 0  , 5  , 5  , 4.5, 5  , 5  , 5.8, 0  , 0  , 0],
    [0  , 0  , 0  , 0  , 0  , 0  , 0  , 6  , 4.6, 6  , 6  , 6  , 6  , 6  , 6],
    [0  , 0  , 0  , 0  , 0  , 0  , 0  , 0  , 4  , 0  , 0  , 0  , 0  , 0  , 0],
    [0  , 0  , 0  , 0  , 0  , 0  , 7  , 7  , 4.7, 7  , 0  , 0  , 0  , 0  , 0],
    [0  , 0  , 0  , 0  , 0  , 0  , 0  , 0  , 4  , 0  , 0  , 0  , 0  , 0  , 0],
];

// Check correct answers to find the correct letter at current selected cell
const getCorrectLetter = (location, data) => {
    let [row, col] = location.toString().split('.');
    let qid = grid[row][col].toString().split('.')[0] - 1;
    let startPos = data[qid].start;
    let currentPos = (data[qid].dir === "ver") ? (row - startPos) : (col - startPos);
    return data[qid].ans[currentPos];
}

class Crossword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
            status: "playing",
            clueCount: 3,
            checkCount: 1
        };
        this.transitionTimer = this.transitionTimer;
        this.onDone = this.onDone.bind(this);
        this.onCheck = this.onCheck.bind(this);
        this.onClue = this.onClue.bind(this);
    }

    drawCrossword() {
        $.each(grid, function(i) {
            let tr = $('<tr></tr>');

            $.each(this, function(j) {
                let qid = this;
                if (qid === 0)
                    $(tr).append('<td class="square empty"></td>');

                // Cells that belong to only one questions
                // -> display question number at the left corner
                else if (qid % 1 === 0)
                    $(tr).append('<td><span class="qnum">' 
                        + qid 
                        + '</span><div class="square letter" contenteditable="true" data-grid-index="' 
                        + (i + '.' + j) + '"></div></td>');

                // Cells that belong to 2 questions 
                // -> display question number at 2 top corners
                else {
                    let [first, second] = (qid + "").split('.');
                    $(tr).append('<td><span class="qnum">' 
                        + first 
                        + '</span><span class="qnum-alt">' 
                        + second 
                        + '</span><div class="square letter" contenteditable="true" data-grid-index="' 
                        + (i + '.' + j) + '"></div></td>');
                }
            })

            $("#puzzle").append(tr);
        });

        // Allows only one (newer) character in one cell
        $(".letter").on('keyup', function(){
            $(this).removeClass("positive");
            $(this).removeClass("negative");
            let text = $(this).text();
            if(text.length > 1){
              $(this).text(text.slice(0, 1));
            }
        });

        // Set the clicked cell as active
        $(".letter").on('click', function(){
            $(".letter").removeClass("active");
            $(this).addClass("active");
        });
    }

    // Remove text from all the cells
    onClear() {
        $(".letter").each(function() {
            $(this).removeClass("positive");
            $(this).removeClass("negative");
            $(this).text("");
        });
    }

    // Fill in correct character at selected cell
    onClue() {
        this.setState({ clueCount: this.state.clueCount - 1 });
        if(!$(".letter.active").length)
            return;
        let loc = $(".letter.active").data("grid-index");
        $(".letter.active").text(getCorrectLetter(loc, cwdata));
    }

    // Check all the filled cells then coloring the cell differently for correct/wrong answers
    onCheck() {
        this.setState({ checkCount: this.state.checkCount - 1 });
        $(".letter").each(function() {
            let filled = $(this).text();
            if (filled) {
                let loc = $(this).data("grid-index");
                $(this).addClass((filled === getCorrectLetter(loc, cwdata)) 
                                            ? "positive" : "negative");
            }
        });
    }

    // Check all the cells
    // If all are correct -> move to the next stage
    // Any unfilled/wrong cell -> GAMEOVER
    onDone() {
        let completed = true;
        $(".letter").each(function() {
            let filled = $(this).text();
            if (!filled) {
                completed = false;
            }
            else {
                let loc = $(this).data("grid-index");
                if (filled !== getCorrectLetter(loc, cwdata))
                completed = false;
            }
        })
        this.setState({ status: (completed) ? "completed" : "gameover" });
        this.handleShow();
    }

    componentDidMount() {
        this.drawCrossword();
    }

    componentWillUnmount() {
        clearInterval(this.transitionTimer);
    }

    handleShow = () => this.setState({ active: true })

    handleHide = () => this.setState({ active: false })

    // Set interval before moving to the next part to prevent on mouse click events between both
    handleAdvance = () => {
        this.transitionTimer = setInterval(() => {
            this.props.setNextPart(this.props.nextPart)
        }, 100)
    }

    handleRetry = () => {
        this.onClear();
        this.handleHide();
    }

    renderHint(hintObj) {
        switch(hintObj.req) {
            case "none":
                return <NormalHint {...hintObj} />;
            case "mus":
                return <MusicHint {...hintObj} />;
            case "img":
                return <PictureHint {...hintObj} />;
            default:
                return <div/>;
        }
    }

    render() {
        let panes = cwdata.map(d => Object.create({ 
            menuItem: '#' + d.qid, 
            render: () => <Tab.Pane>{ this.renderHint(d) }</Tab.Pane> }));

        return <Dimmer.Dimmable as={ Segment } dimmed={ this.state.active }>
            <div id="puzzle-container">
                <table id="puzzle">
                </table>
            </div>
            
            <div id="buttons-container">
                <Popup 
                    trigger={ <Button secondary id="clue" 
                                    onClick={ this.onClue } 
                                    disabled={ (this.state.clueCount === 0) ? true : false }>Clue</Button> }
                    content={`Reveal the correct character at the selected row (left: ${this.state.clueCount} usage)`} />
                <Popup
                    trigger={ <Button primary id="check" onClick={ this.onCheck } 
                                    disabled={ (this.state.checkCount === 0) ? true : false }>Check</Button> }
                    content={`Verify all filled cell (green-right, red-wrong)  (left: ${this.state.checkCount} usage)`} />
                <Popup
                    trigger={ <Button positive id="done" onClick={ this.onDone }>Done</Button> }
                    content="Good to go (NOTE: any wrong/unfilled cell will lead to GAMEOVER)" />
                <Popup
                    trigger={ <Button negative id="clear-all" onClick={ this.onClear }>Clear All</Button> }
                    content="Clear all cells....(was it that bad)" />
            </div>

            <div id="hints-container">
                <Header as='h2'>
                    <Icon name='compass outline' />
                    <Header.Content>Hints</Header.Content>
                </Header>
                <Tab panes={panes} />
                <Divider hidden />
                <Divider hidden />
            </div>

            <Dimmer active={ this.state.active }>
                <Header as='h2' icon inverted>
                    <Icon name={ (this.state.status === "completed") ? 'fast forward' : 'undo' } />
                    { (this.state.status === "completed") 
                        ? "Congratulations on finishing the hardest crossword known to mankind!!!"
                        : "Your answers are imcompleted/incorrect :( Let's try again?" }
                    <br />
                    <br />
                    <Button inverted color='olive' 
                            onClick={ (this.state.status === "completed") ? this.handleAdvance : this.handleRetry }>
                        { (this.state.status === "completed") ? 'Next' : 'Retry' }
                    </Button>
                </Header>
            </Dimmer>
        </Dimmer.Dimmable>
    }

}

export default Crossword;
