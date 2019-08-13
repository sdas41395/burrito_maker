import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Form, Checkbox } from 'semantic-ui-react'
import { Header, Button } from 'semantic-ui-react'
import { Image } from 'semantic-ui-react'
import TortillaImage from './tortilla.jpg';
import Emoji from './Emoji'


import 'semantic-ui-css/semantic.min.css';


const mapStateToProps = state => {
  return {
    burrito_data : state.burrito_data.ingredients
  };
};

const mapDispatchToProps = {
};

class Tortilla extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    current_ingredients:this.props.added_ingredients
  };

  componentDidMount(){
      console.log('Intilized Tortilla')
  }

  componentDidUpdate(){
      console.log("Updating Tortilla")
  }
  
  render(){ 
      
    let component_render
    let ingredient = this.props.ingredient

    if (ingredient == 'rice'){
        let tortilla_area = 8 * 9
        let rice_html = []
        for (let i = 0; i < tortilla_area; i++ ){
            rice_html.push(<Emoji symbol="🍚" label="rice"/>)
        }
        component_render = (
            <div div className='burrito_card_grid' style={{paddingTop:50, paddingLeft:65}}>
                {rice_html.map(single_emoji => {
                    return(
                        single_emoji
                    )
                })}
            </div>
        )
    }

    return (
      <div>
        <div className='burrito_card' style={{width:300, height:300}}>
            {component_render}
        </div>
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
