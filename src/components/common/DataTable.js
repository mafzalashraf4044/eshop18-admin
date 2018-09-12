import React, {
    Component
} from 'react';

//Helpers
import _ from 'lodash';
import PropTypes from 'prop-types';

//constants
import { USERS_PAGE, ORDERS_PAGE, ECURRENCIES_PAGE, PAYMENTMETHODS_PAGE, NEWS_PAGE, REVIEWS_PAGE } from '../../constants';

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
                <td key='1' style={{width: 40}}>
                  <Checkbox
                    checked={this.props.selectedUsers.indexOf(user.id) !== -1}
                    onCheck={(e, checked) => this.props._setSelectedUsers(user.id, checked)}
                  />                  
                </td>,
                <td key='2'>{user.firstName}</td>,
                <td key='3'>{user.lastName}</td>,
                <td key='4'>{user.email}</td>,
                <td key='5'>{user.username}</td>,
                <td key='6'>{user.country}</td>,
                <td key='7'>{user.contactNumber}</td>,
                <td key='8'>
                    <Toggle defaultToggled={user.isBankingEnabled} onToggle={(e, isVerfied) => this.props._toggleUserVerifiedStatus(user.id, index, isVerfied)} />
                </td>,

            ];
    }

    getOrderTableCoulmns = (order) => {
        return [
                <td key='1'>{order.id}</td>,
                <td key='2'>{order.sentFrom.title}</td>,
                <td key='3'>{order.receivedIn.title}</td>,
                <td key='4'>{order.firstAmount}</td>,
                <td key='5'>{order.secondAmount}</td>,
                <td key='6'>
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
            ];
    }

    getECurrencyTableCoulmns = (eCurrency) => {
      return [
        <td key='1'>{eCurrency.id}</td>,
        <td key='2'>{eCurrency.title}</td>,
        <td key='3'>{eCurrency.reserves}</td>,
      ];
    }

    getPaymentMethodTableCoulmns = (paymentMethod, index) => {
      return [
        <td key='1'>{paymentMethod.id}</td>,
        <td key='2'>{paymentMethod.title}</td>,
        <td key='3'>
            <Toggle defaultToggled={paymentMethod.isBankingEnabled} onToggle={(e, isBankingEnabled) => this.props._toggleIsBankingEnabled(paymentMethod.id, index, isBankingEnabled)} />
        </td>,
      ];
    }

    getNewsTableCoulmns = (news) => {
      return [
        <td key='1'>{news.id}</td>,
        <td key='2'>{news.title}</td>,
        <td key='3'>{news.content}</td>,
      ];
    }

    getReviewsTableCoulmns = (review) => {
      return [
        <td key='1'>{review.id}</td>,
        <td key='2'>{review.title}</td>,
        <td key='3'>{review.content}</td>,
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
                    (this.props.parent === USERS_PAGE || this.props.parent === NEWS_PAGE || this.props.parent === REVIEWS_PAGE || this.props.parent === ECURRENCIES_PAGE || this.props.parent === PAYMENTMETHODS_PAGE) &&
                    <th>Actions</th>
                  }
                </tr>
              </thead>
              <tbody>
                { 
                  this.props.data.map((row, index) => {
                    return (
                        <tr key={index}>
                          {this.props.parent === USERS_PAGE ? this.getUserTableCoulmns(row, index) : null}
                          {this.props.parent === ORDERS_PAGE ? this.getOrderTableCoulmns(row) : null}
                          {this.props.parent === ECURRENCIES_PAGE ? this.getECurrencyTableCoulmns(row) : null}
                          {this.props.parent === PAYMENTMETHODS_PAGE ? this.getPaymentMethodTableCoulmns(row, index) : null}
                          {this.props.parent === NEWS_PAGE ? this.getNewsTableCoulmns(row) : null}
                          {this.props.parent === REVIEWS_PAGE ? this.getReviewsTableCoulmns(row) : null}

                          {
                            (this.props.parent === USERS_PAGE || this.props.parent === NEWS_PAGE || this.props.parent === REVIEWS_PAGE || this.props.parent === ECURRENCIES_PAGE || this.props.parent === PAYMENTMETHODS_PAGE || this.props.parent === ORDERS_PAGE) &&
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
                                  this.props.parent === ORDERS_PAGE &&
                                  <RaisedButton 
                                    style={{minWidth: '40px'}} 
                                    onTouchTap={(e) => this.props._toggleUserDetailsModal(row.id)} 
                                    icon={<FontIcon className="fa fa-info-circle" style={{fontSize: '14px'}}/>} 
                                  />
                                }

                                {
                                  (this.props.parent === NEWS_PAGE || this.props.parent === REVIEWS_PAGE || this.props.parent === ECURRENCIES_PAGE) &&
                                  <RaisedButton 
                                    style={{minWidth: '40px'}} 
                                    onTouchTap={(e) => this.props._toggleAddEditModal(row)} 
                                    icon={<FontIcon className="fa fa-pencil" style={{fontSize: '14px'}}/>} 
                                  />
                                }

                                {
                                  this.props.parent !== ORDERS_PAGE &&
                                  <RaisedButton 
                                    style={{minWidth: '40px'}} 
                                    onTouchTap={(e) => this.props._toggleDltModal(row)} 
                                    icon={<FontIcon className="fa fa-trash" style={{fontSize: '14px'}}/>} 
                                  />
                                }
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