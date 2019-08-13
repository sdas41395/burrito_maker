import { combineReducers } from 'redux'

import {
    INITIALIZE_APP,
    STORE_INGREDIENT

} from '../actions/actions'


// Important Utility Function to ensure we correctly copy data instead of mutating it
function updateObject(oldObject, newValues) {
    return Object.assign({}, oldObject, newValues)
}



// Case Handling for actions
function burrito_data(prevState, action) {
    if (typeof prevState === 'undefined') {
        prevState = null;  //if state is undefined, intiliazing it with null instead to make sure it doesnt break
    }

    switch (action.type) {
        case INITIALIZE_APP: return intialize_app(prevState, action)
        case STORE_INGREDIENT: return store_ingredient_array(prevState, action)
        default: return prevState
    }
}


// Creating basic data_struct to be manipulated by application and user
function intialize_app(state, action) {
    return (
        updateObject(state,
            {
                ingredients : {
                    'meat' : [],
                    'veggie' : [],
                    'sauce' : []
                }
            }
        )
    )
}

function store_ingredient_array(state,action) {
    var local_ingredients = state.ingredients                  // Using local copy of data struct
    local_ingredients[action.group] = action.value

    console.log(local_ingredients)
    return (updateObject(state, { ingredients: local_ingredients }))
}



// ----------------------------------------------------

const burrito_maker = combineReducers({
    burrito_data: burrito_data
})

export default burrito_maker