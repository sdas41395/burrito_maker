import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Form, Checkbox } from 'semantic-ui-react'
import { Header, Button } from 'semantic-ui-react'
import { Image } from 'semantic-ui-react'
import TortillaImage from './tortilla.jpg';
import Emoji from './Emoji'


import 'semantic-ui-css/semantic.min.css';


const mapStateToProps = state => {
  return {
    burrito_data : state.burrito_data.ingredients
  };
};

const mapDispatchToProps = {
};

class Tortilla extends Component {
  constructor(props) {
    super(props);
  }
  state = {
  };

  componentDidMount(){
      console.log('Intilized Tortilla')

  }

  componentDidUpdate(){
      console.log("Updating Tortilla")
  }
  
  render(){
    const component_render = []
    for(var group = 0; group < Object.keys(this.props.burrito_data).length; group++){
        let ingredient = Object.keys(this.props.burrito_data)[group] 
        
        console.log(ingredient)
        console.log(Object.keys(this.props.burrito_data))

        if (ingredient === 'rice'){
            let rice_html = []
            let tortilla_area = (8 * 9) / this.props.burrito_data.rice.length

            for (let x = 0; x < this.props.burrito_data.rice.length; x++){
                for (let i = 0; i < tortilla_area; i++ ){
                    if (this.props.burrito_data.rice[x] === 'white_rice'){
                        rice_html.push(<Emoji symbol="🍙" label="rice"/>)
                    }
                    if (this.props.burrito_data.rice[x] === 'brown_rice'){
                        rice_html.push(<Emoji symbol="🍘" label="rice"/>)
                    }
                }
            }

            
            component_render.push(rice_html)
        }

        

        if (ingredient === 'meat'){
            let meat_html = []
            var added_ingredients_array = this.props.burrito_data.meat
            var tortilla_area = Math.floor((7 * 8) / added_ingredients_array.length)
            for(let y = 0; y < 8; y++){
                meat_html.push(<div>.</div>)
            }

            for (let x = 0; x < added_ingredients_array.length; x++){
                for (let i = 0; i < tortilla_area; i++ ){
                    if (added_ingredients_array[x] === 'steak'){
                        meat_html.push(<Emoji symbol="🥩" label="meat"/>)
                    }
                    if (added_ingredients_array[x] === 'chicken'){
                        meat_html.push(<Emoji symbol="🍗" label="meat"/>)
                    }
                    if (added_ingredients_array[x] === 'pork'){
                        meat_html.push(<Emoji symbol="🍖" label="meat"/>)
                    }
                }
            }

            // Assigning the extra
            for (let x = 0; x < (7*8 % added_ingredients_array.length); x++){
                meat_html.push(meat_html[meat_html.length-1])
            }


            component_render.push(meat_html)
        }

        if (ingredient === 'veggie'){
            let veggie_html = []
            var added_ingredients_array = this.props.burrito_data.veggie
            var tortilla_area = Math.floor((8 * 5) / added_ingredients_array.length)
            for(let y = 0; y < 8; y++){
                veggie_html.push(<div>.</div>)
                veggie_html.push(<div>.</div>)
            }

            for (let x = 0; x < added_ingredients_array.length; x++){
                for (let i = 0; i < tortilla_area; i++ ){
                    if (added_ingredients_array[x] === 'corn'){
                        veggie_html.push(<Emoji symbol="🌽" label="veggie"/>)
                    }
                    if (added_ingredients_array[x] === 'lettuce'){
                        veggie_html.push(<Emoji symbol="🥗" label="veggie"/>)
                    }
                    if (added_ingredients_array[x] === 'avacado'){
                        veggie_html.push(<Emoji symbol="🥑" label="veggie"/>)
                    }
                    if (added_ingredients_array[x] === 'mushrooms'){
                        veggie_html.push(<Emoji symbol="🍄" label="veggie"/>)
                    }
                }
            }

            // Assigning the extra
            for (let x = 0; x < (6*8 % added_ingredients_array.length); x++){
                veggie_html.push(veggie_html[veggie_html.length-1])
            }


            component_render.push(veggie_html)
        }



        if (ingredient === 'sauce'){
            let sauce_html = []
            var added_ingredients_array = this.props.burrito_data.sauce
            var tortilla_area = Math.floor((8 * 9) / added_ingredients_array.length)
            

            for (let x = 0; x < added_ingredients_array.length; x++){
                for (let i = 0; i < tortilla_area; i++ ){
                    if (added_ingredients_array[x] === 'pepper'){
                        sauce_html.push(<Emoji symbol="🌶️" label="sauce"/>)
                    }
                    if (added_ingredients_array[x] === 'cheese'){
                        sauce_html.push(<Emoji symbol="🧀" label="sauce"/>)
                    }
                }
            }

            // Assigning the extra
            for (let x = 0; x < (6*8 % added_ingredients_array.length); x++){
                sauce_html.push(sauce_html[sauce_html.length-1])
            }


            component_render.push(sauce_html)
        }
        
    }
    


    return (
      <div>
        <div className='burrito_card' style={{width:300, height:300}}>
            {component_render.map((group => {
                return(
                    <div className='burrito_card_grid' style={{paddingTop:50, paddingLeft:65}} >
                        {group.map((item => {
                            return(
                                <div>
                                    {item}
                                </div>
                            )
                        }))}
                    </div>
                )
            }))}
        </div>
      </div>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Tortilla)
);
