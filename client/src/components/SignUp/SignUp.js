import React from 'react';
import { Link } from 'react-router-dom';
import './SignUp.css';

function SignUp() {
    
    
    return(
        <div className="signUp">
            <p>Already have an account?</p>
            <p><Link className="link" to="/login">Log in</Link></p>
            <p>New to this webpage?</p>
            <p><Link className="link" to="/register">Register</Link></p>
        </div>
    )
}

export default SignUp;