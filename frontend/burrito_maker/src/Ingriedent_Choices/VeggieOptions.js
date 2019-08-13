import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Form, Checkbox, Button } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import {store_ingredient} from '../actions/actions'



const mapStateToProps = state => {
  return {
  };
};

const mapDispatchToProps = {
    store_ingredient
};

class VeggieOptions extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    ingredient : 'veggie',
    chosen_veggie : []
  };
  

  add_ingredients_array = (value) => {
    // Adds or removes veggie from veggie array
    var local_veggie= this.state.chosen_veggie

    // If the meat is already added remove it for unclick
    if (local_veggie.includes(value) === true){
        var index = local_veggie.indexOf(value)
        local_veggie.splice(index,1)
    }
    else{
        local_veggie.push(value)
    }

    this.setState({chosen_veggie : local_veggie})
  }

  send_to_struct = (step) => {
    /* 
        Complete the selection for meat. 
        Pass state values to central data struct using actions and reducers
        Update UI to next page or previous page
    */
    
    if (step > 0){
        this.props.store_ingredient('veggie', this.state.chosen_veggie)
        this.props.complete_selection(step)
    }
    else{
        // User wants to return back. Set central struct to 0 to allow them to reselect
        this.props.store_ingredient('veggie', [])
        this.props.complete_selection(step)
    }
  }



  render(){
    return (
      <div>
        <Form>
        <Form.Field>
          Choose your veggies
        </Form.Field>
        <Form.Field>
          <Checkbox
            label='Beans'
            name='checkboxRadioGroup'
            value='beans'
            checked={this.state.chosen_veggie.includes('beans')}
            onChange={this.add_ingredients_array.bind(this,'beans')}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label='Corn'
            name='checkboxRadioGroup'
            value='corn'
            checked={this.state.chosen_veggie.includes('corn')}
            onChange={this.add_ingredients_array.bind(this,'corn')}
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

      </div>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(VeggieOptions)
);
