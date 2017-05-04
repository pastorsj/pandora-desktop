import React, {Component} from 'react';
import ProgressBar from './ProgressBar/progress.component';
import {Button, Image, Card} from 'semantic-ui-react';
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
            albumArt: ""
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
                this.retrieveAlbumArt()
            });

        }).catch((err) => {
            console.error("An error has occurred ", err)
        });
    }

    retrieveAlbumArt() {
        axios({
            method: 'get',
            url: `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=e0abe5f80ed6b66ebc2e278d8cc2249a&artist=${this.state.songInfo.artist}&album=${this.state.songInfo.album}&format=json`
        }).then((res) => {
            if (res.data.album.image.length > 2) {
                this.setState({
                    albumArt: res.data.album.image[3]['#text']
                });
            }
        }).catch((err) => {
            console.error('Error ', err);
        })
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
            this.playSong(jwt);
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
                <div className="song-info">
                    {
                        this.state.playStatus === Sound.status.PLAYING || this.state.playStatus === Sound.status.PAUSED ? (
                            <div>
                                <Image src={this.state.albumArt} size='large' centered />
                                <Card centered>
                                    <Card.Content header={this.state.songInfo.title} />
                                    <Card.Content>
                                        {this.state.songInfo.artist}
                                    </Card.Content>
                                    <Card.Content extra>
                                        {this.state.songInfo.album}, {this.state.songInfo.year}
                                    </Card.Content>
                                </Card>
                            </div>
                        ) : (<div></div>)
                    }
                </div>
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