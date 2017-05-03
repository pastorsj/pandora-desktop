import React, {Component} from 'react';
import {Progress} from 'semantic-ui-react';

class ProgressBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            percent: (this.props.time / this.props.totalTime) * 100,
            time: this.props.time
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            percent: nextProps.time / nextProps.totalTime,
            time: nextProps.time
        })
    }

    render() {
        return (
            <Progress percent={this.state.percent} indicating inverted color='grey' size='small'>{this.state.time}</Progress>
        )
    }
}

export default ProgressBar;