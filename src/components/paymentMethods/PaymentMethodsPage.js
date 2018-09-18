import React, {
  Component
} from 'react';

//Helpers
import _ from 'lodash';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

//constants
import { PAYMENTMETHODS_PAGE } from '../../constants';

//React-Redux
import { connect } from 'react-redux';
import * as paymentMethodActions from '../../actions/paymentMethodActions';

//Third Party Components
import Paper from 'material-ui/Paper';
import { Grid, Row, Col } from 'react-bootstrap';
import RaisedButton from 'material-ui/RaisedButton';

//Custom Components
import DataTable from '../common/DataTable';
import ActionBar from '../common/ActionBar';
import AddEditPaymentMethod from './AddEditPaymentMethod';
import ConfirmDltPopup from '../common/ConfirmDltPopup';

class PaymentMethodsPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      headers: {
        id: "ID",
        title: "Title",
        isBankingEnabled: 'Enable Banking',
      },
      searchTerm: '',
      selectedPaymentMethod: null, //for dlt/edit
      showDltModal: false,
      showAddEditModal: false,
      isEditModal: false,
    };
  }

  componentDidMount = () => {
    if (this.props.paymentMethods.length === 0){
      this._getPaymentMethods();
    }
  }

  componentWillUnmount() {
    if (this.state.searchTerm) {
      this.setState({
        searchTerm: '',
      }, () => {
        this._getPaymentMethods();
      });
    }
  }

  _handleSearchTermChange = (event) => {
    this.setState({
      searchTerm: event.target.value,
    });
  }

  _handleSearchBtnClick = () => {
    this._getPaymentMethods();
  }

  _getPaymentMethods = () => {
    this.props.getPaymentMethods(this.state.searchTerm).then((res) => {
      if (res.status === 200) {
        this.props.savePaymentMethods(res.data.paymentMethods);
      }
    }).catch((err) => {
      throw new Error(err);
    });
  }

  _clearFilteredData = () => {
    this.setState({
      searchTerm: '',
    }, () => {
      this._getPaymentMethods();
    });
  }

  _toggleIsBankingEnabled = (id, index, isBankingEnabled) => {
    this.props.toggleIsBankingEnabled(id, index, isBankingEnabled).then((res) => {
      if (res.status === 200) {
        this.props.savePaymentMethods(update(this.props.paymentMethods, {[index]: {isBankingEnabled: {$set: isBankingEnabled}}}));
      }
    }).catch((err) => {
      throw new Error(err);
    });
  }

  _toggleDltModal = (selectedPaymentMethod) => {
    this.setState(prevState => ({
      selectedPaymentMethod,
      showDltModal: prevState.showDltModal ? false : true,
    }));
  }

  _dltselectedPaymentMethod = () => {
    this.props.dltPaymentMethod(this.state.selectedPaymentMethod.id).then((res) => {
      if (res.status === 200) {
        const index = _.findIndex(this.props.paymentMethods, (paymentMethod) => (paymentMethod.id === this.state.selectedPaymentMethod.id));

        this.props.savePaymentMethods(update(this.props.paymentMethods, {$splice: [[index, 1]]}));
        this.setState(prevState => ({
          showDltModal: false,
          selectedPaymentMethod: null,
        }));
      }
    }).catch((err) => {
      throw new Error(err);
    });
  }

  _toggleAddEditModal = (selectedPaymentMethod = null) => {
    this.setState((prevState, props) => ({
      showAddEditModal: prevState.showAddEditModal ? false : true,
      selectedPaymentMethod,
      isEditModal: selectedPaymentMethod ? true : false,
    }));
  }

  _addPaymentMethod = (paymentMethod) => {
    this.props.addPaymentMethod(paymentMethod).then((res) => {
      if (res.status === 200) {

        this.props.savePaymentMethods(update(this.props.paymentMethods, {$unshift: [res.data.paymentMethod]}));
        this.setState(prevState => ({
          showAddEditModal: false,
        }));
      }
    }).catch((err) => {
      throw new Error(err);
    });
  }

  _editPaymentMethod = (paymentMethod) => {
    this.props.editPaymentMethod(this.state.selectedPaymentMethod.id, paymentMethod).then((res) => {
      if (res.status === 200) {
        const index = _.findIndex(this.props.paymentMethods, (_paymentMethod) => _paymentMethod.id === this.state.selectedPaymentMethod.id);

        this.props.savePaymentMethods(update(this.props.paymentMethods, {$splice: [[index, 1, res.data.paymentMethod]]}));
        this.setState(prevState => ({
          showAddEditModal: false,
          isEditModal: false,
        }));
      }
    })
  }

  render() {
    const actionBarLeft = (
      <RaisedButton 
        label="Add Payment Method"
        onTouchTap={() => this._toggleAddEditModal()} 
      />
    );

    return (
      <div className="payment-method-page">
        <Grid className="data-table-container" fluid={true}>
          <Row>
            <Col xs={12}>
              <Paper zDepth={1}>
                <ActionBar
                  actionBarLeft={actionBarLeft}
                  searchTerm={this.state.searchTerm}
                  searchPlaceholder="ID, Title"
                  _handleSearchTermChange={this._handleSearchTermChange}
                  _clearFilteredData={this._clearFilteredData}
                  _handleSearchBtnClick={this._handleSearchBtnClick}
                />

                <DataTable
                  parent={PAYMENTMETHODS_PAGE}
                  headers={this.state.headers} 
                  data={this.props.paymentMethods}
                  _toggleAddEditModal={this._toggleAddEditModal}
                  _toggleDltModal={this._toggleDltModal}
                  _toggleIsBankingEnabled={this._toggleIsBankingEnabled}
                  />
              </Paper>
            </Col>
          </Row>

          <AddEditPaymentMethod
            _addPaymentMethod={this._addPaymentMethod}
            _editPaymentMethod={this._editPaymentMethod}
            isEditModal={this.state.isEditModal}
            selectedPaymentMethod={this.state.selectedPaymentMethod}
            showAddEditModal={this.state.showAddEditModal}
            _toggleAddEditModal={this._toggleAddEditModal}
          />

          <ConfirmDltPopup
            type='Payment Method'
            showDltModal={this.state.showDltModal}
            _toggleDltModal={this._toggleDltModal}
            _dltSelected={this._dltselectedPaymentMethod}
          />
        
        </Grid>        
      </div>
    );
  }
}

PaymentMethodsPage.propTypes = {
  paymentMethods                      : PropTypes.array.isRequired,
  getPaymentMethods                   : PropTypes.func.isRequired,
  addPaymentMethod                    : PropTypes.func.isRequired,
  editPaymentMethod                   : PropTypes.func.isRequired,
  dltPaymentMethod                    : PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  paymentMethods: state.paymentMethodReducer.paymentMethods,
});

const mapDispatchToProps = (dispatch) => {
  return {
    savePaymentMethods: paymentMethods => dispatch(paymentMethodActions.savePaymentMethods(paymentMethods)),
    addPaymentMethod: id => dispatch(paymentMethodActions.addPaymentMethod(id)),
    editPaymentMethod: (id, paymentMethod) => dispatch(paymentMethodActions.editPaymentMethod(id, paymentMethod)),
    dltPaymentMethod: id => dispatch(paymentMethodActions.dltPaymentMethod(id)),
    getPaymentMethods: (searchTerm) => dispatch(paymentMethodActions.getPaymentMethods(searchTerm)),
    toggleIsBankingEnabled: (id, index, isBankingEnabled) => dispatch(paymentMethodActions.toggleIsBankingEnabled(id, index, isBankingEnabled)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentMethodsPage);