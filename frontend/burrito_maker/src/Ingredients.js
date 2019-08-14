import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Redirect } from 'react-router'
import { connect } from "react-redux";
import { Form, Checkbox } from 'semantic-ui-react'
import { Header, Button, Card, Image, Modal, Input } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import MeatOptions from './Ingriedent_Choices/MeatOptions'
import VeggieOptions from './Ingriedent_Choices/VeggieOptions'
import SauceOptions from './Ingriedent_Choices/SauceOptions'
import RiceOptions from './Ingriedent_Choices/RiceOptions'
import Emoji from './Emoji'
import './index.css'
import configObject from './config'



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
    ingredient_order : ['rice', 'meat','veggie','sauce', 'final'],
    redirect_email:false,
    redirect_finalize : false,
    email: '',
    order_id:'',
  };
  

  // ------------------- HELPER FUNCTIONS ----------------------------------------

  handle_step = (step) => {
    // Based on parameter, go forward or backwards in burrito ingriedent order
    var current_index = this.state.ingredient_order.indexOf(this.state.ingredient)
    this.setState({ingredient: this.state.ingredient_order[(current_index + step) % 4]})
  }

  handleModal = () => {
      this.setState({final_modal : !this.state.final_modal, redirect_email : false})
  }

  handleEmail = (event) => {
    this.setState({email : event.target.value})
  }

  redirectEmail = () => {
    // Prompt user to enter email address
    this.setState({redirect_email : !this.state.redirect_email})
  }

  registerOrder = () => {
    return this.fetchRegisterOrder().then(response => {
        var parsed_response = JSON.parse(response);
        var status = parsed_response['status']
        if (status === 200){
            this.setState({'order_id' : parsed_response['data']['receipt_id']})
            this.setState({redirect_finalize : !this.state.redirect_finalize})
        }
      }
    );
  };

  fetchRegisterOrder = () => {
    var body_post = {
        "burrito_order":{
            "email" : this.state.email,
            "order" : this.props.burrito_data
        }
    };
    console.log(body_post)
    var url = configObject.host + "/mongo/add_order";
    return fetch(url, {
      method: "POST",
      body: JSON.stringify(body_post)
    })
      .then(res => res.text())
      .catch(error => console.error("Error:", error))
      .then(function (data) {
        var data_parse = data;
        return data_parse;
      });
  };


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
                complete_selection = {this.handle_step}
            />
        )
    }
    
    
    return (
      <div style={{paddingTop:'10px'}}>
        {this.state.redirect_finalize === true && 
            <Redirect
                push to={{
                    pathname: "/tracker",
                    state: { 
                        order: this.props.burrito_data,
                        order_id: this.state.order_id,
                        email: this.state.email
                    }
                }}
            />
        }
        <center>
            <Header as='h1'>
                <div className='rainbow_title'> Mission Burrito </div>
            </Header>
        </center>
        <div style={{paddingLeft:'10px'}}>
            {component}
        </div>
        <div>
            <Modal 
                open={this.state.final_modal} 
                onClose={this.handleModal.bind(this)}
                style={{height:'60vh', width:'50vh'}}
            >
                <Modal.Header>Review your Order</Modal.Header>
                <Modal.Content image>
                <Modal.Description>
                    {this.state.redirect_email === false ? (
                        <div>
                        <p>   
                        {this.props.burrito_data.rice.length !== 0 && 
                            <div>
                                <b> Choice of Rice(s): </b>     
                                <div>  
                                    {this.props.burrito_data.rice.map(option => {
                                        return(
                                            <div style={{paddingLeft:'10px'}}>
                                                {option}
                                                <br/>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        }
                        <br/>
                        {this.props.burrito_data.meat.length !== 0 && 
                            <div>
                                <b> Choice of Protein(s): </b>     
                                <div>  
                                    {this.props.burrito_data.meat.map(option => {
                                        return(
                                            <div style={{paddingLeft:'10px'}}>
                                                {option}
                                                <br/>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        }
                        <br/>
                        {this.props.burrito_data.veggie.length !== 0 && 
                            <div>
                                <b> Choice of Veggies(s): </b>     
                                <div>  
                                    {this.props.burrito_data.veggie.map(option => {
                                        return(
                                            <div style={{paddingLeft:'10px'}}>
                                                {option}
                                                <br/>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        }
                        <br/>

                        {this.props.burrito_data.sauce.length !== 0 && 
                            <div>
                                <b> Choice of Extra(s): </b>   
                                <div>  
                                    {this.props.burrito_data.sauce.map(option => {
                                        return(
                                            <div style={{paddingLeft:'10px'}}>
                                                {option}
                                                <br/>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        }
                    </p>
                    <center>
                        <Button primary onClick={this.handleModal.bind(this)}>
                            Go Back
                        </Button>
                        <Button primary onClick={this.redirectEmail.bind(this)}>
                            Proceed to Delivery
                        </Button>
                    </center>
                    </div>
                    ):(
                        <div>
                            Receive your digital burrito through email!
                            <br/> 
                            <div style={{paddingTop:'20%'}}>
                                <Input focus placeholder='Enter your email' onChange={this.handleEmail.bind(this)} />
                                &nbsp;
                                <Button onClick={this.registerOrder.bind(this)} primary>
                                    Place my order
                                </Button>
                            </div>

                        </div>
                    )}
                    
                </Modal.Description>
                </Modal.Content>
            </Modal>
        </div>
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
