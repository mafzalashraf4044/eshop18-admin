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
                    <Tab label="Orders">
                    <div className="table-responsive">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Sent From</th>
                              <th>Amount Sent</th>
                              <th>Received In</th>
                              <th>Amount Received</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              this.props.userDetails.orders.map((order) => (
                                <tr>
                                  <td>{order.id}</td>
                                  <td>{order.sentFrom.title}</td>
                                  <td>{order.amountSent}</td>
                                  <td>{order.receivedIn.title}</td>
                                  <td>{order.amountReceived}</td>
                                  <td>{order.status}</td>
                                  <td>{order.action}</td>
                                </tr>
                              ))
                            }

                            {
                              this.props.userDetails.orders.length === 0 &&
                              <tr>
                                <td style={{backgroundColor: '#FFF'}}>
                                  <div>Nothing to display.</div>
                                </td>
                              </tr>
                            }
                          </tbody>
                        </table>
                      </div>
                    </Tab>

                    <Tab label="Accounts">
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
                            {
                              this.props.userDetails.accounts.map((account) => (
                                <tr>
                                  <td>{account.id}</td>
                                  <td>{account.firstName ? account.firstName : '-'}</td>
                                  <td>{account.lastName ? account.lastName : '-'}</td>
                                  <td>{account.accountName ? account.accountName : '-'}</td>
                                  <td>{account.accountNum ? account.accountNum : '-'}</td>
                                  <td>{account.details ? account.details : '-'}</td>
                                  <td>{account.accountType}</td>
                                  <td>{account.paymentMethod ? account.paymentMethod.title : '-'}</td>
                                  <td>{account.eCurrency ? account.eCurrency.title : '-'}</td>
                                  <td>{account.bankName ? account.bankName : '-'}</td>
                                  <td>{account.bankAddress ? account.bankAddress : '-'}</td>
                                  <td>{account.bankSwiftCode ? account.bankSwiftCode: '-'}</td>
                                </tr>
                              ))
                            }

                            {
                              this.props.userDetails.accounts.length === 0 &&
                              <tr>
                                <td style={{backgroundColor: '#FFF'}}>
                                  <div>Nothing to display.</div>
                                </td>
                              </tr>
                            }
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