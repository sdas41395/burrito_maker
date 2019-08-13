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
    burrito_data : state.burrito_data
  };
};

const mapDispatchToProps = {
};

class Tortilla extends Component {
  constructor(props) {
    super(props);
  }
  state = {

  };
  
  render(){    
    return (
      <div>
        <center><Image src={TortillaImage} /></center>
      </div>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Tortilla)
);
