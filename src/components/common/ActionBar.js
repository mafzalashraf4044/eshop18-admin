import React, {
    Component
} from 'react';

//Helpers
import PropTypes from 'prop-types';

//Third Party Components
import RaisedButton from 'material-ui/RaisedButton';
import { Row, Col, InputGroup, FormControl } from 'react-bootstrap';

export default class ActionBar extends Component {

    render() {
        return (
            <Row className="row search-bar-row">
                <Col className="btns-container" xs={12} md={6}>
                  {
                    this.props.actionBarLeft && this.props.actionBarLeft
                  }
                </Col>
                <Col className="search-container" xs={12} md={6}>
                  <InputGroup className="has-feedback has-clear">
                    <FormControl 
                      type="text" 
                      placeholder={this.props.searchPlaceholder} 
                      className="search-input" 
                      value={this.props.searchTerm} 
                      onChange={this.props._handleSearchTermChange}
                    />
                    <a className="fa fa-times form-control-feedback form-control-clear" onTouchTap={this.props._clearFilteredData}></a>
                    <div className="input-group-btn">
                        <RaisedButton 
                            label="Search..." 
                            onTouchTap={this.props._handleSearchBtnClick} 
                            disabled={this.props.searchTerm ? false : true} 
                            buttonStyle={{borderRadius: '0px 2px 2px 0px'}} 
                            style={{boxShadow: 'none', border: '1px solid rgb(204, 204, 204)', borderRadius: '0px 2px 2px 0px'}} 
                          />
                    </div>
                  </InputGroup>
                </Col>
            </Row>
        );
    };
}

ActionBar.propTypes = {
  searchTerm              : PropTypes.string,
  _filterData             : PropTypes.func,
  _handleSearchTermChange : PropTypes.func,
  _clearFilteredData      : PropTypes.func,
  _toggleAddEditModal     : PropTypes.func,
}