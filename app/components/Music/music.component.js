import React, {Component} from 'react';
import ProgressBar from './ProgressBar/progress.component';
import {Button} from 'semantic-ui-react';
import Constants from '../constants';
import Sound from 'react-sound';
import axios from 'axios';
import Slider, { Range } from 'rc-slider';

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
        this.playStream = this.playStream.bind(this);
        this.pauseStream = this.pauseStream.bind(this);
        this.nextSong = this.nextSong.bind(this);
        this.adjustVolume = this.adjustVolume.bind(this);
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
                this.playSong(jwt);
            }
        }
    }

    playSong(jwt) {
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
            console.error("An error has occurred ", err)
        });
    }

    pauseStream() {
        this.setState({
            playStatus: Sound.status.PAUSED
        });
    }

    nextSong() {
        this.setState({
            playStatus: Sound.status.STOPPED
        }, () => {
            const jwt = window.sessionStorage.getItem('jwt');
            this.playSong();
        })
    }

    adjustVolume(volume) {
        this.setState({
            volume
        })
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
                <ProgressBar totalTime={100}/>
                <div className="control-bg">
                    <div id="controls">
                        {
                            this.state.playStatus === Sound.status.PLAYING ? (
                                <Button icon='pause' basic color='blue' inverted size='big'
                                        onClick={this.pauseStream}/>) : (
                                <Button icon='play' basic color='blue' inverted size='big'
                                        onClick={this.playStream}/>)
                        }
                        <Button icon='fast forward' basic color='blue' inverted size='big'
                                onClick={this.nextSong}/>
                    </div>
                    <br />
                    <Slider step={0.25} value={this.state.volume} onChange={this.adjustVolume}/>
                </div>
            </div>
        )
    }

}

export default Music;