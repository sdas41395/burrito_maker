import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Form, Checkbox, Button } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import {store_ingredient} from '../actions/actions'
import Emoji from '../Emoji'
import Tortilla from '../Tortilla'



const mapStateToProps = state => {
  return {
  };
};

const mapDispatchToProps = {
    store_ingredient
};

class MeatOptions extends Component {
  constructor(props) {
    super(props);
    this.add_ingredients_array = this.add_ingredients_array.bind(this)
  }
  state = {
    ingredient : 'meat',
    chosen_meats : []
  };
  

  add_ingredients_array = (value) => {
    // Adds or removes meat from meat array
    var local_meats = this.state.chosen_meats

    // If the meat is already added remove it for unclick
    if (local_meats.includes(value) === true){
        var index = local_meats.indexOf(value)
        local_meats.splice(index,1)
    }
    else{
        local_meats.push(value)
    }

    this.setState({chosen_meats : local_meats})
    this.props.store_ingredient('meat', this.state.chosen_meats)
  }

  send_to_struct = (step) => {
    /* 
        Complete the selection for meat. 
        Pass state values to central data struct using actions and reducers
        Update UI to next page or previous page
    */
    
    if (step > 0){
        this.props.complete_selection(step)
    }
    else{
        // User wants to return back. Set central struct to 0 to allow them to reselect
        this.props.store_ingredient('meat', [])
        this.props.complete_selection(step)
    }
  }

  render(){
    return (
      <div>
        <Form>
        <Form.Field>
          Choose your types of protein
        </Form.Field>
        <Form.Field>
          <Checkbox
            label='Steak'
            name='checkboxRadioGroup'
            value='steak'
            checked={this.state.chosen_meats.includes('steak')}
            onChange={this.add_ingredients_array.bind(this,'steak')}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label='Chicken'
            name='checkboxRadioGroup'
            value='chicken'
            checked={this.state.chosen_meats.includes('chicken')}
            onChange={this.add_ingredients_array.bind(this,'chicken')}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label='Pork'
            name='checkboxRadioGroup'
            value='pork'
            checked={this.state.chosen_meats.includes('pork')}
            onChange={this.add_ingredients_array.bind(this,'pork')}
          />
        </Form.Field>
      </Form>

        {JSON.stringify(this.state.chosen_meats)}
        <Button primary onClick={this.send_to_struct.bind(this,-1)}>
            Go Back
        </Button>
        <Button primary onClick={this.send_to_struct.bind(this,1)}>
            Next Step
        </Button>
            
        <Tortilla
            added_ingredients = {this.state.chosen_meats}
        />

      </div>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MeatOptions)
);
