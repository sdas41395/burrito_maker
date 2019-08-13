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

class RiceOptions extends Component {
  constructor(props) {
    super(props);
    this.add_ingredients_array = this.add_ingredients_array.bind(this)
  }
  state = {
    ingredient : 'rice',
    chosen_rice : []
  };
  

  add_ingredients_array = (value) => {
    // Adds or removes rice from rice array
    var local_meats = this.state.chosen_rice

    // If the rice is already added remove it for unclick
    if (local_meats.includes(value) === true){
        var index = local_meats.indexOf(value)
        local_meats.splice(index,1)
    }
    else{
        local_meats.push(value)
    }

    this.setState({chosen_rice : local_meats})
    this.props.store_ingredient('rice', this.state.chosen_rice)

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
        this.props.store_ingredient('rice', [])
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
            label='WhiteRice'
            name='checkboxRadioGroup'
            value='white_rice'
            checked={this.state.chosen_rice.includes('white_rice')}
            onChange={this.add_ingredients_array.bind(this,'white_rice')}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label='BrownRice'
            name='checkboxRadioGroup'
            value='brown_rice'
            checked={this.state.chosen_rice.includes('brown_rice')}
            onChange={this.add_ingredients_array.bind(this,'brown_rice')}
          />
        </Form.Field>
      </Form>

        {JSON.stringify(this.state.chosen_rice)}
        <Button primary onClick={this.send_to_struct.bind(this, 1)}>
            Next Step
        </Button>
          
        <Tortilla
          ingredient = 'rice'
        />
        
      </div>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RiceOptions)
);
