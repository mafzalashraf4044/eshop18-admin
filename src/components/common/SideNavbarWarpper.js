import React, {
    Component
} from 'react';

//Helpers
import PropTypes from 'prop-types';

//React Router
import { Link, withRouter } from 'react-router-dom';

//Third Party Components
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import {List, ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';

//React-Redux
import { connect } from 'react-redux';
import * as loginActions from '../../actions/loginActions';

class SideNavbarWarpper extends Component {

    constructor(props){
        super(props);
        this.state = {
            dropdownMenuOpen: false,
        }
    }

    handleDropdownMenuToggle = () => {
        this.setState({dropdownMenuOpen: !this.state.dropdownMenuOpen});
    }

    logout = () => {
        this.props.logout().then((res) => {
            if (res.status === 200) {
              localStorage.removeItem("token");
              window.location = '/admin/login';
            }
        }).catch((err) => {
            throw new Error(err);
        });
    }

    render(){
        return (
            <Drawer docked={this.props.docked} { ...( !this.props.docked && { open: this.props.openNavbar } ) }>
            {/*Applying Conditional Attribute to Drawer Component*/}
                <div className="nav-header">
                    <h3><FontIcon className='fa fa-user-plus' /> Admin</h3>
                    { 
                        !this.props.docked && 
                        <IconButton onTouchTap={this.props.handleNavbarToggle}>
                            <FontIcon className='fa fa-remove' />
                        </IconButton> 
                    }
                </div>

                <Divider />
                <List className="nav-items">
                    <ListItem 
                        primaryText="Users" 
                        className="navbar-item" 
                        containerElement={<Link to="/users"/>}
                        leftIcon={<FontIcon className='fa fa-user' style={{fontSize: '20px'}} />} 
                    />
                    <ListItem 
                        primaryText="Orders" 
                        className="navbar-item" 
                        containerElement={<Link to="/orders"/>}
                        leftIcon={<FontIcon className='fa fa-shopping-bag' style={{fontSize: '20px'}} />} 
                    />
                    <ListItem 
                        primaryText="ECurrencies" 
                        className="navbar-item" 
                        containerElement={<Link to="/ecurrencies"/>}
                        leftIcon={<FontIcon className='fa fa-money' style={{fontSize: '20px'}} />} 
                    />
                    <ListItem 
                        primaryText="Payment Methods" 
                        className="navbar-item" 
                        containerElement={<Link to="/paymentmethods"/>}
                        leftIcon={<FontIcon className='fa fa-university' style={{fontSize: '20px'}} />} 
                    />
                    <ListItem 
                        primaryText="News" 
                        className="navbar-item" 
                        containerElement={<Link to="/news"/>}
                        leftIcon={<FontIcon className='fa fa-newspaper-o' style={{fontSize: '20px'}} />} 
                    />
                    <ListItem 
                        primaryText="Reviews" 
                        className="navbar-item" 
                        containerElement={<Link to="/reviews"/>}
                        leftIcon={<FontIcon className='fa fa-comments' style={{fontSize: '20px'}} />} 
                    />
                    <ListItem 
                        primaryText="Config" 
                        className="navbar-item" 
                        containerElement={<Link to="/config"/>}
                        leftIcon={<FontIcon className='fa fa-cog' style={{fontSize: '20px'}} />} 
                    />
                    <ListItem 
                        primaryText="Logout" 
                        onClick={this.logout} 
                        className="navbar-item"
                        containerElement={<div />}
                        leftIcon={<FontIcon className='fa fa-sign-out' style={{fontSize: '20px'}} />} 
                    />
                </List>
            </Drawer>            
        );
    }
}

SideNavbarWarpper.propTypes = {
    logout : PropTypes.func.isRequired,
    docked: PropTypes.bool.isRequired,
    openNavbar: PropTypes.bool,
    handleNavbarToggle: PropTypes.func,
};
  
const mapStateToProps = (state, ownProps) => ({});

const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(loginActions.logout()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SideNavbarWarpper));
