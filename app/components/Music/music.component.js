import React, {Component} from 'react';
import ProgressBar from './ProgressBar/progress.component';
import {Button} from 'semantic-ui-react';
import Constants from '../constants';
import Sound from 'react-sound';
import axios from 'axios';

class Music extends Component {

    constructor(props) {
        super(props);
        this.state = {
            url: "",
            playStatus: Sound.status.STOPPED,
            playPosition: 0,
            volume: 50,
            songInfo: {},
            songId: 0,
        }
        this.stopStream = this.stopStream.bind(this);
        this.playStream = this.playStream.bind(this);
        this.pauseStream = this.pauseStream.bind(this);
        this.nextSong = this.nextSong.bind(this);
    }

    stopStream() {
        this.setState({
            playStatus: Sound.status.STOPPED
        });
    }

    playStream() {
        if (this.state.playStatus === Sound.status.PAUSED) {
            this.setState({
                playStatus: Sound.status.PLAYING
            });
        }
        if (this.state.playStatus === Sound.status.STOPPED) {
            const jwt = window.sessionStorage.getItem('jwt');
            console.log('JWT ' + jwt);
            if (!jwt) {
                console.error("You must login first");
                return;
            } else {
                axios({
                    method: 'get',
                    url: `${Constants.API_URL}` + "/play/song/random",
                    headers: {
                        "Authorization": "Bearer " + jwt
                    }
                }).then((res) => {
                    console.log("Data ", res);
                    this.setState({
                        songInfo: res.data,
                        songId: res.data.id
                    }, () => {
                        this.setState({
                            url: `${Constants.API_URL}/song/play/${this.state.songId}`,
                            playStatus: Sound.status.PLAYING
                        });
                    });

                }).catch((err) => {
                    console.error("An error has occured ", err)
                });
            }
        }
    }

    pauseStream() {
        this.setState({
            playStatus: Sound.status.PAUSED
        });
    }

    nextSong() {

    }

    render() {
        return (
            <div id="music">
                <Sound
                    url={this.state.url}
                    playStatus={this.state.playStatus}
                    playFromPosition={this.state.playPosition}
                    volume={this.state.volume}
                    onFinishedPlaying={this.nextSong}/>
                <Button.Group labeled id="player">
                    <Button icon='stop' basic color='blue' inverted size='big' content='Stop'
                            onClick={this.stopStream}/>
                    <Button icon='play' basic color='blue' inverted size='big' content='Play'
                            onClick={this.playStream}/>
                    <Button icon='pause' basic color='blue' inverted size='big' content='Pause'
                            onClick={this.pauseStream}/>
                    <Button icon='fast forward' basic color='blue' inverted size='big' content='Next'
                            onClick={this.nextSong}/>
                </Button.Group>
                <ProgressBar totalTime={100} time={10}/>
            </div>
        )
    }

}

export default Music;