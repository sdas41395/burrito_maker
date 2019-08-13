import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import App from "./App"
import Ingredients from './Ingredients'

const mapStateToProps = state => {
  return {
    burrito_data: state.burrito_data
  };
};

const mapDispatchToProps = {};

class Routes extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/ingredients" component={Ingredients} />
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
