import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
/*
for every privateroute we have
to wrap it in a switch to prevent
redirection issues

e.g. 
<Switch>
<Private Route .....> 
</Switch>
the switch allows us to redirect 


based on the tylermcginnis article 
https://tylermcginnis.com/react-router-protected-routes-authentication/

mainly made because we don't want logged out or new users to see our dashboard so we need to protect the route to our dashboard 


*/
const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      auth.isAuthenticated === true ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
