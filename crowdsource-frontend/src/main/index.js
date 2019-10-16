import React from 'react';
import ReactDOM from 'react-dom';
import {Helmet} from "react-helmet";
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import ImprintView from './pages/ImprintView/ImprintView.js';
import PrivacyView from './pages/PrivacyView/PrivacyView.js';
import AboutView from './pages/AboutView/AboutView.js';
import HelpView from './pages/HelpView/HelpView';


// Services
import RoutingService from "./util/RoutingService";
import UnauthorizedInterceptor from "./util/UnauthorizedInterceptor";
import AuthService from "./util/AuthService";

// Layout & Design
import Layout from "./layout/Layout";
import './scss/crowdsource.scss';
import "react-datepicker/dist/react-datepicker.css";
import './index.html';

// Pages
import IntroPage from "./pages/IntroPage/IntroPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import LogoutPage from "./pages/LogoutPage/LogoutPage";
import IdeasListPage from "./pages/IdeasListPage/IdeasListPage";
import {I18nProvider} from "@lingui/react";
import {I18nContextConsumer, I18nContextProvider} from "./contexts/I18nContext";
import DebugView from "./pages/DebugView/DebugView";
import StatisticsPage from "./pages/StatisticsPage/StatisticsPage";

UnauthorizedInterceptor.init();
AuthService.reloadUser();

ReactDOM.render((
  <I18nContextProvider>
    <I18nContextConsumer>
      {({language, catalogs, i18n}) => (
        <I18nProvider language={language} catalogs={catalogs}>
          <BrowserRouter history={RoutingService.getHistory()}>
            <Layout>
              <Helmet defaultTitle="Crowdsource" titleTemplate="Crowdsource - %s"/>
              <Switch>
                <Route exact path='/intro' component={IntroPage}/>
                <Route exact path='/ideas/:ideasId' component={IdeasListPage}/>
                {/*<Route exact path='/ideas/:ideasId/own' component={IdeasOwnController}/>*/}
                {/*<Route exact path='/ideas/:ideasId/admin' component={IdeasAdminController}/>*/}
                {/*<Route exact path='/projects' component={ProjectListController}/>*/}
                {/*<Route exact path='/project/new' component={ProjectFormController}/>*/}
                {/*<Route exact path='/project/new/:projectId' component={ProjectFormSuccessController}/>*/}
                {/*<Route exact path='/project/:projectId' component={ProjectDetailsController}/>*/}
                {/*<Route exact path='/project/:projectId/edit' component={ProjectFormController}/>*/}
                <Route exact path='/login' component={LoginPage}/>
                <Route exact path='/user-logout' component={LogoutPage}/>
                <Route exact path='/signup' component={SignupPage}/>
                {/*<Route exact path='/signup/:email/:firstName/:lastName/success' component={UserSignupSuccessController}/>*/}
                {/*<Route exact path='/signup/:email/activation/:activationToken' component={UserActivationController}/>*/}
                {/*<Route exact path='/login/password-recovery' component={PasswordRecoveryController}/>*/}
                {/*<Route exact path='/login/password-recovery/:email/success' component={PasswordRecoverySuccessController}/>*/}
                {/*<Route exact path='/login/password-recovery/:email/activation/:activationToken' component={UserActivationController}/>*/}
                {/*<Route exact path='/financingrounds' component={FinancingRoundsController}/>*/}
                <Route exact path='/statistics' component={StatisticsPage}/>
                <Route exact path='/about' component={AboutView}/>
                <Route exact path='/help' component={HelpView}/>
                <Route exact path='/imprint' component={ImprintView}/>
                <Route exact path='/privacy' component={PrivacyView}/>
                {/*<Route exact path='/error/notfound' component={NotFoundView}/>*/}
                {/*<Route exact path='/error/forbidden' component={ForbiddenView}/>*/}
                {/*<Route exact path='/error/unknown' component={UnknownView}/>*/}
                <Route exact path='/debug' component={DebugView}/>
                <Route component={IntroPage}/>
              </Switch>
            </Layout>
          </BrowserRouter>
        </I18nProvider>
      )}
    </I18nContextConsumer>
  </I18nContextProvider>

), document.getElementById('root'));

