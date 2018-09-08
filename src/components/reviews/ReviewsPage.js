import React, {
  Component
} from 'react';

//Helpers
import _ from 'lodash';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

//constants
import { REVIEWS_PAGE } from '../../constants';

//React-Redux
import { connect } from 'react-redux';
import * as reviewActions from '../../actions/reviewActions';

//Third Party Components
import Paper from 'material-ui/Paper';
import { Grid, Row, Col } from 'react-bootstrap';
import RaisedButton from 'material-ui/RaisedButton';

//Custom Components
import DataTable from '../common/DataTable';
import ActionBar from '../common/ActionBar';
import AddEditReviewModal from './AddEditReviewModal';
import ConfirmDltPopup from '../common/ConfirmDltPopup';

class ReviewsPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      headers: {
        id: "ID",
        title: "Title",
        content: "Content",
      },
      searchTerm: '',
      selectedReview: null, //for dlt/edit
      showDltModal: false,
      showAddEditModal: false,
      isEditModal: false,
    };
  }

  componentDidMount = () => {
    if (this.props.reviews.length === 0){
      this._getReviews();
    }
  }

  componentWillUnmount() {
    if (this.state.searchTerm) {
      this.setState({
        searchTerm: '',
      }, () => {
        this._getReviews();
      });
    }
  }

  _handleSearchTermChange = (event) => {
    this.setState({
      searchTerm: event.target.value,
    });
  }
  
  _handleSearchBtnClick = () => {
    this._getReviews();
  }

  _getReviews = () => {
    this.props.getReviews(this.state.searchTerm).then((res) => {
      if (res.status === 200) {
        this.props.saveReviews(res.data.reviews);
      }
    }).catch((err) => {
      throw new Error(err);
    });
  }

  _clearFilteredData = () => {
    this.setState({
      searchTerm: '',
    }, () => {
      this._getReviews();
    });
  }

  _toggleDltModal = (selectedReview) => {
    this.setState(prevState => ({
      selectedReview,
      showDltModal: prevState.showDltModal ? false : true,
    }));
  }

  _dltSelectedReview = () => {
    this.props.dltReview(this.state.selectedReview.id).then((res) => {
      if (res.status === 200) {
        const index = _.findIndex(this.state.reviews, (review) => (review.id === this.state.selectedReview.id));

        this.props.saveReviews(update(this.props.reviews, {$splice: [[index, 1]]}));
        this.setState(prevState => ({
          showDltModal: false,
          selectedReview: null,
        }));
      }
    }).catch((err) => {
      throw new Error(err);
    });
  }

  _toggleAddEditModal = (selectedReview = null) => {
    this.setState((prevState, props) => ({
      showAddEditModal: prevState.showAddEditModal ? false : true,
      selectedReview,
      isEditModal: selectedReview ? true : false,
    }));
  }

  _addReview = (review) => {
    this.props.addReview(review).then((res) => {
      if (res.status === 200) {
        this.props.saveReviews(update(this.props.reviews, {$push: [res.data.review]}));
        this.setState(prevState => ({
          showAddEditModal: false,
        }));
      }
    }).catch((err) => {
      throw new Error(err);
    });
  }

  _editReview = (review) => {
    this.props.editReview(this.state.selectedReview.id, review).then((res) => {
      if (res.status === 200) {
        const index = _.findIndex(this.props.reviews, (_review) => _review.id === this.state.selectedReview.id);

        this.props.saveReviews(update(this.props.reviews, {$splice: [[index, 1, res.data.review]]}));
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
        label="Add Review"
        onTouchTap={() => this._toggleAddEditModal()} 
      />
    );

    return (
      <div className="reviews-page">
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
                  parent={REVIEWS_PAGE}
                  headers={this.state.headers} 
                  data={this.props.reviews}
                  _toggleAddEditModal={this._toggleAddEditModal}
                  _toggleDltModal={this._toggleDltModal}
                />
              </Paper>
            </Col>
          </Row>

          <AddEditReviewModal
            _addReview={this._addReview}
            _editReview={this._editReview}
            isEditModal={this.state.isEditModal}
            selectedReview={this.state.selectedReview}
            showAddEditModal={this.state.showAddEditModal}
            _toggleAddEditModal={this._toggleAddEditModal}
          />

          <ConfirmDltPopup
            type='Reviews'
            showDltModal={this.state.showDltModal}
            _toggleDltModal={this._toggleDltModal}
            _dltSelected={this._dltSelectedReview}
          />
        
        </Grid>        
      </div>
    );
  }
}

ReviewsPage.propTypes = {
  reviews                       : PropTypes.array.isRequired,
  getReviews                    : PropTypes.func.isRequired,
  addReview                    : PropTypes.func.isRequired,
  editReview                   : PropTypes.func.isRequired,
  dltReview                    : PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  reviews: state.reviewReducer.reviews,
});

const mapDispatchToProps = (dispatch) => {
  return {
    saveReviews: reviews => dispatch(reviewActions.saveReviews(reviews)),
    addReview: review => dispatch(reviewActions.addReview(review)),
    editReview: (id, review) => dispatch(reviewActions.editReview(id, review)),
    dltReview: id => dispatch(reviewActions.dltReview(id)),
    getReviews: (searchTerm) => dispatch(reviewActions.getReviews(searchTerm)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ReviewsPage);