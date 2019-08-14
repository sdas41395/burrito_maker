
/*
    Emoji Handling 
*/

import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Form, Checkbox } from 'semantic-ui-react'
import { Header, Button } from 'semantic-ui-react'
import { Image } from 'semantic-ui-react'
import TortillaImage from './tortilla.jpg';

import 'semantic-ui-css/semantic.min.css';

const mapStateToProps = state => {
    return {
      burrito_data : state.burrito_data.ingredients
    };
  };
  
  const mapDispatchToProps = {
  };


class Emoji extends Component {
    constructor(props) {
        super(props);
    }


    random_size(){
        /*
            Randomizes the size of the emojis based on their type for a better look
            Needed for stacking the emojis on top of each other
        */        
        if(this.props.label === 'rice'){
            random = 25
        }
        else{
            var min=15; 
            var max=35;

            if(this.props.label === 'veggie'){
                min=15; 
                max=30;
            }
            if(this.props.label === 'sauce'){
                min=10; 
                max=15;
            }
            var random = Math.random() * (+max - +min) + +min; 
        }
        return (random)
    }

    render(){

    return(
        <span
            className="emoji"
            role="img"
            aria-label={this.props.label ? this.props.label : ""}
            aria-hidden={this.props.label ? "false" : "true"}
        >   
            <div style={{fontSize:this.random_size()}}>
                {this.props.symbol}
            </div>
        </span>

    );}

}   

export default withRouter(
    connect(
    mapStateToProps,
    mapDispatchToProps
    )(Emoji)
);



/*
Source : https://medium.com/@seanmcp/%EF%B8%8F-how-to-use-emojis-in-react-d23bbf608bf7
*/