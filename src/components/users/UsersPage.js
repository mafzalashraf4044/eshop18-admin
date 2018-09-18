import React, {
  Component
} from 'react';

//Helpers
import _ from 'lodash';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

//constants
import { USERS_PAGE } from '../../constants';

//React-Redux
import { connect } from 'react-redux';
import * as userActions from '../../actions/userActions';

//Third Party Components
import Paper from 'material-ui/Paper';
import { Grid, Row, Col } from 'react-bootstrap';
import RaisedButton from 'material-ui/RaisedButton';

//Custom Components
import DataTable from '../common/DataTable';
import ActionBar from '../common/ActionBar';
import SendEmailModal from './SendEmailModal';
import UserDetailsModal from './UserDetailsModal';
import ConfirmDltPopup from '../common/ConfirmDltPopup';

class UsersPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      headers: {
        id: "ID",
        date: "Date",
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email",
        username: "Username",
        country: "Country",
        contactNumber: "Contact Number",
        isVerified: "Verified",
      },
      searchTerm: '',
      selectedUserId: null, //for dlt
      selectedUsers: [], //for email
      showDltModal: false,
      showSendEmailModal: false,
      showUserDetailsModal: false,
      userDetails: null,
    };
  }

  componentDidMount = () => {
    if (this.props.users.length === 0){
      this._getUsers();
    }
  }

  componentWillUnmount() {
    if (this.state.searchTerm) {
      this.setState({
        searchTerm: '',
      }, () => {
        this._getUsers();
      });
    }
  }

  _handleSearchTermChange = (event) => {
    this.setState({
      searchTerm: event.target.value,
    });
  }
  
  _handleSearchBtnClick = () => {
    this._getUsers();
  }

  _getUsers = () => {
    this.props.getUsers(this.state.searchTerm).then((res) => {
      if (res.status === 200) {
        this.props.saveUsers(res.data.users);
      }
    }).catch((err) => {
      throw new Error(err);
    });
  }

  _clearFilteredData = () => {
    this.setState({
      searchTerm: '',
    }, () => {
      this._getUsers();
    });
  }

  _toggleUserVerifiedStatus = (id, index, isVerified) => {
    this.props.toggleUserVerifiedStatus(id, index, isVerified).then((res) => {
      if (res.status === 200) {
        this.props.saveUsers(update(this.props.users, {[index]: {isVerified: {$set: isVerified}}}));
      }
    }).catch((err) => {
      throw new Error(err);
    });
  }

  _setSelectedUsers = (id, checked = false, selectAll = false) => {
    
    //For deleting all users
    if(selectAll) {
      //If selecte all checkbox is checked, select all users, else remove all users
      this.setState({
        selectedUsers: checked ? _.map(this.props.users, 'id') : [],
      });
    } else {
      if (checked) {
        this.setState((prevState, props) => ({
          selectedUsers: update(prevState.selectedUsers, {$push: [id]}),
        }));
      } else {
        const index = _.findIndex(this.state.selectedUsers, (_id) => (_id === id));

        this.setState(prevState => ({
          selectedUsers: update(prevState.selectedUsers, {$splice: [[index, 1]]}),
        }));
      }
    }
  }

  _toggleDltModal = (user) => {
    this.setState((prevState, props) => ({
      showDltModal: prevState.showDltModal ? false : true,
      selectedUserId: user.id,
    }));
  }

  _dltSelectedUser = () => {
    const id = this.state.selectedUserId;
    this.props.dltUser(id).then((res) => {
      if (res.status === 200) {
        const index = _.findIndex(this.props.users, (user) => (user.id === id));

        this.props.saveUsers(update(this.props.users, {$splice: [[index, 1]]}));
        this.setState(prevState => ({
          showDltModal: false,
          selectedUserId: null,
        }));
      }
    }).catch((err) => {
      throw new Error(err);
    });
  }

  _toggleSendEmailModal = () => {
    this.setState((prevState, props) => ({
      showSendEmailModal: prevState.showSendEmailModal ? false : true,
    }));
  }

  _sendEmail = (subject, content) => {
    const emails = [];
    
    this.props.users.forEach(user => {
      if (this.state.selectedUsers.indexOf(user.id) !== -1) {
       emails.push(user.email);
      }
    });

    this.props.sendEmailToList(emails, subject, content).then((res) => {
      if (res.status === 200) {
        this.setState(prevState => ({
          showSendEmailModal: false,
          selectedUsers: [],
        }));
      }
    }).catch((err) => {
      throw new Error(err);
    });
  }

  _toggleUserDetailsModal = (id) => {
    this.setState(prevState => ({
      showUserDetailsModal: prevState.showUserDetailsModal ? false : true,
      selectedUserId: id,
    }), () => {
      if (this.state.showUserDetailsModal) {
        this._getUserOrdersAndAccounts();
      }
    });
  }

  _getUserOrdersAndAccounts = () => {
    this.props.getUserOrdersAndAccounts(this.state.selectedUserId).then((res) => {
      if (res.status === 200) {
        this.setState({
          userDetails: res.data,
        });
      }
    }).catch((err) => {
      throw new Error(err);
    });
  }

  render() {
    const actionBarLeft = (
      <RaisedButton 
        label="Send Email"
        disabled={this.state.selectedUsers.length === 0}
        onTouchTap={this._toggleSendEmailModal} 
      />
    );

    return (
      <div className="users-page">
        <Grid className="data-table-container" fluid={true}>
          <Row>
            <Col xs={12}>
              <Paper zDepth={1}>
                <ActionBar
                  parent={USERS_PAGE}
                  actionBarLeft={actionBarLeft}
                  searchTerm={this.state.searchTerm}
                  searchPlaceholder="Search..."
                  _clearFilteredData={this._clearFilteredData}
                  _handleSearchBtnClick={this._handleSearchBtnClick}
                  _handleSearchTermChange={this._handleSearchTermChange}
                />

                <DataTable
                  parent={USERS_PAGE}
                  data={this.props.users}
                  headers={this.state.headers}
                  selectedUsers={this.state.selectedUsers}
                  _setSelectedUsers={this._setSelectedUsers}
                  _toggleDltModal={this._toggleDltModal}
                  _toggleUserDetailsModal={this._toggleUserDetailsModal}
                  _toggleUserVerifiedStatus={this._toggleUserVerifiedStatus}
                />
              </Paper>
            </Col>
          </Row>

          <ConfirmDltPopup
            type='User'
            showDltModal={this.state.showDltModal}
            _toggleDltModal={this._toggleDltModal}
            _dltSelected={this._dltSelectedUser}
          />
         
          <SendEmailModal
            showSendEmailModal={this.state.showSendEmailModal}
            _toggleSendEmailModal={this._toggleSendEmailModal}
            _sendEmail={this._sendEmail}
          />

          <UserDetailsModal
            userDetails={this.state.userDetails}
            showUserDetailsModal={this.state.showUserDetailsModal}
            _toggleUserDetailsModal={this._toggleUserDetailsModal}
            _getUserOrdersAndAccounts={this._getUserOrdersAndAccounts}
          />

        </Grid>        
      </div>
    );
  }
}

UsersPage.propTypes = {
  users                      : PropTypes.array.isRequired,
  getUsers                   : PropTypes.func.isRequired,
  dltUser                    : PropTypes.func.isRequired,
  toggleUserVerifiedStatus   : PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  users: state.userReducer.users,
});

const mapDispatchToProps = (dispatch) => {
  return {
    saveUsers: users => dispatch(userActions.saveUsers(users)),
    dltUser: id => dispatch(userActions.dltUser(id)),
    getUsers: (searchTerm) => dispatch(userActions.getUsers(searchTerm)),
    getUserOrdersAndAccounts: id => dispatch(userActions.getUserOrdersAndAccounts(id)),
    sendEmailToList: (emails, subject, content) => dispatch(userActions.sendEmailToList(emails, subject, content)),
    toggleUserVerifiedStatus: (id, index, isVerfied) => dispatch(userActions.toggleUserVerifiedStatus(id, index, isVerfied)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersPage);