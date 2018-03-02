import React from 'react';

import  { Router,
    Route,
    IndexRoute,
    IndexLink,
    hashHistory,
    Link } from 'react-router';

import getBaseUrl from "./getBaseUrl";
import CenterCol from "./myPics/centerCol";
import PicRow from "./myPics/picRow";

export default class MyPics extends React.Component {
    constructor(props) {
        super(props);

        if(!sessionStorage.getItem("loggedIn"))
            this.props.router.push('/Login');

        this.state = {
            pics: [],
            addPicURL: "",
            addPicDesc: ""
        };

        this.getPicsCB = this.getPicsCB.bind(this);
        this.onAddClick = this.onAddClick.bind(this);
        this.onAddClickCB = this.onAddClickCB.bind(this);
        this.onAddFormChange = this.onAddFormChange.bind(this);
        this.onDeletePicClick = this.onDeletePicClick.bind(this);
        this.onDeletePicClickCB = this.onDeletePicClickCB.bind(this);

        this.picsURL = getBaseUrl() + "svc/pics";
        this.deletePicURL = getBaseUrl() + "svc/deletePic";

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

    onAddClick(){
        this.httpRequest = new XMLHttpRequest();
        this.httpRequest.onreadystatechange = this.onAddClickCB;
        this.httpRequest.open("POST", this.picsURL);
        this.httpRequest.setRequestHeader("Content-Type", "application/json");
        let getReq = {
            addPicURL: this.state.addPicURL,
            addPicDesc: this.state.addPicDesc
        };
        this.httpRequest.send(JSON.stringify(getReq));
    }

    onAddClickCB(){
        try {
            if (this.httpRequest.readyState === XMLHttpRequest.DONE) {
                if (this.httpRequest.status === 200) {
                    let resp = JSON.parse(this.httpRequest.responseText);

                    if(resp.message == "") {

                        let pics = this.state.pics;
                        pics.push(resp.pic);
                        this.setState(
                            {
                                pics: pics,
                                addPicURL: "",
                                addPicDesc: ""
                            });
                    }else{
                        bootbox.alert(resp.message);
                    }
                }else {
                    bootbox.alert("Add Pic Request Failed -- Response Code = " + this.httpRequest.status);
                }
            }
        }
        catch (e) {
            bootbox.alert("Caught Exception: " + e.message);
        }
    }

    onAddFormChange(e){
        let ste = this.state;
        ste[e.target.id] = e.target.value;
        this.setState(ste);
    }

    onDeletePicClick(e){
        this.httpRequest = new XMLHttpRequest();
        this.httpRequest.onreadystatechange = this.onDeletePicClickCB;
        this.httpRequest.open("POST", this.deletePicURL);
        this.httpRequest.setRequestHeader("Content-Type", "application/json");
        let deleteReq = {picNum: e.target.value};
        this.httpRequest.send(JSON.stringify(deleteReq));
    }

    onDeletePicClickCB() {
        try {
            if (this.httpRequest.readyState === XMLHttpRequest.DONE) {
                if (this.httpRequest.status === 200) {
                    let resp = JSON.parse(this.httpRequest.responseText);

                    if (resp.message == "") {
                        let pics = this.state.pics;
                        let newPics = [];

                        for (let i = 0; i < pics.length; i++) {
                            if (i != resp.picNum)
                                newPics.push(pics[i]);
                        }
                        bootbox.alert("Picture deleted from your collection");
                        this.setState({pics: newPics});
                    } else {
                        bootbox.alert(resp.message);
                    }
                } else {
                    bootbox.alert("Delete Picture Request Failed -- Response Code = " + this.httpRequest.status);
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
                                onDeleteclick={this.onDeletePicClick}/>);

        return (<div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <CenterCol addPicURL={this.state.addPicURL}
                                   addPicDesc={this.state.addPicDesc}
                                   onAddClick={this.onAddClick}
                                   onFormChange={this.onAddFormChange}
                                   onDeletePicClick={this.onDeletePicClick}
                        />
                    </div>
                </div>
                {rows}
            </div>
        )

    }
}