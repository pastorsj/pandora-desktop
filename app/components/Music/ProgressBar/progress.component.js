import React, {Component} from 'react';
import {Progress} from 'semantic-ui-react';

class ProgressBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            position: this.props.position
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log("Next props", nextProps);
        this.setState({
            position: nextProps.position
        });
    }


    render() {
        return (
            <Progress percent={this.state.position * 100} indicating inverted color='grey' size='tiny'>{this.props.elapsed} / {this.props.total}</Progress>
        )
    }
}

export default ProgressBar;


            /*/*<div className="progress">
                <span className="player__time-elapsed">{this.props.elapsed}</span>
                <progress
                value={this.props.position}
                max="1"></progress>
                <span className="player__time-total">{this.props.total}</span>
            </div>*/