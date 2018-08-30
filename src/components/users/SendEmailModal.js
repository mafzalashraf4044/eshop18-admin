import React, {
    Component
} from 'react';

//Helpers
import PropTypes from 'prop-types';

//Third Party Components
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

export default class SendEmailModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subject: '',
            content: '',
        };
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return (this.state !== nextState ||
                this.props.showSendEmailModal !== nextProps.showSendEmailModal ||
                (this.props.selectedUsers !== nextProps.selectedUsers && nextProps.showSendEmailModal) //If selected user is changed and AddEditModal is Open
        );
    }

    componentWillReceiveProps = (props) => {
        this.setState({
            subject: '',
            content: '',
        });            
    }

    _handleInputChange = (event) => {
        let target = event.target;
        this.setState({[target.name]: target.value});
    }

    render() {
        const inputStyles = {
            inputStyle:{fontSize: "12px"},
            floatingLabelStyle:{fontSize: "12px"}
        };

        const actions = [
            <FlatButton
                primary
                label='Send'
                onTouchTap={e => this.props._sendEmail(this.state.subject, this.state.content)}
            />,
            <FlatButton
                label="Close"
                primary={true}
                onTouchTap={(e) => this.props._toggleSendEmailModal(null, null)}
            />,
        ];

        return (
            <Dialog
                title='Send Email'
                actions={actions}
                modal={false}
                autoScrollBodyContent={true}
                open={this.props.showSendEmailModal}
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
                onRequestClose={(e) => this.props._toggleSendEmailModal(null, null)}
            >
                <TextField
                    name="subject"
                    required
                    fullWidth
                    {...inputStyles}
                    value={this.state.subject}
                    floatingLabelText="Subject"
                    onChange={this._handleInputChange}
                />    
                <TextField
                    name="content"
                    required
                    multiLine
                    fullWidth
                    {...inputStyles}
                    value={this.state.content}
                    floatingLabelText="Content"
                    onChange={this._handleInputChange}
                />
            </Dialog>
        );
    };
}

SendEmailModal.propType = {
    _sendEmail : PropTypes.func,
    showSendEmailModal: PropTypes.bool,
    _toggleSendEmailModal : PropTypes.func,
}