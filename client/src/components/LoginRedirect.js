import React, { useEffect} from 'react';
const LoginRedirect = () => {
    useEffect(() => {
        window.location.href = `${process.env.REACT_APP_API_URL}/discord/login`
    })
    return (
        <div>
            Redirect
        </div>
    )
}

export default LoginRedirect
