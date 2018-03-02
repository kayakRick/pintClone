"use strict";

import React from 'react';

export default class CenterCol extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let submitState = this.props.addPicURL == "" || this.props.addPicDesc == "" ? "disabled" : "";

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
        </div>);
    }
}
