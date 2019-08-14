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
import { Redirect } from 'react-router'

import './index.css'
import configObject from './config'



const mapStateToProps = state => {
  return {
    burrito_data : state.burrito_data.ingredients
  };
};

const mapDispatchToProps = {
};

// These are the statuses and status codes that are stored in the DB for each burrito ticket
const percent_text = {
  0:'Confirming your order!',
  5:'Getting your tortilla from the back',
  10:'Sniffing around for your ingredients',
  15:'Delivering ingredients to the chef',
  20:'Convincing the chef to start cooking',
  25:'Kitchen caught on fire',
  30:'Kitchen fire put out',
  35:'Chef caught on fire',
  40:'New chefs being interviewed',
  45:'Chef candidate from New York looking promising',
  50:'Take home burrito interview looked good',
  55:'Onsite went well',
  60:'Hired and assigned your order',
  65:'New Chef completed your burrito!',
  70:'Your deliverer has picked up your burrito!',
  75:'Strolling through the internet',
  80:'Quick snack break',
  85:'Continuing along on the path',
  90:'Mistakenly delivered to the wrong email',
  95:'Fixed the mistake',
  99:'Almost there!',
  100:'Your burrito has been delivered to your email!',
}

/*
                                  Tracker Page
  This file is the layout and fetch handling for the burrito tracking
  Uses passed in arguments from the ingredients page to build out the UI and prepare the fetches

  5 Fetches:
    Retrieving the data of the passed in ticker using its object ID
    Retrieving all previous tickets submitted using the application
    Triggering the final delivery status as well as the email 
    Sending a tip and updating the database with the amount
    Sending updates to the status array of the passed in object ID


  
  To simulate someone delivering the burrito, the advance_progress() function triggers every 2 seconds
  and updates the status of the passed in ticket using the Update Fetch, modifying the database. 
  This would be done externally but because I have not built a enter update portal, this acts like one.

  After all previous statuses are entered into the database, the final is a Delivered! status. Upon triggering
  the fetch call, an email is sent out with the meta_data of burrito to the associated email address.

  Future work would definitely be improving the UI to show the past tickets more distinctly as well as style the
  page in a more appealing way.

*/

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
    current_status:'',
    all_ingredients: [],
    email_sent_modal:false,
    redirect_ingredients:false,
    received_tip:false,
    tip : '',
    all_orders:[]
  };
  
  componentDidMount(){
    if (this.props.location.state === undefined){
      this.setState({redirect_ingredients : !this.state.redirect_ingredients})
    }
    else{
      var user_data = this.props.location.state.order
      var all_ingredients = []

      // Collapsing all the ingredients into one group for easier handling in the return
      for(var group_iterator = 0; group_iterator < Object.keys(user_data).length; group_iterator ++){
        var groups = Object.keys(user_data)
        for(var option_iterator = 0; option_iterator < Object.keys(user_data[groups[group_iterator]]).length; option_iterator ++){
          all_ingredients.push(user_data[groups[group_iterator]][option_iterator])
        }
      }

      this.setState({ 
        order_id : this.props.location.state.order_id,
        all_ingredients: all_ingredients
      })

      // API Requests to retrieve data
      this.returnAll()
      this.getSingleOrder()

      // Simulating progress of the digital burrito using a timer 
      var intervalId = setInterval(this.advance_progress.bind(this), 2000);
      this.setState({intervalId: intervalId});
    }
  }

  // --------------------------------- HELPER FUNCTIONS --------------------------------------

  handleEmailModal = () => {
    this.setState({email_sent_modal : !this.state.email_sent_modal})
  }

  handleTip = (event) => {
    this.setState({tip : event.target.value})
  }

  advance_progress = () => {
    /*
      This function simulates the progress of the burrito as it goes through the internet
    */
    this.updateOrder()
  }

  updateOrder = () => {
    // Updates the order of a cooresponding burrito ticket based on object_id 
    // Takes in status object from percent_text object above
    return this.fetchUpdateOrder().then(response => {
        var parsed_response = JSON.parse(response);
        var status = parsed_response['status']
        console.log(status)
        console.log(parsed_response['data'])
        this.setState({ percent : (this.state.percent + 5)})

        if (this.state.percent >= 100 ){
          console.log("finished")
          this.getEmailDelivery()
          clearInterval(this.state.intervalId);
        }

      }
    );
  };

  fetchUpdateOrder = () => {
    var body_post = {
        '_id' : this.state.order_id,
        'status' : {
          [String(this.state.percent)] : percent_text[this.state.percent]
        }
    };
    console.log(body_post)
    var url = configObject.host + "/mongo/update_order";
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

  sendTip = () => {
    // Increments the tip with passed in value
    return this.fetchSendTip(this.state.tip).then(response => {
        var parsed_response = JSON.parse(response);
        var status = parsed_response['status']
        if (status === 200){
          this.setState({received_tip : !this.state.received_tip})
        }
      }
    );
  };

  fetchSendTip = (tip) => {
    var body_post = {
        'tip' : String(tip),
    };
    console.log(body_post)
    var url = configObject.host + "/mongo/add_tip";
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

  returnAll = () => {
    // Return all past tickets and their associated meta data
    console.log('returning all')
    return this.fetchAllOrders().then(response => {
        var parsed_response = JSON.parse(response);
        var status = parsed_response['status']
        var total_data = parsed_response['data']
        console.log(total_data)
        if (status === 200){
          console.log(total_data[0]._id['$oid'])
          this.setState({all_orders : total_data})
        }
      }
    );
  };

  fetchAllOrders = () => {
    var url = configObject.host + "/mongo/return_all";
    return fetch(url, {
      method: "GET",
    })
      .then(res => res.text())
      .catch(error => console.error("Error:", error))
      .then(function (data) {
        var data_parse = data;
        return data_parse;
      });
  };

  getSingleOrder = () => {
    // Retrieves a single order based on a single object_id
    return this.fetchSingleOrder(this.state.order_id).then(response => {
        var parsed_response = JSON.parse(response);
        var status = parsed_response['status']
        var total_data = parsed_response['data']
        if (status === 200){
          var last_element = total_data[Object.keys(total_data['status']).length]
          this.setState({percent : parseInt(Object.keys(last_element))})
        }
      }
    );
  };

  fetchSingleOrder = (object_id) => {
    var url = configObject.host + "/mongo/check_order";
    var body_post = {
      '_id' : object_id,
  };
    return fetch(url, {
      method: "GET",
      body: JSON.stringify(body_post)

    })
      .then(res => res.text())
      .catch(error => console.error("Error:", error))
      .then(function (data) {
        var data_parse = data;
        return data_parse;
      });
  };

  getEmailDelivery = () => {
    // For a certain object_id, pass in the final Delivered! status update as well as 
    // trigger the email smtp function
    return this.fetchEmailDelivery(this.state.order_id).then(response => {
        var parsed_response = JSON.parse(response);
        var status = parsed_response['status']
        if (status === 200){
          this.setState({email_sent_modal : !this.state.email_sent_modal})
        }
      }
    );
  };

  fetchEmailDelivery = (object_id) => {
    var url = configObject.host + "/mongo/deliver_order";
    var body_post = {
      '_id' : object_id,
  };
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
      <div style={{backgroundColor : '#ebf5ee', height:'100vh'}}>
      {this.state.redirect_ingredients === true && 
            <Redirect
                to={{
                    pathname: "/ingredients",
                }}
            />
        }
        <div style={{paddingLeft:10, paddingTop:10}}>
          <Header as='h1'> <div style={{color:'#4c4b63'}}>MISSION BURRITO: BURRITO TRACKER </div></Header>
        </div>
        <div style={{paddingTop: '2%'}}>
          <Header as='h3' style={{paddingLeft:'10%'}}> <div style={{color:'#4c4b63'}}> <b>Status</b> <br/> // {percent_text[this.state.percent]} </div></Header>
          <div style={{paddingLeft:'10%', paddingRight:'10%'}}>
            <Progress percent={this.state.percent} indicating progress/>
          </div>
        </div>
        <hr/>
        <div className='tracker_id_burrito_information_layout' style={{paddingTop:10}}>
          <div style={{paddingLeft:140}}>
            <Card style={{backgroundColor:'#fffff'}}>
              <Card.Content>
                <Header as='h1'><div style={{color:'#4c4b63'}}>Your Delivery Good Boy</div></Header>
                <center><Image src={require("./delivery_dog.jpg")} height="200" width="200" circular/></center>
                <Header as='h1'>Chorizo</Header>
                      Chorizo has over 5 years of experience in delivering virtual burritos all across email domains. <br/>
                      He takes pride in his work and enjoys bringing happiness to his hungry customers
              </Card.Content>
            </Card>
          </div>
          <div style={{paddingLeft:40}}>
            <Card style={{width: 500, height:200, backgroundColor:'#fffff'}}>
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
              <Card style={{backgroundColor:'#ffffff'}}>
                <Card.Content>
                    <Header as='h3'>Leave a tip?</Header>
                    Tips are greatly appreciated by the Mission Burrito staff!<br/>
                    <div>
                      {this.state.received_tip === false ? (
                        <div>
                          <Input focus placeholder='Enter an amount (integer)' onChange={this.handleTip.bind(this)}/>
                          <Button primary onClick={this.sendTip.bind(this)}> Add tip </Button>
                        </div>
                      ):(
                        <center>
                          <b>Thank you for your contribution!</b>
                        </center>
                      )}
                      
                    </div>
                </Card.Content>
              </Card>
            </div>
            <div style={{}}>
            <Card style={{backgroundColor:'#fffff', width: 400}}>
              <Card.Content>
                <Header as='h1'><div style={{color:'#4c4b63'}}>Previous Tickets</div></Header>
                {Object.keys(this.state.all_orders).map(order => {
                  return(
                    <div>
                      <div>
                          <div className='tracker_id_previous_records_layout'> <Header as='h3'>Order ID</Header> {this.state.all_orders[order]._id['$oid']}</div>
                      </div>
                      <div>
                          <div className='tracker_id_previous_records_layout'> <Header as='h3'>Username</Header> {this.state.all_orders[order].username}</div>
                      </div>
                      <div>
                          <div className='tracker_id_previous_records_layout'> <Header as='h3'>Date Created</Header> {this.state.all_orders[order].datetime}</div>
                      </div>
                      <div>
                          <div className='tracker_id_previous_records_layout'> <Header as='h3'>Date Delivered</Header> {this.state.all_orders[order].delivered}</div>
                      </div>
                      <div>
                        <Header as='h3'>Ingredients</Header>
                        <div className = 'tracker_id_burrito_ingredient_list'>
                          {this.state.all_orders[order].order['rice'].map(ingredient => {
                            return(
                              <div>
                                - {(ingredient)} <br/>
                              </div>
                            )
                          })}
                          {this.state.all_orders[order].order['meat'].map(ingredient => {
                            return(
                              <div>
                                - {(ingredient)} <br/>
                              </div>
                            )
                          })}
                          {this.state.all_orders[order].order['veggie'].map(ingredient => {
                            return(
                              <div>
                                - {(ingredient)} <br/>
                              </div>
                            )
                          })}
                          {this.state.all_orders[order].order['sauce'].map(ingredient => {
                            return(
                              <div>
                                - {(ingredient)} <br/>
                              </div>
                            )
                          })}  
                      </div>
                      <hr/>
                      <br/>
                      </div>
                    </div>
                  )
                })}
              </Card.Content>
            </Card>
          </div>
          <div>
            <Modal 
              open={this.state.email_sent_modal} 
              onClose={this.handleEmailModal.bind(this)}
              style={{width:'40%'}}
              >
              <Modal.Content>
              <Modal.Description>
                <center>
                  <Header as='h1'><div style={{color:'#4c4b63'}}>Your burrito has been delivered!</div></Header>
                </center>
              </Modal.Description>
              </Modal.Content>
            </Modal>
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
