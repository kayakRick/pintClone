/********************************************************************************************************
 * This is the main container for the pintClone app.
 * The App class serves as the parent container for the menu bar and the main part of the page. Most
 * menu bar selections are handled by various child components via the react router but "about" is handled
 * directly.
 ********************************************************************************************************/

"use strict";

import React from 'react';
import ReactDOM from 'react-dom';

import  { Router,
    Route,
    IndexRoute,
    IndexLink,
    hashHistory,
    Link } from 'react-router';

import MenuBar from './MenuBar';
import Home from './home';
import MyPics from './myPics';
import Login from './login';

import getBaseUrl from "./getBaseUrl";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.onAboutClick = this.onAboutClick.bind(this);
        this.onLogOffClick = this.onLogOffClick.bind(this);
        this.loginStatusURL = getBaseUrl() + "auth/loginStatus";
        this.loginStatusCb = this.loginStatusCb.bind(this);
        this.httpRequest;
        this.getLoginStatus();
    }

    getLoginStatus(){
        this.httpRequest = new XMLHttpRequest();
        this.httpRequest.onreadystatechange = this.loginStatusCb;
        this.httpRequest.open("GET", this.loginStatusURL);
        this.httpRequest.send();
    }

    loginStatusCb() {
        try {
            if (this.httpRequest.readyState === XMLHttpRequest.DONE) {
                if (this.httpRequest.status === 200) {
                    let resp = JSON.parse(this.httpRequest.responseText);
                    console.log(resp)

                   if(resp.status == "logged in"){
                       sessionStorage.setItem('loggedIn', true);
                       sessionStorage.setItem('userId', resp.userId);
                       sessionStorage.setItem('userName', resp.userName);
                   }else{
                       console.log("not logged in")
                       sessionStorage.removeItem('loggedIn');
                       sessionStorage.removeItem('userId');
                       sessionStorage.removeItem('userName');
                   }

                   this.setState({status: resp.status});
                }else {
                    bootbox.alert("LoginStatus Request Failed -- Response Code = " + this.httpRequest.status);
                }
            }
        }
        catch (e) {
            bootbox.alert("Caught Exception: " + e.message);
        }
    }

    onAboutClick(){
        bootbox.alert('Written by Rick Evans<br>Code is available ' + '' +
            '<a href="https://github.com/kayakRick/pintClone" target="_blank">Here</a>');
    }

    onLogOffClick(){
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("loginName");
        this.props.router.push('/');
    }


    render() {
        return(<div>
            <MenuBar onAboutClick={this.onAboutClick} onLogOffClick={this.onLogOffClick}/>
            {this.props.children}
        </div>);
    }
}

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Home}/>
            <Route path="MyPics" component={MyPics}/>
            <Route path="Login" component={Login}/>
        </Route>
    </Router>,
    document.getElementById("app"));
