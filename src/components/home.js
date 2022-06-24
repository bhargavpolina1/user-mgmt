import React, { Component } from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";
import './home.css';

class Home extends Component{
    render(){
        return (
            <div>
                <h1>Welcome</h1>
              <Link to = "/signin"><Button className = "WelcomePageButton" type='primary'>Sign In</Button></Link>
              <Link to = "/signup"><Button type='primary'>Sign Up</Button></Link>
            </div>  
        )
    }
}
export default Home;