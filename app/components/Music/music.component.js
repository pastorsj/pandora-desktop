import React, {Component} from 'react';
import ProgressBar from './ProgressBar/progress.component';
import {Button} from 'semantic-ui-react';

class Music extends Component {

    constructor(props) {
        super(props);
        this.state = { 
        }
    }

    render() {
        return (
            <div id="music">
                 <Button.Group labeled id="player">
                    <Button icon='stop' basic color='blue' inverted size='big' content='Stop' />
                    <Button icon='play' basic color='blue' inverted size='big' content='Play' />
                    <Button icon='pause' basic color='blue'inverted size='big' content='Pause' />
                    <Button icon='fast forward' basic color='blue' inverted size='big' content='Next' />
                </Button.Group>
                <ProgressBar totalTime={100} time={10}/>
            </div>
        )
    }

}

export default Music;