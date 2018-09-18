import React, {
  Component
} from 'react';

//Helpers
import _ from 'lodash';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

//constants
import { ORDERS_PAGE } from '../../constants';

//React-Redux
import { connect } from 'react-redux';
import * as orderActions from '../../actions/orderActions';
import * as userActions from '../../actions/userActions';

//Third Party Components
import Paper from 'material-ui/Paper';
import AutoComplete from 'material-ui/AutoComplete';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Grid, Row, Col } from 'react-bootstrap';

//Custom Components
import DataTable from '../common/DataTable';
import ActionBar from '../common/ActionBar';
import UserDetailsModal from './UserDetailsModal';

class OrdersPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      headers: {
        id: "ID",
        date: "Date",
        sentFrom: "Sent From",
        receivedIn: "Received In",
        firstAmount: "Amount",
        secondAmount: "Amount after Service Charges",
        status: "Status",
        actions: "Actions"
      },
      searchTerm: '',
      userFilterSearchTerm: '',
      user: null,
      type: 'buy',
      showUserDetailsModal: false,
      userDetails: null,
      selectedOrderId: null,
    };
  }

  componentDidMount = () => {
    if (this.props.orders.length === 0){
      this._getOrders();
    }

    if (this.props.users.length === 0){
      this._getUsers();
    }
  }
  
  _handleSearchTermChange = (event) => {
    this.setState({
      searchTerm: event.target.value,
    });
  }
  
  _handleSearchBtnClick = () => {
    this._getOrders();
  }

  _getOrders = () => {
    this.props.getOrders(this.state.type, this.state.searchTerm, this.state.user).then((res) => {
      if (res.status === 200) {
        this.props.saveOrders(res.data.orders);
      }
    }).catch((err) => {
      throw new Error(err);
    });
  }

  _getUsers = () => {
    this.props.getUsers().then((res) => {
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
      this._getOrders();
    });
  }

  onUserFilterSearchTermChange = (userFilterSearchTerm) => {
    this.setState({
      userFilterSearchTerm,
    }, () => {
      if (!this.state.userFilterSearchTerm) {
        this.setState({
          user: null,
        }, () => {
          this._getOrders();
        });
      }
    });
  }

  onNewRequest = (chosenRequest, index) => {
    const user = this.props.users[index].id;
    this.setState({
      user
    }, () => {
      this._getOrders();
    });
  }

  onTypeChange = (event, key, type) => {
    this.setState({
      type,
    }, () => {
      this._getOrders();
    });
  }

  onStatusUpdate = (id, status) => {
    this.props.updateOrderStatus(id, status).then((res) => {
      if (res.status === 200) {
        const index = _.findIndex(this.props.orders, (order) => (order.id === id));
        this.props.saveOrders(update(this.props.orders, {$splice: [[index, 1, res.data.order]]}));
      }
    }).catch((err) => {
      throw new Error(err);
    });
  }

  _toggleUserDetailsModal = (id) => {
    this.setState(prevState => ({
      showUserDetailsModal: prevState.showUserDetailsModal ? false : true,
      selectedOrderId: id,
    }), () => {
      if (this.state.showUserDetailsModal) {
        this._getUserDetailsFromOrder();
      }
    });
  }

  _getUserDetailsFromOrder = () => {
    this.props.getUserDetailsFromOrder(this.state.selectedOrderId).then((res) => {
      if (res.status === 200) {
        this.setState({
          userDetails: res.data.userDetails,
        });
      }
    })
  }

  render() {
    const actionBarLeft = (
      <div className="df jc-fs ai-c">
        <div style={{width: '160px', marginRight: 15}}>
          <AutoComplete
            hintText="User Filter"
            onNewRequest={this.onNewRequest}
            searchText={this.state.userFilterSearchTerm}
            onUpdateInput={this.onUserFilterSearchTermChange}
            dataSource={this.props.users.map(user => ({
              text: user.firstName + ' ' + user.lastName,
              value: `${user.firstName} ${user.lastName} ${user.id} ${user.contactNumber} ${user.email} ${user.username}`
            }))}
            filter={(searchText, text, user) => {          
              return user.value.toString().toLowerCase().indexOf(searchText.toLowerCase()) !== -1
            }}
            openOnFocus={false}
            style={{
              width: "100%",
              fontSize: "13px"
            }}
            textFieldStyle={{
              width: "100%",
              fontSize: "13px"
            }}
            menuProps={{
              menuItemStyle:{
                fontSize: "13px"
              }
            }}
          />
        </div>
        <SelectField
          value={this.state.type}
          onChange={this.onTypeChange}
          style={{
            width: "160px",
            fontSize: "13px"
          }}
          menuItemStyle={{
            fontSize: "13px"
          }}
        >
          <MenuItem value="buy" primaryText="Buy" />
          <MenuItem value="sell" primaryText="Sell" />
          <MenuItem value="exchange" primaryText="Exchange" />
        </SelectField>
      </div>
    );

    return (
      <div className="orders-page">
        <Grid className="data-table-container" fluid={true}>
          <Row>
            <Col xs={12}>
              <Paper zDepth={1}>
                <ActionBar 
                  parent={ORDERS_PAGE}
                  actionBarLeft={actionBarLeft}
                  searchTerm={this.state.searchTerm}
                  searchPlaceholder="ID, Status"
                  _handleSearchTermChange={this._handleSearchTermChange}
                  _clearFilteredData={this._clearFilteredData}
                  _handleSearchBtnClick={this._handleSearchBtnClick}
                />

                <DataTable
                  parent={ORDERS_PAGE}
                  data={this.props.orders}
                  headers={this.state.headers} 
                  onStatusUpdate={this.onStatusUpdate}
                  _toggleUserDetailsModal={this._toggleUserDetailsModal}
                />
              </Paper>
            </Col>
          </Row>

          <UserDetailsModal
            userDetails={this.state.userDetails}
            showUserDetailsModal={this.state.showUserDetailsModal}
            _toggleUserDetailsModal={this._toggleUserDetailsModal}
            _getUserDetailsFromOrder={this._getUserDetailsFromOrder}
          />
        </Grid>        
      </div>
    );
  }
}

OrdersPage.propTypes = {
  getOrders : PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  users: state.userReducer.users,
  orders: state.orderReducer.orders,
});

const mapDispatchToProps = (dispatch) => {
  return {
    saveOrders: orders => dispatch(orderActions.saveOrders(orders)),
    updateOrderStatus: (id, status) => dispatch(orderActions.updateOrderStatus(id, status)),
    getOrders: (type, searchTerm, user) => dispatch(orderActions.getOrders(type, searchTerm, user)),
    saveUsers: users => dispatch(userActions.saveUsers(users)),
    getUsers: searchTerm => dispatch(userActions.getUsers(searchTerm)),
    getUserDetailsFromOrder: id => dispatch(orderActions.getUserDetailsFromOrder(id)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrdersPage);