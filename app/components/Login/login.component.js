import React, {Component} from 'react';
import {Modal, Header, Form, Label, Input, Button, Icon} from 'semantic-ui-react';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            validForm: false
        }
        this.getPassword = this.getPassword.bind(this)
        this.getUsername = this.getUsername.bind(this)
        this.setValidClientForm = this.setValidClientForm.bind(this)
        this.login = this.login.bind(this)
    }

    getUsername(event) {
        this.setState({
            username: event.target.value.toString()
        }, () => {
            this.setValidClientForm();
        });
    }

    getPassword(event) {
        this.setState({
            password: event.target.value.toString()
        }, () => {
            this.setValidClientForm();
        });
    }

    setValidClientForm() {
        this.setState({
            validForm: !(this.state.username === '' || this.state.password === '')
        });
    }

    login() {
        console.log("Logging in")
        this.props.closeLoginModal();
    }

    render() {
        return (
            <div>
                <Modal open={this.props.showLoginModal} onClose={this.props.closeLoginModal} closeIcon='close'
                       size='small' dimmer='blurring'>
                    <Header icon='archive' content='Login'/>
                    <Modal.Content>
                        <Form>
                            <Form.Field error={this.state.username === ''}>
                                <Label>Username</Label>
                                <Input placeholder='Username' onChange={this.getUsername} value={this.state.username}
                                       spellCheck='true'/>
                            </Form.Field>
                            <Form.Field error={this.state.password === ''}>
                                <Label>Password</Label>
                                <Input placeholder='Password' onChange={this.getPassword} value={this.state.password}
                                       spellCheck='true'/>
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button.Group>
                            <Button color='red' onClick={this.props.closeLoginModal}>
                                <Icon name='remove'/> Close
                            </Button>
                            <Button.Or />
                            <Button color='green' onClick={this.login} disabled={!this.state.validForm}>
                                <Icon name='save'/> Login
                            </Button>
                        </Button.Group>
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }

}

export default Login;