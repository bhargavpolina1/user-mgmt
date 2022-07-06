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
import UserLogin from './userLogin';
  
  class SignIn extends Component {

    state = {
      enteredEmail:"",
      enteredPassword:"",
      successMessage:"",
      eMailError:"",
      passwordError:"",
      errorMessage:"",
      emailValid:false,
      passwordValid:false,
      renderUsers:false,
      isAdmin:false,
      isNonAdminUser:false,
      showDetails:true,
    }

     

     componentDidMount(){
      if(window.sessionStorage.getItem('eMail') && window.sessionStorage.getItem('pwd')){
        const availableEmail = window.sessionStorage.getItem('eMail')
        const availablePwd = window.sessionStorage.getItem('pwd')
        this.setState({
          enteredEmail:availableEmail,
          enteredPassword:availablePwd,
          emailValid:true,
          passwordValid:true,
          eMailError:"",
          passwordError:""
        },() => console.log(this.state.enteredEmail,this.state.enteredPassword))
      }
 
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

    this.setState(stateToUpdate,() => {

      if(this.state.emailValid && this.state.passwordValid){
        axios.post('http://localhost:8080/api/users/login',{
        eMail:this.state.enteredEmail,
        pwd:this.state.enteredPassword,
      }).then((res) =>{
        if(res.status === 200){
          window.sessionStorage.setItem("eMail",this.state.enteredEmail);
          window.sessionStorage.setItem("pwd",this.state.enteredPassword)
          if(res.data[0].makeAdmin === 1){
            this.setState({
              successMessage:"User login successful",
              renderUsers:true,
              isAdmin:true,
              showDetails:false  
            },() => console.log(this.state.renderUsers))
          }else{
            this.setState({
              isNonAdminUser:true,
              successMessage:"Normal user login successful",
              renderUsers:false,
              isAdmin:false,
              errorMessage:"",
              showDetails:false
            },() => console.log(this.state.isNonAdminUser))
          }
        }
      }).catch((err) => {
        console.log(err.response.data)
        this.setState({
          errorMessage:err.response.data,
          successMessage:"",
          showDetails:true
        })
      })
      }
      
    })



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
    }
    
  render(){
    return(
      this.state.showDetails? <div>
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
  <p style={{color:"red",marginBottom:"0"}}>{this.state.errorMessage}</p>
 </Form>
</Col>
</Row>
</div>: this.state.isAdmin?<AdminLogin/>:<UserLogin/>
  )
  }
  };
  
  export default SignIn;