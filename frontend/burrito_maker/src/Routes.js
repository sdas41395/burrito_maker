import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import App from "./App"
import Ingredients from './Ingredients'
import Tracker from './Tracker'

const mapStateToProps = state => {
  return {
    burrito_data: state.burrito_data
  };
};

const mapDispatchToProps = {};

/*
  Basic Routing page
  Only two routes being ingredients and the burrito tracker
*/

class Routes extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/ingredients" component={Ingredients} />
          <Route exact path="/tracker" component={Tracker} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Routes)
);
