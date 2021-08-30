import React, { useEffect } from 'react';
import { useParams, Redirect } from "react-router-dom";
  
const Discord = () => {
    let { token } = useParams();
    useEffect(() => {
        window.localStorage.setItem('token', token);
    }, [token])
    return <Redirect to='/account' />
}
export default Discord;