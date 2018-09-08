import React, {
  Component
} from 'react';

//Helpers
import PropTypes from 'prop-types';

//Third Party Components
import Dialog from 'material-ui/Dialog';
import {Tabs, Tab} from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

export default class UserDetailsModal extends Component {
  constructor(props) {
      super(props);
  }

  shouldComponentUpdate = (nextProps, nextState) => {
      return (this.state !== nextState ||
              this.props.showUserDetailsModal !== nextProps.showUserDetailsModal ||
              (this.props.userDetails !== nextProps.userDetails)
      );
  }

  render() {
      const actions = [
          <FlatButton
              label="Close"
              primary={true}
              onTouchTap={(e) => this.props._toggleUserDetailsModal(null)}
          />,
      ];

      return (
          <Dialog
              title='User Details'
              actions={actions}
              modal={false}
              autoScrollBodyContent={true}
              open={this.props.showUserDetailsModal}
              titleStyle={{
                  margin: "0px 0px",
                  padding: "10px",
                  fontSize: "18px",
                  fontWeight: 400,
                  borderBottom: '1px solid rgb(224, 224, 224)'
              }}
              contentStyle={{width: window.innerWidth > 992 ? '70%': '75%'}}
              bodyStyle={{width: '100%', padding: '0px 20px 20px 20px'}}
              actionsContainerStyle={{borderTop: '1px solid rgb(224, 224, 224)'}}
              onRequestClose={(e) => this.props._toggleUserDetailsModal(null)}
          >
            {
              this.props.userDetails &&
              <div className="data-table user-details">
                <Tabs>
                  <Tab label="User">
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Username</th>
                            <th>Country</th>
                            <th>ContactNumber</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{this.props.userDetails.user.id}</td>
                            <td>{this.props.userDetails.user.firstName}</td>
                            <td>{this.props.userDetails.user.lastName}</td>
                            <td>{this.props.userDetails.user.email}</td>
                            <td>{this.props.userDetails.user.username}</td>
                            <td>{this.props.userDetails.user.country}</td>
                            <td>{this.props.userDetails.user.contactNumber}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Tab>
                  <Tab label="Sent From Account">
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Acc. Name</th>
                            <th>Acc. #</th>
                            <th>Details</th>
                            <th>Type</th>
                            <th>Payment Method</th>
                            <th>E Currency</th>
                            <th>Bank Name</th>
                            <th>Bank Address</th>
                            <th>Swift Code</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{this.props.userDetails.sentFromAccount.id}</td>
                            <td>{this.props.userDetails.sentFromAccount.firstName ? this.props.userDetails.sentFromAccount.firstName : '-'}</td>
                            <td>{this.props.userDetails.sentFromAccount.lastName ? this.props.userDetails.sentFromAccount.lastName : '-'}</td>
                            <td>{this.props.userDetails.sentFromAccount.accountName ? this.props.userDetails.sentFromAccount.accountName : '-'}</td>
                            <td>{this.props.userDetails.sentFromAccount.accountNum ? this.props.userDetails.sentFromAccount.accountNum : '-'}</td>
                            <td>{this.props.userDetails.sentFromAccount.details ? this.props.userDetails.sentFromAccount.details : '-'}</td>
                            <td>{this.props.userDetails.sentFromAccount.accountType}</td>
                            <td>{this.props.userDetails.sentFromAccount.paymentMethod ? this.props.userDetails.sentFromAccount.paymentMethod.title : '-'}</td>
                            <td>{this.props.userDetails.sentFromAccount.eCurrency ? this.props.userDetails.sentFromAccount.eCurrency.title : '-'}</td>
                            <td>{this.props.userDetails.sentFromAccount.bankName ? this.props.userDetails.sentFromAccount.bankName : '-'}</td>
                            <td>{this.props.userDetails.sentFromAccount.bankAddress ? this.props.userDetails.sentFromAccount.bankAddress : '-'}</td>
                            <td>{this.props.userDetails.sentFromAccount.bankSwiftCode ? this.props.userDetails.sentFromAccount.bankSwiftCode: '-'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Tab>
                  <Tab label="Received In Account">
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Acc. Name</th>
                            <th>Acc. #</th>
                            <th>Details</th>
                            <th>Type</th>
                            <th>Payment Method</th>
                            <th>E Currency</th>
                            <th>Bank Name</th>
                            <th>Bank Address</th>
                            <th>Swift Code</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{this.props.userDetails.receivedInAccount.id}</td>
                            <td>{this.props.userDetails.receivedInAccount.firstName ? this.props.userDetails.receivedInAccount.firstName : '-'}</td>
                            <td>{this.props.userDetails.receivedInAccount.lastName ? this.props.userDetails.receivedInAccount.lastName : '-'}</td>
                            <td>{this.props.userDetails.receivedInAccount.accountName ? this.props.userDetails.receivedInAccount.accountName : '-'}</td>
                            <td>{this.props.userDetails.receivedInAccount.accountNum ? this.props.userDetails.receivedInAccount.accountNum : '-'}</td>
                            <td>{this.props.userDetails.receivedInAccount.details ? this.props.userDetails.receivedInAccount.details : '-'}</td>
                            <td>{this.props.userDetails.receivedInAccount.accountType}</td>
                            <td>{this.props.userDetails.receivedInAccount.paymentMethod ? this.props.userDetails.receivedInAccount.paymentMethod.title : '-'}</td>
                            <td>{this.props.userDetails.receivedInAccount.eCurrency ? this.props.userDetails.receivedInAccount.eCurrency.title : '-'}</td>
                            <td>{this.props.userDetails.receivedInAccount.bankName ? this.props.userDetails.receivedInAccount.bankName : '-'}</td>
                            <td>{this.props.userDetails.receivedInAccount.bankAddress ? this.props.userDetails.receivedInAccount.bankAddress : '-'}</td>
                            <td>{this.props.userDetails.receivedInAccount.bankSwiftCode ? this.props.userDetails.receivedInAccount.bankSwiftCode: '-'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Tab>
                </Tabs>
              </div>
            }
          </Dialog>
      );
  };
}

UserDetailsModal.propType = {
  showUserDetailsModal: PropTypes.bool,
  _toggleUserDetailsModal : PropTypes.func,
}