import React, {
  Component
} from 'react';

//Helpers
import PropTypes from 'prop-types';
import update from 'immutability-helper';

//React Router
import { Switch, Route } from 'react-router-dom';

//Third Party Components
import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

//React-Redux
import { connect } from 'react-redux';
import * as loginActions from '../../actions/loginActions';

class LoginPage extends Component {
  constructor(props) {
      super(props);
      this.state = {
        credentials: {
          email: '',
          password: '',
        },
        responseMsg: '',
      };
  }

  _handleInputChange = (event) => {
    let target = event.target;
    this.setState(prevState => ({
        credentials: update(prevState.credentials, {$merge: {[target.name]: target.value}}),
    }));
  }

  login = () => {
    this.props.login(this.state.credentials).then((res) => {
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        window.location = '/users';
      }
    }).catch((err) => {
      if (err.response.status === 403) {
        this.setState({
          responseMsg: 'Invalid credentials.'
        })
      }

      throw new Error(err);
    });
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className="app-container df jc-c ai-c">
          <div className="login-container paper-container">
              <Paper className="login-paper paper" zDepth={2}>
                  <div className="header">
                      Login Here
                  </div>

                  <div className="login-form form">

                      <div className="username input-field">
                          <TextField
                              type="text"
                              fullWidth
                              name="email"
                              floatingLabelText="Email"
                              value={this.state.credentials.email}
                              onChange={this._handleInputChange}
                          />
                      </div>
                      <div className="password input-field">
                          <TextField
                              type="password"
                              fullWidth
                              name="password"
                              floatingLabelText="Password"
                              value={this.state.credentials.password}
                              onChange={this._handleInputChange}
                          />
                      </div>
                  </div>
                  <div className="actions">
                      <FlatButton type="button" label="Login" primary={true} onClick={this.login} />
                  </div>
              </Paper>
          </div>
          <Snackbar
            autoHideDuration={4000}
            open={this.state.responseMsg !== ''}
            message={this.state.responseMsg}
            onRequestClose={() => this.setState({responseMsg: ''})}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

LoginPage.propTypes = {
  login                    : PropTypes.func.isRequired,
  saveIsLoggedIn           : PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({});

const mapDispatchToProps = (dispatch) => {
  return {
    login: credentials => dispatch(loginActions.login(credentials)),
    saveIsLoggedIn: isLoggedIn => dispatch(loginActions.saveIsLoggedIn(isLoggedIn)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);