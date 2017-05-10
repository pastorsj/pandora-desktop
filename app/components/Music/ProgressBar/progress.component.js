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