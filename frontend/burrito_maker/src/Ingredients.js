import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Form, Checkbox } from 'semantic-ui-react'
import { Header, Button, Card, Image, Modal } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import MeatOptions from './Ingriedent_Choices/MeatOptions'
import VeggieOptions from './Ingriedent_Choices/VeggieOptions'
import SauceOptions from './Ingriedent_Choices/SauceOptions'
import RiceOptions from './Ingriedent_Choices/RiceOptions'
import Emoji from './Emoji'
import './index.css'



const mapStateToProps = state => {
  return {
    burrito_data : state.burrito_data.ingredients
  };
};

const mapDispatchToProps = {
};

class Ingredients extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    ingredient : 'rice',
    final_modal: false,
    ingredient_order : ['rice', 'meat','veggie','sauce', 'final']
  };
  

  // ------------------- HELPER FUNCTIONS ----------------------------------------

  handle_step = (step) => {
    // Based on parameter, go forward or backwards in burrito ingriedent order
    var current_index = this.state.ingredient_order.indexOf(this.state.ingredient)
    this.setState({ingredient: this.state.ingredient_order[(current_index + step) % 4]})
  }

  handleModal = () => {
      this.setState({final_modal : !this.state.final_modal})
  }



  // -------------------------------------------------------------------------------
  render(){
    const current_ingredient = this.state.ingredient
    let component

    if (current_ingredient === 'rice'){
        component = (
            <RiceOptions
                complete_selection = {this.handle_step}
            />
        )
    }
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
                finalize_modal_call = {this.handleModal}
            />
        )
    }
    
    
    return (
      <div style={{paddingTop:'10px'}}>
        <center><Header as='h1'>Burrito Maker!</Header></center>
        <div style={{paddingLeft:'10px'}}>
            {component}
        </div>
        <Modal open={this.state.final_modal} onClose={this.handleModal.bind(this)}>
            <Modal.Header>Review your Order</Modal.Header>
            <Modal.Content image>
            <Modal.Description>
                <p>        
                    {JSON.stringify(this.props.burrito_data)}
                </p>
                <Button>
                    Proceed to Delivery
                </Button>
            </Modal.Description>
            </Modal.Content>
        </Modal>
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
