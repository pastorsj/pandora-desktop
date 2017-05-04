import React, {Component} from "react";
import {Menu, Container, Image} from "semantic-ui-react";

import Login from "../Login/login.component";
import Register from "../Register/register.component";
import Music from "../Music/music.component";

// import logo from '../../public/css/assets/logo.png'

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
        window.sessionStorage.clear("jwt")
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
                    <Menu.Item header>
                        <Image src="./app/public/css/assets/logo.png" size='small'/>
                    </Menu.Item>
                    {
                        window.sessionStorage.getItem('jwt') !== null ?
                            (<Menu.Menu position='right'>
                                <Menu.Item name='logout' className="menuButton"
                                           onClick={this.logout}>Logout</Menu.Item>
                            </Menu.Menu>) :
                            (<Menu.Menu position='right'>
                                <Menu.Item name='login' className="menuButton"
                                                                    onClick={this.login}>Login</Menu.Item>
                                <Menu.Item name='register' className="menuButton" onClick={this.register}>Register</Menu.Item>
                            </Menu.Menu>)
                    }
                </Menu>
                <Login showLoginModal={this.state.showLoginModal} closeLoginModal={this.closeLoginModal}/>
                <Register showRegisterModal={this.state.showRegisterModal}
                          closeRegisterModal={this.closeRegisterModal}/>
                {
                    window.sessionStorage.getItem('jwt') !== null ? ( <Music logout={ this.logout }/>) : (<div></div>)
                }
               
            </div>
        )
    }
}

export default App;
