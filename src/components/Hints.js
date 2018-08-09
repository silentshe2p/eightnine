import React from 'react';
import { Card, Header, Modal, Image } from 'semantic-ui-react';
import ReactAudioPlayer from 'react-audio-player';

// Hardcoded images since it isn't possible to using variable path inside require
import P1 from '../images/nk/n1.jpg';
import P2 from '../images/nk/n2.jpg';
import P3 from '../images/nk/n3.jpg';
import P4 from '../images/nk/n4.jpg';
import P5 from '../images/nk/n5.jpg';
import P6 from '../images/nk/n6.jpg';

// Hints for questions with text only
export const NormalHint = ({ hint }) => {
    return <Header as='h3' dividing>
        { hint }
    </Header>
}

// Temporary solution since it isn't possible to using variable path inside require
const switchPath = (path) => {
    switch(path) {
        case "../sounds/at.mp3":
            return <ReactAudioPlayer 
                src={ require('../sounds/at.mp3') } autoPlay controls />;
        case "../sounds/am.mp3":
            return <ReactAudioPlayer 
                src={ require('../sounds/am.mp3') } autoPlay controls />;
        case "../sounds/fl.mp3":
            return <ReactAudioPlayer 
                src={ require('../sounds/fl.mp3') } autoPlay controls />;
        default:
            return <div/>;
    }
}

// Hint for questions that needs audio files
export const MusicHint = ({ hint, path }) => {
    return <div>
        <Header as='h3' dividing>
            { hint }
        </Header>
        { switchPath(path) }
    </div>;
}

const imageModal = (src) => {
    return <Modal trigger={ <Card raised image={ src } /> } closeIcon>
        <Image centered={true} size='big' src={ src } />
    </Modal>;
}

// Hint for questions that needs to display images
export const PictureHint = ({ hint }) => {
    return <div>
        <Header as='h3' dividing>
            { hint }
        </Header>
        <Card.Group itemsPerRow={3}>
            { imageModal(P1) }
            { imageModal(P2) }
            { imageModal(P3) }
            { imageModal(P4) }
            { imageModal(P5) }
            { imageModal(P6) }
        </Card.Group>
    </div>;
}
