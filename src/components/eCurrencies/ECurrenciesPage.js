import React, {
  Component
} from 'react';

//Helpers
import _ from 'lodash';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

//constants
import { ECURRENCIES_PAGE } from '../../constants';

//React-Redux
import { connect } from 'react-redux';
import * as eCurrencyActions from '../../actions/eCurrencyActions';
import * as paymentMethodActions from '../../actions/paymentMethodActions';

//Third Party Components
import Paper from 'material-ui/Paper';
import { Grid, Row, Col } from 'react-bootstrap';
import RaisedButton from 'material-ui/RaisedButton';

//Custom Components
import DataTable from '../common/DataTable';
import ActionBar from '../common/ActionBar';
import AddEditECurrency from './AddEditECurrency';
import ConfirmDltPopup from '../common/ConfirmDltPopup';

class ECurrenciesPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      headers: {
        id: "ID",
        title: "Title",
      },
      searchTerm: '',
      selectedECurrency: null, //for dlt/edit
      showDltModal: false,
      showAddEditModal: false,
      isEditModal: false,
    };
  }

  componentDidMount = () => {
    this._getECurrencies();

    if (this.props.paymentMethods.length === 0){
      this._getPaymentMethods();
    }
  }

  componentWillUnmount() {
    if (this.state.searchTerm) {
      this.setState({
        searchTerm: '',
      }, () => {
        this._getECurrencies();
      });
    }
  }

  _handleSearchTermChange = (event) => {
    this.setState({
      searchTerm: event.target.value,
    });
  }
  
  _handleSearchBtnClick = () => {
    this._getECurrencies();
  }

  _getECurrencies = () => {
    this.props.getECurrencies(this.state.searchTerm).then((res) => {
      if (res.status === 200) {
        this.props.saveECurrencies(res.data.eCurrencies);
      }
    }).catch((err) => {
      throw new Error(err);
    });
  }

  _getPaymentMethods = () => {
    this.props.getPaymentMethods().then((res) => {
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
      this._getECurrencies();
    });
  }

  _toggleDltModal = (selectedECurrency) => {
    this.setState(prevState => ({
      selectedECurrency,
      showDltModal: prevState.showDltModal ? false : true,
    }));
  }

  _dltselectedECurrency = () => {
    this.props.dltECurrency(this.state.selectedECurrency.id).then((res) => {
      if (res.status === 200) {
        this._getECurrencies();

        this.setState(prevState => ({
          showDltModal: false,
          selectedECurrency: null,
        }));
      }
    }).catch((err) => {
      throw new Error(err);
    });
  }

  _toggleAddEditModal = (selectedECurrency = null) => {
    this.setState((prevState, props) => ({
      showAddEditModal: prevState.showAddEditModal ? false : true,
      selectedECurrency,
      isEditModal: selectedECurrency ? true : false,
    }));
  }

  _addECurrency = (eCurrency) => {
    this.props.addECurrency(eCurrency).then((res) => {
      if (res.status === 200) {
        this._getECurrencies();

        this.setState(prevState => ({
          showAddEditModal: false,
        }));
      }
    }).catch((err) => {
      throw new Error(err);
    });
  }

  _editECurrency = (eCurrency) => {
    this.props.editECurrency(this.state.selectedECurrency.id, eCurrency).then((res) => {
      if (res.status === 200) {
        this._getECurrencies();

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
        label="Add ECurrency"
        onTouchTap={() => this._toggleAddEditModal()} 
      />
    );

    return (
      <div className="e-currency-page">
        <Grid className="data-table-container" fluid={true}>
          <Row>
            <Col xs={12}>
              <Paper zDepth={1}>
                <ActionBar
                  actionBarLeft={actionBarLeft}
                  searchTerm={this.state.searchTerm}
                  _handleSearchTermChange={this._handleSearchTermChange}
                  _clearFilteredData={this._clearFilteredData}
                  _handleSearchBtnClick={this._handleSearchBtnClick}
                />

                <DataTable
                  parent={ECURRENCIES_PAGE}
                  headers={this.state.headers} 
                  data={this.props.eCurrencies}
                  _toggleAddEditModal={this._toggleAddEditModal}
                  _toggleDltModal={this._toggleDltModal}
                />
              </Paper>
            </Col>
          </Row>

          <AddEditECurrency
            eCurrencies={this.props.eCurrencies}
            paymentMethods={this.props.paymentMethods}
            _addECurrency={this._addECurrency}
            _editECurrency={this._editECurrency}
            isEditModal={this.state.isEditModal}
            selectedECurrency={this.state.selectedECurrency}
            showAddEditModal={this.state.showAddEditModal}
            _toggleAddEditModal={this._toggleAddEditModal}
          />

          <ConfirmDltPopup
            type='ECurrency'
            showDltModal={this.state.showDltModal}
            _toggleDltModal={this._toggleDltModal}
            _dltSelected={this._dltselectedECurrency}
          />
        
        </Grid>        
      </div>
    );
  }
}

ECurrenciesPage.propTypes = {
  eCurrencies                      : PropTypes.array.eCurrencies,
  getECurrencies                   : PropTypes.func.isRequired,
  addECurrency                     : PropTypes.func.isRequired,
  editECurrency                    : PropTypes.func.isRequired,
  dltECurrency                     : PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  eCurrencies: state.eCurrencyReducer.eCurrencies,
  paymentMethods: state.paymentMethodReducer.paymentMethods,
});

const mapDispatchToProps = (dispatch) => {
  return {
    saveECurrencies: eCurrencies => dispatch(eCurrencyActions.saveECurrencies(eCurrencies)),
    addECurrency: id => dispatch(eCurrencyActions.addECurrency(id)),
    editECurrency: (id, eCurrency) => dispatch(eCurrencyActions.editECurrency(id, eCurrency)),
    dltECurrency: id => dispatch(eCurrencyActions.dltECurrency(id)),
    getECurrencies: (searchTerm) => dispatch(eCurrencyActions.getECurrencies(searchTerm)),
    savePaymentMethods: paymentMethods => dispatch(paymentMethodActions.savePaymentMethods(paymentMethods)),
    getPaymentMethods: (searchTerm) => dispatch(paymentMethodActions.getPaymentMethods(searchTerm)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ECurrenciesPage);