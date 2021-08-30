//Libraries
import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import ReactGa from 'react-ga';
import DiscordOauth2 from 'discord-oauth2'; 
//Main pages
import Home from './pages/Home';
import Alert from './pages/Alert';
import Premium from './pages/Premium';
import Account from './pages/Account';
import Send from './pages/Send';
//Policies
import Privacy from './components/Policies/Privacy';
import Terms from './components/Policies/Terms';
import Cookie from './components/Policies/Cookie';
//Components
import Sidebar from './components/Sidebar/Sidebar';
import Discord from './components/discord';
import PrivateRoute from './components/PrivateRoute';
import LoginRedirect from './components/LoginRedirect';
//Sub pages
import Loading from './components/Loading/Loading';
import NotFound from './components/404/404';
import Access from './pages/Access';
import Changelog from './pages/Changelog';

function App() {
  const [currentUser, setCurrentUser] = useState({email: ''});
  const [currentUserGuilds, setCurrentUserGuilds] = useState({email: ''});
  //const [loading, setLoading] = useState();
  const [allPresets, setPresets] = useState();
  const [subscriptionUser, setSubscriptionUser] = useState();
  //const [betaTesters, setBetaTesters] = useState(['275043451211481090', '313202630023315487']);
  const betaTesters = ['275043451211481090', '313202630023315487'];
  
  const getUser = async () => {
    if(window.localStorage.getItem('token')){
      try {
        setCurrentUser();
        //setLoading(true)
        const token = window.localStorage.getItem('token');
        const oauth = new DiscordOauth2();
        const user = await oauth.getUser(token);
        const userGuilds = await oauth.getUserGuilds(token);
        if(user){
          setCurrentUser(user);
          setCurrentUserGuilds(userGuilds);
        }else{
          setCurrentUser({
            username: false
          })
          setCurrentUserGuilds({
            username: false
          });
        }
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/presets/all?email=${user.email}`);
        setPresets(data);
        // const beta = await axios.get(`http://localhost:50451/access/users`);
        // console.log(beta);
        // setBetaTesters(beta.data);
        const subscription = await axios.get(`${process.env.REACT_APP_API_URL}/subscription/current?customer=${user.email}`);
        if(subscription.data.level){
          setSubscriptionUser(subscription.data);
        }else{
          setSubscriptionUser({level: "free"});
        }
      } catch (error) {
        console.log(error);
      }
    }else{
      setCurrentUser({
        username: false
      })
      setSubscriptionUser({
        level: "free"
      })
    }
    //setLoading(false);
  } 
  useEffect(() => {
    getUser();
    ReactGa.initialize('UA-203234485-1');
    ReactGa.pageview(window.location.pathname + window.location.search);
  }, [])
    return (
      (currentUser && betaTesters.find(tester => tester === currentUser.id)) || window.location.pathname.includes("/auth") ? <div className="container">
        {currentUser && subscriptionUser && window.location.path !== "/" ? <Sidebar currentUser={currentUser} currentUserGuilds={currentUserGuilds} allPresets={allPresets} subscriptionUser={subscriptionUser}/> : ''}
        <Router>
          <Switch>
            <Route path="/" exact><Home /></Route>
            { currentUser && subscriptionUser ? <PrivateRoute path="/account" component={Account} currentUser={currentUser} subscriptionUser={subscriptionUser}/> : <Loading />}
            { currentUser && subscriptionUser ? <PrivateRoute path="/presets" component={Alert} currentUser={currentUser} subscriptionUser={subscriptionUser}/> : <Loading />}
            { currentUser && subscriptionUser && currentUserGuilds ? <PrivateRoute path="/alert" component={Send} currentUser={currentUser} currentUserGuilds={currentUserGuilds} allPresets={allPresets} subscriptionUser={subscriptionUser}/> : <Loading />}

            <Route path="/premium"><Premium/></Route>
            <Route path="/auth/:token"><Discord/></Route>
            <Route path="/changelog"><Changelog /></Route>

            <Route path="/terms"><Terms/></Route>
            <Route path="/cookie"><Cookie/></Route>
            <Route path="/privacy"><Privacy/></Route>

            <Route path="/redirect"><LoginRedirect /></Route>

            <Route><NotFound currentUser={currentUser}/></Route>
          </Switch>
        </Router>
      </div> : currentUser ? <Access currentUser={currentUser}/> : '' 
    )
}

export default App;
