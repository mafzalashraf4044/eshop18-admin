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

export default class AddEditNewsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            news: {title: '', content: ''},
        };
        
    }
    
    shouldComponentUpdate = (nextProps, nextState) => {
        return (this.state !== nextState ||
            this.props.isEditModal !== nextProps.isEditModal || 
            this.props.showAddEditModal !== nextProps.showAddEditModal ||
            (this.props.selectedNews !== nextProps.selectedNews && nextProps.showAddEditModal)
            //If selected user is changed and AddEditModal is Open, selectedNews value can also be changed in case of confirmDltModal
        );

    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            news: nextProps.selectedNews ? {title: nextProps.selectedNews.title, content: nextProps.selectedNews.content} : {title: '', content: ''},
        });            
    }

    _handleInputChange = (event) => {
        let target = event.target;
        this.setState((prevState, props) => ({
            news: update(prevState.news, {$merge: {[target.name]: target.value}}),
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
                        this.props._editNews(this.state.news)
                    }else{
                        this.props._addNews(this.state.news)
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
            title={this.props.isEditModal ? 'Edit News' : 'Add News'}
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
                    value={this.state.news.title}
                    floatingLabelText="Title"
                    onChange={this._handleInputChange}
                />    
                <TextField
                    name="content"
                    required
                    multiLine
                    fullWidth
                    {...inputStyles}
                    value={this.state.news.content}
                    floatingLabelText="Content"
                    onChange={this._handleInputChange}
                />
            </Dialog>
        );
    };
}

AddEditNewsModal.propType = {
    _addNews : PropTypes.func,
    _editNews : PropTypes.func,
    showAddEditModal: PropTypes.bool,
    _toggleAddEditModal : PropTypes.func,
}