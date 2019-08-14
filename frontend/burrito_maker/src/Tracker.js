import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Form, Checkbox } from 'semantic-ui-react'
import { Header, Button, Card, Image, Modal, Progress, Input } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import MeatOptions from './Ingriedent_Choices/MeatOptions'
import VeggieOptions from './Ingriedent_Choices/VeggieOptions'
import SauceOptions from './Ingriedent_Choices/SauceOptions'
import RiceOptions from './Ingriedent_Choices/RiceOptions'
import Emoji from './Emoji'
import delivery_dog from './delivery_dog.jpg';
import './index.css'
import configObject from './config'



const mapStateToProps = state => {
  return {
    burrito_data : state.burrito_data.ingredients
  };
};

const mapDispatchToProps = {
};

const percent_text = {
  0:'Confirming your order!',
  5:'Getting your tortilla from the back',
  10:'Travelling around for your ingredients',
  15:'Collecting tasty ingredients for the chef',
  20:'Convincing the chef to start cooking',
  25:'Kitchen caught on fire',
  30:'Kitchen fire put out',
  35:'Chef caught on fire',
  40:'New chefs being interviewed',
  45:'New York Chef looking promising',
  50:'Take home burrito interview looked good',
  55:'Onsite went well',
  60:'Hired and assigned your order',
  65:'New Chef completed your burrito!',
  70:'Your deliverer has picked up your burrito!',
  75:'Strolling through the internet',
  80:"Your deliverer snack break",
  85:'Continuing along on the path',
  90:'Met friends along the way',
  95:'Went to the wrong email',
  99:'End nearly in sight!',
  100:'Your burrito has been delivered to your email!',
}

class Tracker extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    order_id : '',
    meat : [],
    rice : [],
    sauce : [],
    veggie : [],
    email : '',
    percent : 0,
    all_ingredients: []
  };
  
  componentDidMount(){
    var user_data = this.props.location.state.order
    var all_ingredients = []
    console.log(user_data)
    for(var group_iterator = 0; group_iterator < Object.keys(user_data).length; group_iterator ++){
      var groups = Object.keys(user_data)
      console.log(user_data[groups[group_iterator]])
      for(var option_iterator = 0; option_iterator < Object.keys(user_data[groups[group_iterator]]).length; option_iterator ++){
        console.log(user_data[groups[group_iterator]][option_iterator])
        all_ingredients.push(user_data[groups[group_iterator]][option_iterator])
      }
    }
    this.setState({ 
      order_id : this.props.location.state.order_id,
      all_ingredients: all_ingredients
    })
    // Simulating progress of the digital burrito using a timer 
    var intervalId = setInterval(this.advance_progress.bind(this), 2000);
    this.setState({intervalId: intervalId});
  }

  // --------------------------------- HELPER FUNCTIONS --------------------------------------

  advance_progress = () => {
    /*
      This function simulates the progress of the burrito as it goes through the internet
      The actual calls are close to instant
    */
    this.setState({ percent : (this.state.percent + 5)})
    if (this.state.percent === 100){
      console.log("finished")
      clearInterval(this.state.intervalId);
    }
  }

  updateOrder = () => {
    return this.fetchUpdateOrder().then(response => {
        var parsed_response = JSON.parse(response);
        var status = parsed_response['status']
        if (status === 200){
            this.setState({'order_id' : parsed_response['data']['receipt_id']})
            this.setState({redirect_finalize : !this.state.redirect_finalize})
        }
      }
    );
  };

  fetchUpdateOrder = () => {
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



  // ------------------------------- ROUTES ---------------------------------------------------

  render(){
    return (
      <div style={{backgroundColor : '#fffff', height:'100vh'}}>
        <div style={{paddingLeft:10}}>
          <Header as='h1'> <div style={{color:'#4c4b63'}}>MISSION BURRITO: BURRITO TRACKER </div></Header>
        </div>
        <div style={{paddingTop: '3%'}}>
          <Header as='h3' style={{paddingLeft:'10%'}}> <div style={{color:'#4c4b63'}}> <b>{percent_text[this.state.percent]}</b> </div></Header>
          <div style={{paddingLeft:'10%', paddingRight:'10%'}}>
            <Progress percent={this.state.percent} indicating />
          </div>
        </div>
          <hr/>
        <div className='tracker_id_burrito_information_layout' style={{}}>
          <div style={{paddingLeft:140}}>
            <Card style={{}}>
              <Card.Content>
                <Header as='h1'><div style={{color:'#4c4b63'}}>Your Delivery Good Boy</div></Header>
                <center><Image src={require("./delivery_dog.jpg")} height="200" width="200" circular/></center>
                <Header as='h1'>Chorizo</Header>
                      Chorizo has over 18 years of experience in delivering virtual burritos all across email domains. <br/>
                      He takes pride in his work and enjoys bringing happiness to his hungry customers
              </Card.Content>
            </Card>
          </div>
          <div style={{paddingLeft:100}}>
            <Card style={{width: 500, height:200}}>
              <Card.Content>
                  <div className='tracker_id_burrito_list'>
                    <div>
                      <Header as='h3'>Digital Burrito: <br/> </Header>
                      <Card.Meta>
                        <span className='date'> Order ID: {this.state.order_id}</span>
                      </Card.Meta>
                    </div>
                    <div>
                      <Header as='h3'>Ingredients</Header>
                      <div className = 'tracker_id_burrito_ingredient_list'>
                        {this.state.all_ingredients.map(ingredient => {
                          return(
                            <div>
                              - {ingredient} <br/>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </Card.Content>
              </Card>
              <Card style={{backgroundColor:''}}>
                <Card.Content>
                    Leave a tip? <br/>
                    <div>
                      <Input focus placeholder='Enter an amount' />
                      <Button primary> Thank You! </Button>
                    </div>
                </Card.Content>
              </Card>
            </div>
              
            
          </div>
    </div>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Tracker)
);
