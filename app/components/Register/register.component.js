import React, {Component} from 'react';
import {Modal, Header, Form, Label, Input, Button, Icon} from 'semantic-ui-react';
import axios from 'axios';
import Constants from '../constants';

class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            username: "",
            password: "",
            confirmationPassword: "",
            validForm: false
        };
        this.getEmail = this.getEmail.bind(this);
        this.getPassword = this.getPassword.bind(this);
        this.getConfirmationPassword = this.getConfirmationPassword.bind(this);
        this.getUsername = this.getUsername.bind(this);
        this.setValidClientForm = this.setValidClientForm.bind(this);
        this.register = this.register.bind(this);
    }

    getEmail(event) {
        this.setState({
            email: event.target.value.toString()
        }, () => {
            this.setValidClientForm();
        });
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

    getConfirmationPassword(event) {
        this.setState({
            confirmationPassword: event.target.value.toString()
        }, () => {
            this.setValidClientForm();
        });
    }

    setValidClientForm() {
        this.setState({
            validForm: !(this.state.email === '' || this.state.username === '' || this.state.password === '' || this.state.confirmationPassword === '' || this.state.password !== this.state.confirmationPassword)
        });
    }

    register() {
        axios({
            method: 'post',
            url: `${Constants.API_URL}/register`,
            data: {
                username: this.state.username,
                email: this.state.email,
                password: this.state.password
            }
        }).then((res) => {
            console.log('Result ', res.data);
            Constants.cookies.set('jwt', res.data);
            this.props.closeRegisterModal();
        }).catch((err) => {
            console.error('Error ', err);
        });
        this.props.closeRegisterModal();
    }

    render() {
        return (
            <div>
                <Modal open={this.props.showRegisterModal} onClose={this.props.closeRegisterModal} closeIcon='close'
                       size='small' dimmer='blurring'>
                    <Header icon='archive' content='Register'/>
                    <Modal.Content>
                        <Form>
                            <Form.Field error={this.state.email === ''}>
                                <Label>Email</Label>
                                <Input placeholder='Email' onChange={this.getEmail} value={this.state.email}
                                       spellCheck='true'/>
                            </Form.Field>
                            <Form.Field error={this.state.username === ''}>
                                <Label>Username</Label>
                                <Input placeholder='Username' onChange={this.getUsername} value={this.state.username}
                                       spellCheck='true'/>
                            </Form.Field>
                            <Form.Field error={this.state.password === ''}>
                                <Label>Password</Label>
                                <Input placeholder='Password' type="password" onChange={this.getPassword}
                                       value={this.state.password}/>
                            </Form.Field>
                            <Form.Field error={this.state.confirmationPassword === ''}>
                                <Label>ConfirmationPassword</Label>
                                <Input placeholder='Password Confirmation' type="password"
                                       onChange={this.getConfirmationPassword} value={this.state.confirmationPassword}/>
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button.Group>
                            <Button color='red' onClick={this.props.closeRegisterModal}>
                                <Icon name='remove'/> Close
                            </Button>
                            <Button.Or />
                            <Button color='green' onClick={this.register} disabled={!this.state.validForm}>
                                <Icon name='save'/> Register
                            </Button>
                        </Button.Group>
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }

}

export default Register;