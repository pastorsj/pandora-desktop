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
        this.logout = this.logout.bind(this);
        this.closeLoginModal = this.closeLoginModal.bind(this);
        this.closeRegisterModal = this.closeRegisterModal.bind(this);
    }

    login() {
        this.setState({
            showLoginModal: true
        });
    }

    logout() {
        window.sessionStorage.setItem("jwt", null)
        this.forceUpdate()
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
                <Menu secondary id="menu">
                    <Menu.Menu>
                        <img src="/Users/TheSiscoKid/pandora-desktop/app/public/css/assets/logo.png" id="logo"></img>
                    </Menu.Menu>
                    {
                        window.sessionStorage.getItem('jwt') !== "null" ?
                            (<Menu.Menu position='right'><button name='logout' className="menuButton" onClick={this.logout}>Logout</button></Menu.Menu>) :
                            (<Menu.Menu position='right'><button name='login' className="menuButton" onClick={this.login}>Login</button><button name='register' className="menuButton" onClick={this.register}>Register</button></Menu.Menu>)
                    }
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
