import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Form, Checkbox, Button } from 'semantic-ui-react'
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
  }

  send_to_struct = (step) => {
    /* 
        Complete the selection for meat. 
        Pass state values to central data struct using actions and reducers
        Update UI to next page or previous page
    */
    
    if (step > 0){
        this.props.store_ingredient('sauce', this.state.chosen_sauce)
        this.props.complete_selection(step)
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
        <Form>
        <Form.Field>
          Choose your sauces
        </Form.Field>
        <Form.Field>
          <Checkbox
            label='White'
            name='checkboxRadioGroup'
            value='white'
            checked={this.state.chosen_sauce.includes('white')}
            onChange={this.add_ingredients_array.bind(this,'white')}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label='Red'
            name='checkboxRadioGroup'
            value='red'
            checked={this.state.chosen_sauce.includes('red')}
            onChange={this.add_ingredients_array.bind(this,'red')}
          />
        </Form.Field>
      </Form>
      {JSON.stringify(this.state.chosen_veggie)}
      <Button primary onClick={this.send_to_struct.bind(this,-1)}>
            Go Back
        </Button>
        <Button primary onClick={this.send_to_struct.bind(this,1)}>
            Next Step
        </Button>
        
        <Tortilla
            added_ingredients = {this.state.chosen_sauce}
        />
        
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
