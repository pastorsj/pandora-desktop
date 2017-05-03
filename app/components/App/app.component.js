import React, {Component} from "react";
import {Menu, Container} from "semantic-ui-react";

import Login from "../Login/login.component";
import Register from "../Register/register.component";
import Music from "../Music/music.component";


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showLoginModal: false,
            showRegisterModal: false
        };
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        this.closeLoginModal = this.closeLoginModal.bind(this);
        this.closeRegisterModal = this.closeRegisterModal.bind(this);
    }

    login() {
        this.setState({
            showLoginModal: true
        });
    }

    register() {
        this.setState({
            showRegisterModal: true
        });
    }

    closeLoginModal() {
        this.setState({
            showLoginModal: false
        });
    }

    closeRegisterModal() {
        this.setState({
            showRegisterModal: false
        });
    }

    render() {
        return (
            <div>
                <Menu secondary stackable id="music">
                    <Menu.Menu position='right'>
                        <Menu.Item name='login' onClick={this.login}/>
                        <Menu.Item name='register' onClick={this.register}/>
                    </Menu.Menu>
                </Menu>
                <Login showLoginModal={this.state.showLoginModal} closeLoginModal={this.closeLoginModal}/>
                <Register showRegisterModal={this.state.showRegisterModal}
                          closeRegisterModal={this.closeRegisterModal}/>
                <Container>
                    <Music />
                </Container>
            </div>
        )
    }
}

export default App;
