import React, {
    Component
} from 'react';

//Helpers
import PropTypes from 'prop-types';
import update from 'immutability-helper';

//Third Party Components
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

export default class AddEditReviewModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            review: {title: '', content: ''},
        };
        
    }
    
    shouldComponentUpdate = (nextProps, nextState) => {
        return (this.state !== nextState ||
            this.props.isEditModal !== nextProps.isEditModal || 
            this.props.showAddEditModal !== nextProps.showAddEditModal ||
            (this.props.selectedReview !== nextProps.selectedReview && nextProps.showAddEditModal)
            //If selected user is changed and AddEditModal is Open, selectedReview value can also be changed in case of confirmDltModal
        );

    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            review: nextProps.selectedReview ? {title: nextProps.selectedReview.title, content: nextProps.selectedReview.content} : {title: '', content: ''},
        });            
    }

    _handleInputChange = (event) => {
        let target = event.target;
        this.setState((prevState, props) => ({
            review: update(prevState.review, {$merge: {[target.name]: target.value}}),
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
                        this.props._editReview(this.state.review)
                    }else{
                        this.props._addReview(this.state.review)
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
                title={this.props.isEditModal ? 'Edit Review' : 'Add Review'}
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
                <TextField
                    name="title"
                    required
                    fullWidth
                    {...inputStyles}
                    value={this.state.review.title}
                    floatingLabelText="Title"
                    onChange={this._handleInputChange}
                />    
                <TextField
                    name="content"
                    required
                    multiLine
                    fullWidth
                    {...inputStyles}
                    value={this.state.review.content}
                    floatingLabelText="Content"
                    onChange={this._handleInputChange}
                />
            </Dialog>
        );
    };
}

AddEditReviewModal.propType = {
    _addReview : PropTypes.func,
    _editReview : PropTypes.func,
    showAddEditModal: PropTypes.bool,
    _toggleAddEditModal : PropTypes.func,
}