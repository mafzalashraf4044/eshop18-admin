import React, {
  Component
} from 'react';

//Helpers
import _ from 'lodash';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

//constants
import { NEWS_PAGE } from '../../constants';

//React-Redux
import { connect } from 'react-redux';
import * as newsActions from '../../actions/newsActions';

//Third Party Components
import Paper from 'material-ui/Paper';
import { Grid, Row, Col } from 'react-bootstrap';
import RaisedButton from 'material-ui/RaisedButton';

//Custom Components
import DataTable from '../common/DataTable';
import ActionBar from '../common/ActionBar';
import AddEditNewsModal from './AddEditNewsModal';
import ConfirmDltPopup from '../common/ConfirmDltPopup';

class NewsPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      headers: {
        id: "ID",
        title: "Title",
        content: "Content",
      },
      searchTerm: '',
      selectedNews: null, //for dlt/edit
      showDltModal: false,
      showAddEditModal: false,
      isEditModal: false,
    };
  }

  componentDidMount = () => {
    if (this.props.news.length === 0){
      this._getNews();
    }
  }

  componentWillUnmount() {
    if (this.state.searchTerm) {
      this.setState({
        searchTerm: '',
      }, () => {
        this._getNews();
      });
    }
  }

  _handleSearchTermChange = (event) => {
    this.setState({
      searchTerm: event.target.value,
    });
  }
  
  _handleSearchBtnClick = () => {
    this._getNews();
  }

  _getNews = () => {
    this.props.getNews(this.state.searchTerm).then((res) => {
      if (res.status === 200) {
        this.props.saveNews(res.data.news);
      }
    }).catch((err) => {
      throw new Error(err);
    });
  }

  _clearFilteredData = () => {
    this.setState({
      searchTerm: '',
    }, () => {
      this._getNews();
    });
  }

  _toggleDltModal = (selectedNews) => {
    this.setState(prevState => ({
      selectedNews,
      showDltModal: prevState.showDltModal ? false : true,
    }));
  }

  _dltSelectedNews = () => {
    this.props.dltNews(this.state.selectedNews.id).then((res) => {
      if (res.status === 200) {
        const index = _.findIndex(this.props.news, (news) => (news.id === this.state.selectedNews.id));

        this.props.saveNews(update(this.props.news, {$splice: [[index, 1]]}));
        this.setState(prevState => ({
          showDltModal: false,
          selectedNews: null,
        }));
      }
    }).catch((err) => {
      throw new Error(err);
    });
  }

  _toggleAddEditModal = (selectedNews = null) => {
    this.setState((prevState, props) => ({
      showAddEditModal: prevState.showAddEditModal ? false : true,
      selectedNews,
      isEditModal: selectedNews ? true : false,
    }));
  }

  _addNews = (news) => {
    this.props.addNews(news).then((res) => {
      if (res.status === 200) {
        this.props.saveNews(update(this.props.news, {$unshift: [res.data.news]}));
        this.setState(prevState => ({
          showAddEditModal: false,
        }));
      }
    }).catch((err) => {
      throw new Error(err);
    });
  }

  _editNews = (news) => {
    this.props.editNews(this.state.selectedNews.id, news).then((res) => {
      if (res.status === 200) {
        const index = _.findIndex(this.props.news, (_news) => _news.id === this.state.selectedNews.id);

        this.props.saveNews(update(this.props.news, {$splice: [[index, 1, res.data.news]]}));
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
        label="Add News"
        onTouchTap={() => this._toggleAddEditModal()} 
      />
    );

    return (
      <div className="news-page">
        <Grid className="data-table-container" fluid={true}>
          <Row>
            <Col xs={12}>
              <Paper zDepth={1}>
                <ActionBar
                  actionBarLeft={actionBarLeft}
                  searchPlaceholder="ID, Title, Content"
                  searchTerm={this.state.searchTerm}
                  _handleSearchTermChange={this._handleSearchTermChange}
                  _clearFilteredData={this._clearFilteredData}
                  _handleSearchBtnClick={this._handleSearchBtnClick}
                />

                <DataTable
                  parent={NEWS_PAGE}
                  headers={this.state.headers} 
                  data={this.props.news}
                  _toggleAddEditModal={this._toggleAddEditModal}
                  _toggleDltModal={this._toggleDltModal}
                />
              </Paper>
            </Col>
          </Row>

          <AddEditNewsModal
            _addNews={this._addNews}
            _editNews={this._editNews}
            isEditModal={this.state.isEditModal}
            selectedNews={this.state.selectedNews}
            showAddEditModal={this.state.showAddEditModal}
            _toggleAddEditModal={this._toggleAddEditModal}
          />

          <ConfirmDltPopup
            type='News'
            showDltModal={this.state.showDltModal}
            _toggleDltModal={this._toggleDltModal}
            _dltSelected={this._dltSelectedNews}
          />
        
        </Grid>        
      </div>
    );
  }
}

NewsPage.propTypes = {
  news                       : PropTypes.array.isRequired,
  getNews                    : PropTypes.func.isRequired,
  addNews                    : PropTypes.func.isRequired,
  editNews                   : PropTypes.func.isRequired,
  dltNews                    : PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  news: state.newsReducer.news,
});

const mapDispatchToProps = (dispatch) => {
  return {
    saveNews: news => dispatch(newsActions.saveNews(news)),
    addNews: id => dispatch(newsActions.addNews(id)),
    editNews: (id, news) => dispatch(newsActions.editNews(id, news)),
    dltNews: id => dispatch(newsActions.dltNews(id)),
    getNews: (searchTerm) => dispatch(newsActions.getNews(searchTerm)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewsPage);