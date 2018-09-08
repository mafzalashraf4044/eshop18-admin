import React, {
    Component
} from 'react';

//Helpers
import _ from 'lodash';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

//Third Party Components
import Dialog from 'material-ui/Dialog';
import {Tabs, Tab} from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

export default class AddEditECurrency extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eCurrency: {
                title: '',
                reserves: '',
                buyCommissions: [],
                sellCommissions: [],
                exchangeCommissions: [],
            },
        };
    }
    
    shouldComponentUpdate = (nextProps, nextState) => {
        return (this.state !== nextState ||
            this.props.isEditModal !== nextProps.isEditModal || 
            this.props.showAddEditModal !== nextProps.showAddEditModal ||
            (this.props.selectedECurrency !== nextProps.selectedECurrency && nextProps.showAddEditModal)
            //If selected user is changed and AddEditModal is Open, selectedECurrency value can also be changed in case of confirmDltModal
        );
    }

    componentWillReceiveProps = (nextProps) => {
        
        if (!this.props.showAddEditModal && nextProps.showAddEditModal) {

            if (nextProps.selectedECurrency) {
                this.setState({
                    eCurrency: {
                        reserves: nextProps.selectedECurrency.reserves,
                        buyCommissions: nextProps.selectedECurrency.buyCommissions,
                        sellCommissions: nextProps.selectedECurrency.sellCommissions,
                        exchangeCommissions: nextProps.selectedECurrency.exchangeCommissions,
                    },
                });
            } else {
                this.setState({
                    eCurrency: {
                        title: '',
                        reserves: '',
                        buyCommissions: nextProps.paymentMethods.map(eCurrency => ({
                            title: eCurrency.title, percentage: 0, fixed: 0
                        })),
                        sellCommissions: nextProps.paymentMethods.map(eCurrency => ({
                            title: eCurrency.title, percentage: 0, fixed: 0
                        })),
                        exchangeCommissions: nextProps.eCurrencies.map(eCurrency => ({
                            title: eCurrency.title, percentage: 0, fixed: 0
                        })),
                    }
                });
            }
        }
    }

    _handleInputChange = (event) => {
        let target = event.target;
        this.setState((prevState, props) => ({
            eCurrency: update(prevState.eCurrency, {$merge: {[target.name]: target.value}}),
        }));
    }

    _handleCommissionChange = (e, commissionTypeKey, index, key) => {
        const commissionType = this.state.eCurrency[commissionTypeKey];
        commissionType[index][key] = parseFloat(e.target.value).toFixed(2);

        this.setState((prevState, props) => ({
            eCurrency: update(prevState.eCurrency, {$merge: {[commissionTypeKey]: commissionType}}),
        }));
    }

    render() {
        const inputStyles = {
            inputStyle:{fontSize: "12px"},
            floatingLabelStyle:{fontSize: "12px"}
        };

        const actions = [
            <FlatButton
                primary
                label={this.props.isEditModal ? 'Save Changes' : 'Add'}
                onTouchTap={e => {
                    if(this.props.isEditModal){
                        this.props._editECurrency(this.state.eCurrency)
                    }else{
                        this.props._addECurrency(this.state.eCurrency)
                    }
                }}
            />,
            <FlatButton
                label="Close"
                primary={true}
                onTouchTap={(e) => this.props._toggleAddEditModal(null, null)}
            />,
        ];

        return (
            <Dialog
                title={this.props.isEditModal ? 'Edit Payment Method' : 'Add Payment Method'}
                actions={actions}
                modal={false}
                autoScrollBodyContent={true}
                open={this.props.showAddEditModal}
                titleStyle={{
                    margin: "0px 0px",
                    padding: "10px",
                    fontSize: "18px",
                    fontWeight: 400,
                    borderBottom: '1px solid rgb(224, 224, 224)'
                }}
                contentStyle={{width: window.innerWidth > 992 ? '30%': '75%'}}
                bodyStyle={{width: '100%', padding: '0px 20px 20px 20px'}}
                actionsContainerStyle={{borderTop: '1px solid rgb(224, 224, 224)'}}
                onRequestClose={(e) => this.props._toggleAddEditModal(null, null)}
            >   
                {
                    !this.props.isEditModal &&
                    <TextField
                        name="title"
                        required
                        fullWidth
                        type='text'
                        {...inputStyles}
                        value={this.state.eCurrency.title}
                        floatingLabelText="Title"
                        onChange={this._handleInputChange}
                    />
                }

                <TextField
                    name="reserves"
                    required
                    fullWidth
                    type='text'
                    {...inputStyles}
                    value={this.state.eCurrency.reserves}
                    floatingLabelText="Reserves"
                    onChange={this._handleInputChange}
                />
                <Tabs>
                    <Tab label="Buy">
                        {
                            this.state.eCurrency.buyCommissions.map((buyCommission, index) => (
                                <div className="df jc-sb ai-c" style={{maxHeight: '350px'}}>
                                    <div className="df jc-fs ai-c" style={{fontSize: "14px", width: "100%", height: "72px", position: "relative", top: 20}}>{buyCommission.title}: </div>
                                    <TextField
                                        name="percentage"
                                        required
                                        fullWidth
                                        type='number'
                                        max={100}
                                        min={0}
                                        {...inputStyles}
                                        style={{marginLeft: "4px"}}
                                        value={buyCommission.percentage}
                                        floatingLabelText="Percentage"
                                        onChange={(e) => this._handleCommissionChange(e, 'buyCommissions', index, 'percentage')}
                                    />
                                    <TextField
                                        name="fixed"
                                        required
                                        fullWidth
                                        type='number'
                                        max={100}
                                        min={0}
                                        {...inputStyles}
                                        style={{marginLeft: "4px"}}
                                        value={buyCommission.fixed}
                                        floatingLabelText="Fixed"
                                        onChange={(e) => this._handleCommissionChange(e, 'buyCommissions', index, 'fixed')}
                                    />
                                </div>
                            ))
                        }

                        {
                            this.state.eCurrency.buyCommissions.length === 0 &&
                            <div style={{marginTop: 10}}>Nothing to display.</div>
                        }
                    </Tab>
                    <Tab label="Sell">
                        {
                            this.state.eCurrency.sellCommissions.map((sellCommission, index) => (
                                <div className="df jc-sb ai-c">
                                    <div className="df jc-fs ai-c" style={{fontSize: "14px", width: "100%", height: "72px", position: "relative", top: 20}}>{sellCommission.title}: </div>
                                    <TextField
                                        name="percentage"
                                        required
                                        fullWidth
                                        type='number'
                                        max={100}
                                        min={0}
                                        {...inputStyles}
                                        style={{marginLeft: "4px"}}
                                        value={sellCommission.percentage}
                                        floatingLabelText="Percentage"
                                        onChange={(e) => this._handleCommissionChange(e, 'sellCommissions', index, 'percentage')}
                                    />
                                    <TextField
                                        name="fixed"
                                        required
                                        fullWidth
                                        type='number'
                                        max={100}
                                        min={0}
                                        {...inputStyles}
                                        style={{marginLeft: "4px"}}
                                        value={sellCommission.fixed}
                                        floatingLabelText="Fixed"
                                        onChange={(e) => this._handleCommissionChange(e, 'sellCommissions', index, 'fixed')}
                                    />
                                </div>
                            ))
                        }

                        {
                            this.state.eCurrency.sellCommissions.length === 0 &&
                            <div style={{marginTop: 10}}>Nothing to display.</div>
                        }
                    </Tab>
                    <Tab label="Exchange">
                        {
                            this.state.eCurrency.exchangeCommissions.map((exchangeCommission, index) => (
                                <div className="df jc-sb ai-c">
                                    <div className="df jc-fs ai-c" style={{fontSize: "14px", width: "100%", height: "72px", position: "relative", top: 20}}>{exchangeCommission.title}: </div>
                                    <TextField
                                        name="percentage"
                                        required
                                        fullWidth
                                        type='number'
                                        max={100}
                                        min={0}
                                        {...inputStyles}
                                        style={{marginLeft: "4px"}}
                                        value={exchangeCommission.percentage}
                                        floatingLabelText="Percentage"
                                        onChange={(e) => this._handleCommissionChange(e, 'exchangeCommissions', index, 'percentage')}
                                    />
                                    <TextField
                                        name="fixed"
                                        required
                                        fullWidth
                                        type='number'
                                        max={100}
                                        min={0}
                                        {...inputStyles}
                                        style={{marginLeft: "4px"}}
                                        value={exchangeCommission.fixed}
                                        floatingLabelText="Fixed"
                                        onChange={(e) => this._handleCommissionChange(e, 'exchangeCommissions', index, 'fixed')}
                                    />
                                </div>
                            ))
                        }

                        {
                            this.state.eCurrency.exchangeCommissions.length === 0 &&
                            <div style={{marginTop: 10}}>Nothing to display.</div>
                        }
                    </Tab>
                </Tabs>
            </Dialog>
        );
    };
}

AddEditECurrency.propType = {
    _addeCurrency : PropTypes.func,
    _editeCurrency : PropTypes.func,
    showAddEditModal: PropTypes.bool,
    _toggleAddEditModal : PropTypes.func,
}