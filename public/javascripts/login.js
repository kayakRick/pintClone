"use strict";

import React from 'react';

import {
    Router,
    Route,
    IndexRoute,
    IndexLink,
    hashHistory,
    Link
} from 'react-router';


export default class Login extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div>
                <h1>Login using...</h1>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-2">
                            <a className="google-btn" href="/auth/google">Google+</a>
                        </div>
                        <div className="col-md-2">
                            <a className="google-btn" href="/auth/twitter">Twitter</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

 }