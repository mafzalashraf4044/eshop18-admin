import React, {
    Component
} from 'react';

//Helpers
import _ from 'lodash';
import PropTypes from 'prop-types';

//constants
import { USERS_PAGE, ORDERS_PAGE, ECURRENCIES_PAGE, PAYMENTMETHODS_PAGE, NEWS_PAGE } from '../../constants';

//Third Party Components
import Toggle from 'material-ui/Toggle';
import FontIcon from 'material-ui/FontIcon';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class DataTable extends Component {

    constructor(props){
      super(props);
      this.state = {
        keys: [],
        tableHeight: window.innerHeight - 162,
      };

    }

    shouldComponentUpdate = (nextProps, nextState) => {
      return (this.props.data !== nextProps.data || 
              this.props.sortBy !== nextProps.sortBy ||
              this.props.sortType !== nextProps.sortType ||
              this.props.selectedUsers !== nextProps.selectedUsers
            );
    }

    componentWillMount() {
      this.setState({
        keys: Object.keys(this.props.headers)
      });
    }
    
    getUserTableCoulmns = (user, index) => {
        return [
                <td style={{width: 40}}>
                  <Checkbox
                    checked={this.props.selectedUsers.indexOf(user.id) != -1}
                    onCheck={(e, checked) => this.props._setSelectedUsers(user.id, checked)}
                  />                  
                </td>,
                <td>{user.firstName}</td>,
                <td>{user.lastName}</td>,
                <td>{user.email}</td>,
                <td>{user.username}</td>,
                <td>{user.country}</td>,
                <td>{user.contactNumber}</td>,
                <td>
                    <Toggle defaultToggled={user.isVerified} onToggle={(e, isVerfied) => this.props._toggleUserVerifiedStatus(user.id, index, isVerfied)} />
                </td>,

            ];
    }

    getOrderTableCoulmns = (order) => {
        return [
                <td>{order.id}</td>,
                <td>{order.sentFrom}</td>,
                <td>{order.amountSent}</td>,
                <td>{order.receivedIn}</td>,
                <td>{order.amountReceived}</td>,
                <td>
                  <SelectField
                    value={order.status}
                    onChange={(e, key, status) => this.props.onStatusUpdate(order.id, status)}
                    style={{
                      width: "100%",
                      fontSize: "13px"
                    }}
                    menuItemStyle={{
                      fontSize: "13px"
                    }}
                  >
                    <MenuItem value="pending" primaryText="Pending" />
                    <MenuItem value="completed" primaryText="Completed" />
                    <MenuItem value="cancelled" primaryText="Cancelled" />
                    <MenuItem value="rejected" primaryText="Rejected" />
                  </SelectField>
                </td>,
                <td>{order.action ? order.action : '-'}</td>,
            ];
    }

    getECurrencyTableCoulmns = (eCurrency) => {
      return [
        <td>{eCurrency.id}</td>,
        <td>{eCurrency.title}</td>,
      ];
    }

    getPaymentMethodTableCoulmns = (paymentMethod) => {
      return [
        <td>{paymentMethod.id}</td>,
        <td>{paymentMethod.title}</td>,
      ];
    }

    getNewsTableCoulmns = (news) => {
      return [
        <td>{news.id}</td>,
        <td>{news.title}</td>,
        <td>{news.content}</td>,
      ];
    }

    render() {
        return (
          <div className="data-table table-responsive" { ...(window.innerWidth > 992 && {style: {height: this.state.tableHeight.toString() + 'px'}}) }>
            <table 
              className="table table-striped"
            >
              <thead>
                <tr>
                  {
                    this.props.parent === USERS_PAGE &&
                    <th style={{width: 40}}>
                      <Checkbox
                        checked={this.props.selectedUsers.length === this.props.data.length}
                        onCheck={(e, checked) => this.props._setSelectedUsers(null, checked, true)}
                      />             
                    </th>
                  }
                  {
                    this.state.keys.map((key, index) => {
                      return (
                        <th key={index}>
                          {this.props.headers[key]}
                        </th>
                      );
                    })
                  }

                  {
                    (this.props.parent === USERS_PAGE || this.props.parent === NEWS_PAGE || this.props.parent === ECURRENCIES_PAGE || this.props.parent === PAYMENTMETHODS_PAGE) &&
                    <th>Actions</th>
                  }
                </tr>
              </thead>
              <tbody displayRowCheckbox={false}>
                { 
                  this.props.data.map((row, index) => {
                    return (
                        <tr key={index}>
                          {this.props.parent === USERS_PAGE ? this.getUserTableCoulmns(row, index) : null}
                          {this.props.parent === ORDERS_PAGE ? this.getOrderTableCoulmns(row) : null}
                          {this.props.parent === ECURRENCIES_PAGE ? this.getECurrencyTableCoulmns(row) : null}
                          {this.props.parent === PAYMENTMETHODS_PAGE ? this.getPaymentMethodTableCoulmns(row) : null}
                          {this.props.parent === NEWS_PAGE ? this.getNewsTableCoulmns(row) : null}

                          {
                            (this.props.parent === USERS_PAGE || this.props.parent === NEWS_PAGE || this.props.parent === ECURRENCIES_PAGE || this.props.parent === PAYMENTMETHODS_PAGE) &&
                            <td>
                              <div className="btn-group">
                                {
                                  this.props.parent === USERS_PAGE &&
                                  <RaisedButton 
                                    style={{minWidth: '40px'}} 
                                    onTouchTap={(e) => this.props._toggleUserDetailsModal(row.id)} 
                                    icon={<FontIcon className="fa fa-info-circle" style={{fontSize: '14px'}}/>} 
                                  />
                                }

                                {
                                  (this.props.parent === NEWS_PAGE || this.props.parent === ECURRENCIES_PAGE) &&
                                  <RaisedButton 
                                    style={{minWidth: '40px'}} 
                                    onTouchTap={(e) => this.props._toggleAddEditModal(row)} 
                                    icon={<FontIcon className="fa fa-pencil" style={{fontSize: '14px'}}/>} 
                                  />
                                }

                                <RaisedButton 
                                  style={{minWidth: '40px'}} 
                                  onTouchTap={(e) => this.props._toggleDltModal(row)} 
                                  icon={<FontIcon className="fa fa-trash" style={{fontSize: '14px'}}/>} 
                                />
                              </div>
                            </td>
                          }
                        </tr>                      
                    );
                  })
                }

                {
                  this.props.data.length === 0 &&
                  <tr>
                    <td style={{backgroundColor: '#FFF'}}>
                      <div>Nothing to display.</div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        );
    };
}

DataTable.propType = {
    headers             : PropTypes.object,
    data                : PropTypes.object, 
    selectedUsers       : PropTypes.object, 
    sortType            : PropTypes.string, 
    sortBy              : PropTypes.string,
    _toggleDltModal     : PropTypes.func,
    _toggleAddEditModal : PropTypes.func,
    _sortWRTHeader      : PropTypes.func,   
}

export default DataTable;