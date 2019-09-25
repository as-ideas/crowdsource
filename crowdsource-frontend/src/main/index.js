import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import ImprintView from './pages/ImprintView/ImprintView.js';
import PrivacyView from './pages/PrivacyView/PrivacyView.js';
import AboutView from './pages/AboutView/AboutView.js';

// Services
import RoutingService from "./resources/util/RoutingService";
import UnauthorizedInterceptor from "./resources/util/UnauthorizedInterceptor";

// Layout & Design
import './scss/crowdsource.scss';
import './index.html';

// Pages
import IntroPage from "./pages/IntroPage/IntroPage";
import Layout from "./resources/layout/Layout";

UnauthorizedInterceptor.init();

ReactDOM.render((
    <BrowserRouter history={ RoutingService.getHistory() }>
        <Layout>
            <Switch>
                <Route exact path='/intro' component={IntroPage}/>
                {/*<Route exact path='/ideas/:ideasId' component={IdeasListController}/>*/}
                {/*<Route exact path='/ideas/:ideasId/own' component={IdeasOwnController}/>*/}
                {/*<Route exact path='/ideas/:ideasId/admin' component={IdeasAdminController}/>*/}
                {/*<Route exact path='/projects' component={ProjectListController}/>*/}
                {/*<Route exact path='/project/new' component={ProjectFormController}/>*/}
                {/*<Route exact path='/project/new/:projectId' component={ProjectFormSuccessController}/>*/}
                {/*<Route exact path='/project/:projectId' component={ProjectDetailsController}/>*/}
                {/*<Route exact path='/project/:projectId/edit' component={ProjectFormController}/>*/}
                {/*<Route exact path='/login' component={UserLoginController}/>*/}
                {/*<Route exact path='/signup' component={UserSignupController}/>*/}
                {/*<Route exact path='/signup/:email/:firstName/:lastName/success' component={UserSignupSuccessController}/>*/}
                {/*<Route exact path='/signup/:email/activation/:activationToken' component={UserActivationController}/>*/}
                {/*<Route exact path='/login/password-recovery' component={PasswordRecoveryController}/>*/}
                {/*<Route exact path='/login/password-recovery/:email/success' component={PasswordRecoverySuccessController}/>*/}
                {/*<Route exact path='/login/password-recovery/:email/activation/:activationToken' component={UserActivationController}/>*/}
                {/*<Route exact path='/financingrounds' component={FinancingRoundsController}/>*/}
                {/*<Route exact path='/statistics' component={StatisticsController}/>*/}
                <Route exact path='/about' component={AboutView} />
                {/*<Route exact path='/help' component={HelpView}/>*/}
                <Route exact path='/imprint' component={ImprintView}/>
                <Route exact path='/privacy' component={PrivacyView}/>
                {/*<Route exact path='/logout' component={UserLogoutController}/>*/}
                {/*<Route exact path='/error/notfound' component={NotFoundView}/>*/}
                {/*<Route exact path='/error/forbidden' component={ForbiddenView}/>*/}
                {/*<Route exact path='/error/unknown' component={UnknownView}/>*/}
                <Route component={IntroPage}/>
            </Switch>
        </Layout>
    </BrowserRouter>
), document.getElementById('root'));

