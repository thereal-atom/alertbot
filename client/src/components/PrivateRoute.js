
import React from "react"
import { Route, Redirect } from "react-router-dom"

export default function PrivateRoute({ component: Component, currentUser, currentUserGuilds, allPresets, subscriptionUser,  ...rest }) {
  return (
    <Route
      {...rest}
      render={props => {
        return window.localStorage.getItem("token") !== null ? <Component {...props} currentUser={currentUser} currentUserGuilds={currentUserGuilds} allPresets={allPresets} subscriptionUser={subscriptionUser}/> : <Redirect to="/redirect" />
      }}
    ></Route>
  )
}