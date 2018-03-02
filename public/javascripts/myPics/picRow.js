import React from 'react';

export default class BarRow extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div className="container">
                <div className="row">
                    <PicCell pics={this.props.pics} i={this.props.i}
                              onDeleteclick={this.props.onDeleteclick}/>
                    <PicCell pics={this.props.pics} i={this.props.i + 1}
                              onDeleteclick={this.props.onDeleteclick} />
                    <PicCell pics={this.props.pics} i={this.props.i + 2}
                              onDeleteclick={this.props.onDeleteclick}/>
                </div>
            </div>
        );
    }
}


class PicCell extends React.Component {
    constructor(props) {
        super(props);
    }

    addDefaultSrc(ev) {
        ev.target.src = '../images/placeholder.png';
    }


    render() {

        const imgStyle = {
            width: '128px',
            marginBottom: "10px"
        };

        let i = this.props.i;
        let pics = this.props.pics;

        if (i >= pics.length)
            return null;

        return(
            <div className="col-md-4">
                <div className="thumbnail pic">
                    <div className="text-center">
                        <h5> {pics[i].desc}</h5>
                    </div>
                    <img onError={this.addDefaultSrc} src={pics[i].url} style={imgStyle}/>
                    <div className="text-center">
                        <Deletebutton onDeleteclick={this.props.onDeleteclick} i={i}/>
                    </div>
                </div>
            </div>
        );
    }
}

class Deletebutton extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if(sessionStorage.getItem("loggedIn"))
            return(
                <button className="btn btn-primary" type="button"
                        value={this.props.i} onClick={this.props.onDeleteclick}>Delete</button>
            );
        else
            return null;
    }
}

