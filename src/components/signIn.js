import {
    Button,
    Col,
    Form,
    Input,
    Row
  } from 'antd';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import validator from "validator";
import AdminLogin from './adminLogin';
  
  class SignIn extends Component {

    state = {
      enteredEmail:"",
      enteredPassword:"",
      successMessage:"",
      eMailError:"",
      passwordError:"",
      emailValid:false,
      passwordValid:false,
      renderUsers:false,
      isAdmin:false
    }

    validateMailAndPwd = (enteredEmail,enteredPassword) => {
      
      
      let stateToUpdate = {}
      let isValidEmail = validator.isEmail(enteredEmail);
    if (!isValidEmail) {
      stateToUpdate.eMailError = "*Enter a valid mail id";
    } else {
      stateToUpdate.enteredEmail = enteredEmail;
      stateToUpdate.eMailError = "";
      stateToUpdate.emailValid = true;
    }

    let isValidPassword = validator.isStrongPassword(enteredPassword);
    if (!isValidPassword) {
      stateToUpdate.passwordError = "*Entered password is not valid";
    } else {
      stateToUpdate.enteredPassword = enteredPassword;
      stateToUpdate.passwordError = "";
      stateToUpdate.passwordValid = true;
    }

    this.setState(stateToUpdate)

    }

    handleEmailChange = (event)=> {
      this.setState({
        enteredEmail:event.target.value
      },() => console.log(this.state.enteredEmail))
    }

    handlePasswordChange = (event)=> {
      this.setState({
        enteredPassword:event.target.value
      },() => console.log(this.state.enteredPassword))
    }

    handleSign = () => {
      console.log("Login clicked")

      this.validateMailAndPwd(this.state.enteredEmail,this.state.enteredPassword)

      if(this.state.emailValid && this.state.passwordValid){
        axios.post('http://localhost:8080/api/users/login',{
        eMail:this.state.enteredEmail,
        pwd:this.state.enteredPassword,
      }).then((res) =>{
        if(res.status === 200){
          if(res.data[0].makeAdmin === 1){
            this.setState({
              successMessage:"User login successful",
              renderUsers:true,
              isAdmin:true,
            },() => console.log(this.state.renderUsers))
          }
        }else{
          this.setState({
            successMessage:"",
            renderUsers:false,
            isAdmin:false


          })
        }
      }).catch((err) => console.log(err))
      }
    }
    
  render(){
    
       {if(!this.state.renderUsers){
        return (
          <div>
          <h1> Please enter your credentials</h1>
          <Row justify='center'>
              <Col>
              <Form
      labelCol={{
        span: 16,
      }}
      wrapperCol={{
        span: 24,
      }}
      layout="vertical">
      <Form.Item label="E-Mail">
        <Input type="email" value={this.state.enteredEmail} onChange = {this.handleEmailChange} placeholder='Enter your e-mail' size="large"/>
        <p style={{color:"red",marginBottom:"0"}}>{this.state.eMailError}</p>
      </Form.Item>
      <Form.Item>
      <Form.Item label="Password">
        <Input  placeholder='Enter your password' onChange={this.handlePasswordChange} value = {this.state.enteredPassword} type = "password" size="large"/>
        <p style={{color:"red",marginBottom:"0"}}>{this.state.passwordError}</p>
      </Form.Item>
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick = {this.handleSign} style={{marginRight:".3rem"}}>Log in</Button>
        <Link to = '/'><Button type='primary'>Back</Button></Link>
      </Form.Item>
      <p>{this.state.successMessage}</p>
     </Form>
    </Col>
  </Row>
      </div>
        ) 
        }else{
          if(this.state.isAdmin){
            return(<AdminLogin/>)
          }else{
            return(<h1>Welcome user</h1>)
          }} 
        } 
  }
  };
  
  export default SignIn;