
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import React from "react";
import './LogonScreen.css'




class LogonScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }


    updateUsername = event => {
        this.setState({ username: event.target.value });

    };

    updatePassword = event => {
        this.setState({ password: event.target.value });
    };

    /*    verifyLogon() {
            this.props.verifyLogon(this.state.username, this.state.password);
        };*/

    verifyLogon = event => {
        this.props.verifyLogon(this.state.username, this.state.password);
    };




    render() {
        return (
            <div className='logon-container'>
                <div>
                    <TextField
                        id="name"
                        label="Login Name"
                        className='text-field-entry-name'
                        margin="normal"
                        onChange={this.updateUsername}
                    />
                </div>
                <div>
                    <TextField
                        id="password"
                        label="Password"
                        className='text-field-entry-name'
                        margin="normal"
                        type="password"
                        onChange={this.updatePassword}
                    />
                </div>
                <div >
                    <Button style={{ justifyContent: 'center' }} variant="contained"
                            onClick={this.verifyLogon}>
                        Logon
                    </Button>
                </div>
            </div>

        );
    }
}




export default LogonScreen;
