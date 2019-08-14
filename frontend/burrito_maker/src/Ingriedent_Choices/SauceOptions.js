import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Form, Checkbox, Button, Header } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import {store_ingredient} from '../actions/actions'
import Tortilla from '../Tortilla'


const mapStateToProps = state => {
  return {
  };
};

const mapDispatchToProps = {
    store_ingredient
};

class SauceOptions extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    ingredient : 'sauce',
    chosen_sauce : []
  };
  

  add_ingredients_array = (value) => {
    // Adds or removes veggie from veggie array
    var local_sauce= this.state.chosen_sauce

    // If the meat is already added remove it for unclick
    if (local_sauce.includes(value) === true){
        var index = local_sauce.indexOf(value)
        local_sauce.splice(index,1)
    }
    else{
        local_sauce.push(value)
    }

    this.setState({chosen_sauce : local_sauce})
    this.props.store_ingredient('sauce', this.state.chosen_sauce)

  }

  send_to_struct = (step) => {
    /* 
        Complete the selection for meat. 
        Pass state values to central data struct using actions and reducers
        Update UI to next page or previous page
    */
    
    if (step > 0){
        this.props.finalize_modal_call()
    }
    else{
        // User wants to return back. Set central struct to 0 to allow them to reselect
        this.props.store_ingredient('sauce', [])
        this.props.complete_selection(step)
    }
  }



  render(){
    return (
      <div>
        <center>
        <Tortilla
            added_ingredients = {this.state.chosen_sauce}
        />
        <Form>
        <Form.Field>
            <Header as='h3'> Choose your Extras </Header>
        </Form.Field>
        <Form.Field>
          <Checkbox
            label='Hot Pepper Sauce ️🌶️'
            name='checkboxRadioGroup'
            value='pepper'
            checked={this.state.chosen_sauce.includes('pepper')}
            onChange={this.add_ingredients_array.bind(this,'pepper')}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label='Cheese 🧀'
            name='checkboxRadioGroup'
            value='cheese'
            checked={this.state.chosen_sauce.includes('cheese')}
            onChange={this.add_ingredients_array.bind(this,'cheese')}
          />
        </Form.Field>
      </Form>
      {JSON.stringify(this.state.chosen_veggie)}
      <br/>
      <Button primary onClick={this.send_to_struct.bind(this,-1)}>
            Vegetables
        </Button>
        <Button primary onClick={this.send_to_struct.bind(this,1)}>
            Finish Order
        </Button>
        </center>

        
      </div>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SauceOptions)
);
