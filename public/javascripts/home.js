import React from 'react';

import  { Router,
    Route,
    IndexRoute,
    IndexLink,
    hashHistory,
    Link } from 'react-router';

import getBaseUrl from "./getBaseUrl";
import PicRow from "./home/picRow";

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pics: []
        };

        this.getPicsCB = this.getPicsCB.bind(this);
        this.onLikePicClick = this.onLikePicClick.bind(this);
        this.onLikePicClickCB = this.onLikePicClickCB.bind(this);
        this.picsURL = getBaseUrl() + "svc/allPics";
        this.likeURL = getBaseUrl() + "svc/likePic";

        this.getPics();

    }

    getPics(){
        this.httpRequest = new XMLHttpRequest();
        this.httpRequest.onreadystatechange = this.getPicsCB;
        this.httpRequest.open("GET", this.picsURL);
        this.httpRequest.send();
    }

    getPicsCB(){
        try {
            if (this.httpRequest.readyState === XMLHttpRequest.DONE) {
                if (this.httpRequest.status === 200) {
                    let resp = JSON.parse(this.httpRequest.responseText);

                    if(resp.message == "") {
                        this.setState({pics: resp.pics});
                    }else{
                        bootbox.alert(resp.message);
                    }
                }else {
                    bootbox.alert("Get Pics Request Failed -- Response Code = " + this.httpRequest.status);
                }
            }
        }
        catch (e) {
            bootbox.alert("Caught Exception: " + e.message);
        }
    }

    onLikePicClick(e){
        this.httpRequest = new XMLHttpRequest();
        this.httpRequest.onreadystatechange = this.onLikePicClickCB;
        this.httpRequest.open("POST", this.likeURL);
        this.httpRequest.setRequestHeader("Content-Type", "application/json");
        let getReq = {
            userId: this.state.pics[e.target.value].userId,
            picUrl: this.state.pics[e.target.value].url,
            picNum: e.target.value
        };
        this.httpRequest.send(JSON.stringify(getReq));
    }

    onLikePicClickCB(){
        try {
            if (this.httpRequest.readyState === XMLHttpRequest.DONE) {
                if (this.httpRequest.status === 200) {
                    let resp = JSON.parse(this.httpRequest.responseText);

                    if(resp.message == "") {

                        let pics = this.state.pics;
                        pics[resp.picNum].likes = resp.likes;
                        this.setState(
                            {
                                pics: pics,
                            });
                    }else{
                        bootbox.alert(resp.message);
                    }
                }else {
                    bootbox.alert("Like Pic Request Failed -- Response Code = " + this.httpRequest.status);
                }
            }
        }
        catch (e) {
            bootbox.alert("Caught Exception: " + e.message);
        }
    }

    render(){
        let rows = [];

        for(let i = 0, key = 0; i < this.state.pics.length; i += 3, key++)
            rows.push( <PicRow pics={this.state.pics} i={i} key={key}
                               onLikeclick={this.onLikePicClick}/>);

        return (<div className="container">
                {rows}
            </div>
        )

    }
}