import React, {
  Component
} from 'react';

import PropTypes from 'prop-types';

//React Router
import { Switch, Route } from 'react-router-dom';

//Third Party Components
import { Grid, Row, Col } from 'react-bootstrap';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

//Custom Components
import UsersPage from '../users/UsersPage';
import NewsPage from '../news/NewsPage';
import ReviewsPage from '../reviews/ReviewsPage';
import ConfigPage from '../config/ConfigPage';
import OrdersPage from '../orders/OrdersPage';
import ECurrenciesPage from '../eCurrencies/ECurrenciesPage';
import PaymentMethodsPage from '../paymentMethods/PaymentMethodsPage';
import SideNavbarWarpper from '../common/SideNavbarWarpper';

export default class AdminPage extends Component {
  constructor(props) {
      super(props);
      this.state = {
          openNavbar: false,
          width: window.innerWidth,
      };
  }

  handleNavbarToggle = () => this.setState({openNavbar: !this.state.openNavbar});

  componentDidMount = () => {
      this.updateWindowDimensions();
      window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount = () => {
      window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
      this.setState({ width: window.innerWidth });
  }

  render() {
      return (
          <MuiThemeProvider>
              <Grid className="main-container" fluid={true}>
                  <Row>
                      <Col className="side-navbar" xs={2}>
                          <SideNavbarWarpper docked={this.state.width < 992 ? false : true} openNavbar={this.state.openNavbar} handleNavbarToggle={this.handleNavbarToggle}/>
                      </Col>
                      <Col className="router-outlet" xs={12} md={10}>
                          <Row>
                              <Col xs={12}>
                                  <AppBar
                                      title="eBuyExchange"
                                      showMenuIconButton={this.state.width < 992}
                                      iconElementLeft={
                                          <IconButton onTouchTap={this.handleNavbarToggle}>
                                              <FontIcon className='fa fa-bars' /> 
                                          </IconButton>
                                      }
                                  />                                
                              </Col>
                          </Row>
                          <Row className="router-outlet-content">
                              <Col xs={12}>
                                  {/*Router Outlet/Container for Active Route*/}
                                  <Switch>
                                      <Route exact path='/users' component={UsersPage}/>
                                      <Route path='/orders' component={OrdersPage}/>
                                      <Route path='/ecurrencies' component={ECurrenciesPage}/>
                                      <Route path='/paymentmethods' component={PaymentMethodsPage}/>
                                      <Route path='/news' component={NewsPage}/>
                                      <Route path='/reviews' component={ReviewsPage}/>
                                      <Route path='/config' component={ConfigPage}/>
                                  </Switch>                                
                              </Col>
                          </Row>
                      </Col>
                  </Row>
              </Grid>                
          </MuiThemeProvider>
      );
  };
}