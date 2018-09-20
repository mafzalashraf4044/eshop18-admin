import React, {
  Component
} from 'react';

//Helpers
import _ from 'lodash';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

//React-Redux
import { connect } from 'react-redux';
import * as loginActions from '../../actions/loginActions';
import * as configActions from '../../actions/configActions';

//Third Party Components
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import { Grid, Row, Col } from 'react-bootstrap';
import RaisedButton from 'material-ui/RaisedButton';

class ConfigPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      config: {
        buyOrderConfirmedText: '',
        sellOrderConfirmedText: '',
        exchangeOrderConfirmedText: '',
        emailAddress: '',
        emailPwd: '',
      },
      newPassword: '',
    };
  }

  componentDidMount = () => {
    this.props.getConfig().then((res) => {
      if (res.status === 200) {
        if (Object.keys(res.data.config).length > 0) {
          this.setState({
            config: res.data.config,
          });
        }
      }
    }).catch((err) => {
      throw new Error(err);
    });
  }

  _handleInputChange = (event) => {
    let target = event.target;
    this.setState(prevState => ({
      config: update(prevState.config, {$merge: {[target.name]: target.value}}),
    }));
  }

  _handlePwdChange = (event) => {
    let target = event.target;
    this.setState(prevState => ({
      newPassword: target.value,
    }));
  }

  _createOrUpdateConfig = () => {
    this.props.createOrUpdateConfig(this.state.config).then((res) => {
      if (res.status === 200) {
        // this.setState({
        //   config: res.data.config
        // });
      }
    }).catch((err) => {
      throw new Error(err);
    });
  }

  _changePwd = () => {
    this.props.checkIsLoggedIn().then((res) => {
      if (res.status === 200) {
        this.props.changePassword(res.data.user.id, this.state.newPassword).then((_res) => {
          if (_res.status === 200) {
            // this.setState({
            //   config: _res.data.config
            // });
          }
        })
      }
    }).catch((err) => {
      throw new Error(err);
    });
  }

  render() {
    const inputStyles = {
      inputStyle:{fontSize: "12px"},
      floatingLabelStyle:{fontSize: "12px"}
    };

    return (
      <div className="config-page">
        <Grid fluid={true}>
          <Row>
            <Col xs={12}>
              <Paper zDepth={1} style={{
                marginTop: "15px",
                padding: "20px"
              }}>
                <TextField
                  name="buyOrderConfirmedText"
                  required
                  fullWidth
                  multiLine
                  {...inputStyles}
                  value={this.state.config.buyOrderConfirmedText}
                  floatingLabelText="Buy Order Confirmed Text"
                  onChange={this._handleInputChange}
                />
                <TextField
                  name="sellOrderConfirmedText"
                  required
                  fullWidth
                  multiLine
                  {...inputStyles}
                  value={this.state.config.sellOrderConfirmedText}
                  floatingLabelText="Sell Order Confirmed Text"
                  onChange={this._handleInputChange}
                />
                <TextField
                  name="exchangeOrderConfirmedText"
                  required
                  fullWidth
                  multiLine
                  {...inputStyles}
                  value={this.state.config.exchangeOrderConfirmedText}
                  floatingLabelText="Exchange Order Confirmed Text"
                  onChange={this._handleInputChange}
                />
                <TextField
                  name="emailAddress"
                  required
                  fullWidth
                  {...inputStyles}
                  value={this.state.config.emailAddress}
                  floatingLabelText="Email Address"
                  onChange={this._handleInputChange}
                />   
                <TextField
                  name="emailPwd"
                  required
                  fullWidth
                  {...inputStyles}
                  value={this.state.config.emailPwd}
                  floatingLabelText="Email Password"
                  onChange={this._handleInputChange}
                /> 

                <div className="df jc-fe ai-c">
                  <RaisedButton 
                    label="Save"
                    onTouchTap={() => this._createOrUpdateConfig()} 
                  />
                </div>
              </Paper>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <Paper zDepth={1} style={{
                marginTop: "15px",
                padding: "20px"
              }}>
                <TextField
                  name="newPassword"
                  required
                  fullWidth
                  {...inputStyles}
                  value={this.state.newPassword}
                  floatingLabelText="New Password"
                  onChange={this._handlePwdChange}
                /> 
                <div className="df jc-fe ai-c">
                  <RaisedButton 
                    label="Change Password"
                    onTouchTap={() => this._changePwd()} 
                  />
                </div>
              </Paper>
            </Col>
          </Row>
        </Grid>        
      </div>
    );
  }
}

ConfigPage.propTypes = {
  getConfig            : PropTypes.func.isRequired,
  createOrUpdateConfig : PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({});

const mapDispatchToProps = (dispatch) => {
  return {
    getConfig: () => dispatch(configActions.getConfig()),
    checkIsLoggedIn: () => dispatch(loginActions.checkIsLoggedIn()),
    createOrUpdateConfig: config => dispatch(configActions.createOrUpdateConfig(config)),
    changePassword: (id, newPwd) => dispatch(configActions.changePassword(id ,newPwd)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfigPage);