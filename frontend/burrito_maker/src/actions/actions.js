export const INITIALIZE_APP = "INITIALIZE_APP"
export const STORE_INGREDIENT = "STORE_INGREDIENT_VALUE"


// Creating basic data structure used for the rest of the application
export function intialize_app() {
    return { type: INITIALIZE_APP }
}

// Stores ingredients in the store data struct
export function store_ingredient(group, value) {
    /*
        Arguments:
            group : group of food ex. meat
            value : array of selected values ex ['chicken', 'pork', 'steak']
    */
    return { type: STORE_INGREDIENT, group, value}
}



