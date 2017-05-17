import React, {Component} from 'react';
import ProgressBar from './ProgressBar/progress.component';
import {Button, Image, Card, Dropdown} from 'semantic-ui-react';
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
            total: '00:00',
            station: 'song/random',
            stations: []
        }
        this.playStream = this.playStream.bind(this);
        this.toggleLike = this.toggleLike.bind(this);
        this.pauseStream = this.pauseStream.bind(this);
        this.nextSong = this.nextSong.bind(this);
        this.adjustVolume = this.adjustVolume.bind(this);
        this.getStations = this.getStations.bind(this);
        this.changeStation = this.changeStation.bind(this);
    }

    componentDidMount() {
        this.getStations()
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            stationURL: nextProps.stationURL
        });
    }

    getStations() {
        const jwt = window.sessionStorage.getItem('jwt');
        axios({
            method: 'get',
            url: `${Constants.API_URL}/genres`,
            headers: {
                "Authorization": "Bearer " + jwt
            }
        }).then((res) => {
            var temp = [
                {
                    key: 'random',
                    text: 'Random',
                    value: "song/random"
                },
                {
                    key: 'likes',
                    text: "Likes",
                    value: 'likes'
                }
            ]
            for (var genre in res.data) {
                temp.push(
                    {
                        key: res.data[genre],
                        text: res.data[genre],
                        value: "genre/" + res.data[genre]
                    }
                );
            }
            this.setState({
                stations: temp
            }, () => {
                console.log('stations', this.state.stations);
            });
        })
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
                    url: `${Constants.API_URL}/play/${this.state.station}`,
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
            if (res.data.album && res.data.album.image.length > 2 && res.data.album.image[3]['#text'] != "") {
                this.setState({
                    albumArt: res.data.album.image[3]['#text']
                });
            } else {
                this.setState({
                    albumArt: "./app/public/css/assets/default-art.png"
                });                
            }
        }).catch((err) => {
            console.error('Error ', err);
            this.setState({
                albumArt: "./app/public/css/assets/default-art.png"
            });
        })
    }

    pauseStream() {
        this.setState({
            playStatus: Sound.status.PAUSED
        });
    }

    toggleLike() {
        if (this.state.songId != null) {
            const jwt = window.sessionStorage.getItem('jwt');
            if (this.state.songInfo.liked) {
                //unlike the song
                axios({
                method: 'get',
                url: `${Constants.API_URL}/dislike/song/${this.state.songId}`,
                headers: {"Authorization": "Bearer " + jwt}
                }).then((res) => {
                //Song has been liked
                this.state.songInfo.liked = false
                }).catch((err) => {
                    console.error('Error ', err);
                })
            } else {
                //like the song
                axios({
                method: 'get',
                url: `${Constants.API_URL}/like/song/${this.state.songId}`,
                headers: {"Authorization": "Bearer " + jwt}
                }).then((res) => {
                //Song has been liked
                this.state.songInfo.liked = true
                }).catch((err) => {
                    console.error('Error ', err);
                })
            }
        }
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
        var duration;
        if (audio.duration == 0 || audio.duration == null) {
            duration = this.state.songInfo.duration * 1000
        } else {
            duration = audio.duration
        }
        this.setState({  elapsed: this.formatMilliseconds(audio.position),
                      total: this.formatMilliseconds(duration),
                      position: audio.position / duration })
   }

   changeStation(event, station) {
       console.log('Station', station)
       if (station.value) {
           this.setState({
               station: station.value,
               playStatus: Sound.status.STOPPED
           }, () => {
            this.playStream()
           })
       }
   }

    render() {
        return (
            <div>
                <Dropdown options={this.state.stations} floating button className='icon' placeholder='Stations' onChange={this.changeStation}></Dropdown>
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
                                (this.state.songInfo && this.state.songInfo.liked) ? (
                                    <Button icon='thumbs outline down' basic color='blue' inverted size='big' disabled={this.state.songInfo.liked == null} onClick={this.toggleLike}/>
                                ) : (
                                    <Button icon='thumbs outline up' basic color='blue' inverted size='big' disabled={this.state.songInfo.liked == null} onClick={this.toggleLike}/>
                                )
                            }
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
                        <span id="stations" >

                        </span>
                        <br />
                    </div>
                </div>
            </div>
        )
    }

}

export default Music;