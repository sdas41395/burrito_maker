import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Form, Checkbox, Button, Header } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import {store_ingredient} from '../actions/actions'
import Tortilla from '../Tortilla'




const mapStateToProps = state => {
  return {
    burrito_data : state.burrito_data.ingredients
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

  componentDidMount(){
    var local_veggie = []
    for (var veggie_option in this.props.burrito_data.veggie){
        local_veggie.push(this.props.burrito_data.veggie[veggie_option])
    }
    this.setState({chosen_veggie : local_veggie})
  }
  

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
    this.props.store_ingredient('veggie', this.state.chosen_veggie)

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
        this.props.store_ingredient('veggie', [])
        this.props.complete_selection(step)
    }
  }



  render(){
    return (
      <div>
        <center>
        <Tortilla
          ingredient = 'veggie'
          added_ingredients = {this.state.chosen_veggie}        
        />
        <Form>
        <Form.Field>
            <Header as='h3'> Choose your Veggies </Header>
        </Form.Field>
        <Form.Field>
          <Checkbox
            label='Corn 🌽'
            name='checkboxRadioGroup'
            value='corn'
            checked={this.state.chosen_veggie.includes('corn')}
            onChange={this.add_ingredients_array.bind(this,'corn')}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label='Lettuce 🥗'
            name='checkboxRadioGroup'
            value='lettuce'
            checked={this.state.chosen_veggie.includes('lettuce')}
            onChange={this.add_ingredients_array.bind(this,'lettuce')}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label='Avacado 🥑'
            name='checkboxRadioGroup'
            value='avacado'
            checked={this.state.chosen_veggie.includes('avacado')}
            onChange={this.add_ingredients_array.bind(this,'avacado')}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label='Mushrooms 🍄'
            name='checkboxRadioGroup'
            value='mushrooms'
            checked={this.state.chosen_veggie.includes('mushrooms')}
            onChange={this.add_ingredients_array.bind(this,'mushrooms')}
          />
        </Form.Field>
      </Form>
        <br/>
        <Button primary onClick={this.send_to_struct.bind(this,-1)}>
            Meat
        </Button>
        <Button primary onClick={this.send_to_struct.bind(this,1)}>
            Next Step
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
  )(VeggieOptions)
);
