import React, {
    Component
} from 'react';

import PropTypes from 'prop-types';

//React Router
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';

//Custom Components
import LoginPage from './login/LoginPage';
import AdminPage from './admin/AdminPage';

//React-Redux
import { connect } from 'react-redux';
import * as loginActions from '../actions/loginActions';

const LoginRoute = ({ isAllowed, ...props }) => isAllowed ? <props.component /> : <Redirect to="/users"/>;
const AuthProtectedRoute = ({ isAllowed, ...props }) => isAllowed ? <props.component /> : <Redirect to="/login"/>;

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoggedInChecked: localStorage.getItem("token") === null,
        };
    }

    componentWillMount() {
        if (!this.state.isLoggedInChecked) {
            this.props.checkIsLoggedIn().then((res) => {
                if (res.status === 200) {
                  this.props.saveIsLoggedIn(true);
                  this.setState({
                      isLoggedInChecked: true,
                  });
                }
            }).catch((err) => {
                if (err.response.status === 403) {
                    this.props.saveIsLoggedIn(false);
                    this.setState({
                        isLoggedInChecked: true,
                    });
                }
            
                throw new Error(err);
            });
        }
    }

    render() {
        if (this.state.isLoggedInChecked) {
            return (
                <Switch>
                    <LoginRoute isAllowed={!this.props.isLoggedIn} path='/login' exact component={LoginPage} />
                    <AuthProtectedRoute isAllowed={this.props.isLoggedIn} path='/users' exact component={AdminPage} />
                    <AuthProtectedRoute isAllowed={this.props.isLoggedIn} path='/orders' exact component={AdminPage} />
                    <AuthProtectedRoute isAllowed={this.props.isLoggedIn} path='/ecurrencies' exact component={AdminPage} />
                    <AuthProtectedRoute isAllowed={this.props.isLoggedIn} path='/paymentmethods' exact component={AdminPage} />
                    <AuthProtectedRoute isAllowed={this.props.isLoggedIn} path='/news' exact component={AdminPage} />
                    <AuthProtectedRoute isAllowed={this.props.isLoggedIn} path='/reviews' exact component={AdminPage} />
                    <AuthProtectedRoute isAllowed={this.props.isLoggedIn} path='/config' exact component={AdminPage} />
                    <Redirect to={`${this.props.isLoggedIn ? '/users' : '/login'}`} />
                </Switch>  
            );
        }

        return null;
    };
}

App.propTypes = {
    isLoggedIn : PropTypes.bool.isRequired,
};
  
const mapStateToProps = (state, ownProps) => ({
    isLoggedIn: state.loginReducer.isLoggedIn,
});

const mapDispatchToProps = (dispatch) => ({
    checkIsLoggedIn: () => dispatch(loginActions.checkIsLoggedIn()),
    saveIsLoggedIn: isLoggedIn => dispatch(loginActions.saveIsLoggedIn(isLoggedIn)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));