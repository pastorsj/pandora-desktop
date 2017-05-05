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
            albumArt: "",
            tracks: [],
            elapsed: '00:00',
            total: '00:00'
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

    refreshToken(jwt) {
        return axios({
            method: 'get',
            url: `${Constants.API_URL}/user/refresh`,
            headers: {
                "Authorization": "Bearer " + jwt
            }
        });
    }

    playSong(jwt) {
        this.refreshToken(jwt).then((res) => {
            console.log('Refreshed jwt', res.data);
            if (res.data) {
                window.sessionStorage.setItem('jwt', res.data)
                axios({
                    method: 'get',
                    url: `${Constants.API_URL}/play/song/random`,
                    headers: {
                        "Authorization": "Bearer " + res.data
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
            } else {
                console.error("You must login again")
                this.props.logout()
            }
        }).catch((err) => {
            console.error("You must login again", err)
            this.props.logout()
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
            this.setState({
                albumArt: "./app/public/css/assets/default-arts.png"
            });
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

    formatMilliseconds(milliseconds) {
        var hours = Math.floor(milliseconds / 3600000);
        milliseconds = milliseconds % 3600000;
        var minutes = Math.floor(milliseconds / 60000);
        milliseconds = milliseconds % 60000;
        var seconds = Math.floor(milliseconds / 1000);
        milliseconds = Math.floor(milliseconds % 1000);
        return (minutes < 10 ? '0' : '') + minutes + ':' +
            (seconds < 10 ? '0' : '') + seconds;
    }

    handleSongPlaying(audio){
        this.setState({  elapsed: this.formatMilliseconds(audio.position),
                      total: this.formatMilliseconds(audio.duration),
                      position: audio.position / audio.duration })
   }

    render() {
        return (
            <div id="music">
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
                <Sound 
                    id="player"
                    url={this.state.url}
                    playStatus={this.state.playStatus}
                    playFromPosition={this.state.playPosition}
                    volume={this.state.volume}
                    onPlaying={this.handleSongPlaying.bind(this)}
                    onFinishedPlaying={this.nextSong}/>
                <ProgressBar
                    elapsed={this.state.elapsed}
                    total={this.state.total}
                    position={this.state.position}/>
                <div className="control-bg">
                    <span id="volume" >
                        <Slider step={0.25} value={this.state.volume} onChange={this.adjustVolume}/>
                    </span>
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
                </div>
            </div>
        )
    }

}

export default Music;