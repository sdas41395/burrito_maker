import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Form, Checkbox } from 'semantic-ui-react'
import { Header, Button } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import MeatOptions from './Ingriedent_Choices/MeatOptions'
import VeggieOptions from './Ingriedent_Choices/VeggieOptions'
import SauceOptions from './Ingriedent_Choices/SauceOptions'
import Tortilla from './Tortilla'
import Emoji from './Emoji'


var tortilla_image=require('./tortilla.jpg')



const mapStateToProps = state => {
  return {
    burrito_data : state.burrito_data
  };
};

const mapDispatchToProps = {
};

class Ingredients extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    ingredient : 'meat',
    ingredient_order : ['meat','veggie','sauce', 'final']
  };
  

  // ------------------- HELPER FUNCTIONS ----------------------------------------

  handle_step = (step) => {
    // Based on parameter, go forward or backwards in burrito ingriedent order
    var current_index = this.state.ingredient_order.indexOf(this.state.ingredient)
    this.setState({ingredient: this.state.ingredient_order[(current_index + step) % 3]})
  }




  // -------------------------------------------------------------------------------
  render(){
    const current_ingredient = this.state.ingredient
    let component
    if (current_ingredient === 'meat'){
        component = (
            <MeatOptions
                complete_selection = {this.handle_step}
            />
        )
    }
    if (current_ingredient === 'veggie'){
        component = (
            <VeggieOptions
                complete_selection = {this.handle_step}
            />
        )
    }
    if (current_ingredient === 'sauce'){
        component = (
            <SauceOptions
                complete_selection = {this.handle_step}
            />
        )
    }

    
    return (
      <div>
        <center><Header as='h1'>Burrito Maker!</Header></center>
        {component}
        

        <div style ={ { backgroundImage: "url("+tortilla_image+")" } }></div>




        {this.props.burrito_data.ingredients.meat.map(option => {
            return(
            <div>
                {option === 'chicken' && 
                    <div>
                        <Emoji symbol="🍗" label="chicken"/>
                    </div>
                } 
            </div>
            )
        })}
      </div>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Ingredients)
);
