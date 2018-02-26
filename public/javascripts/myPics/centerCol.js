"use strict";

import React from 'react';

class DisplayPic extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let id = this.props.id;

        return (
            <div>
                <div className="outline">
                    <div className="row">
                        <div className="col-md-2">
                            <img src={this.props.pics[id].url} width="128"/>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="btn-group" role="group" aria-label="...">
                            <button type="button" className="btn btn-danger" id={id}
                                    onClick={this.props.onDeletePicClick}>Delete Pic
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default class CenterCol extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let submitState = this.props.addPicURL == "" || this.props.addPicDesc == "" ? "disabled" : "";
        let displayPics = [];

        for (let i = 0; i < this.props.pics.length; i++) {
            displayPics.push(<DisplayPic key={i}
                                          pics={this.props.pics}
                                          onDeletePicClick={this.props.onDeletePicClick}
                                          id={i}/>);
        }

        return (<div>
            <div className="text-center">
                <h4>My Pics</h4>
            </div>
            <div className="text-center">
                    <h5>Add A Picture</h5>
                    <form>
                        <div className="form-group">
                            <input type="text" size="45" id="addPicURL"
                                   placeholder="Picture URL" onChange={this.props.onFormChange}
                                   value={this.props.addPicURL}/>
                        </div>
                        <div className="form-group">
                            <input type="text" size="45" id="addPicDesc"
                                   placeholder="Picture Description" onChange={this.props.onFormChange}
                                   value={this.props.addPicDesc}/>
                        </div>
                        <div className="form-group">
                            <div className="btn-group" role="group" aria-label="...">
                                <button type="button" className="btn btn-primary" disabled={submitState}
                                        onClick={this.props.onAddClick}>Add
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            {displayPics}
        </div>);
    }
}
