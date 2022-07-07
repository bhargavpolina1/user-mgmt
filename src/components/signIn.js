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
import baseUrl from './url';
  
  class SignIn extends Component {

    state = {
      enteredEmail:"",
      enteredPassword:"",
      eMailError:"",
      passwordError:"",
      errorMessage:"",
      emailValid:false,
      passwordValid:false,
      isAdmin:false,
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

   
    onFinish = (e) => {
      console.log("Login clicked")
      console.log(e);

      if (e.eMail === undefined || e.pwd === undefined){
        this.setState({
          errorMessage:"Enter both email and password to validate"
        })
      }
      else{
        this.setState({
          errorMessage:""
        })
        let stateToUpdate = {}
      let isValidEmail = validator.isEmail(e.eMail);
    if (!isValidEmail) {
      stateToUpdate.eMailError = "*Enter a valid mail id";
    } else {
      stateToUpdate.enteredEmail = e.eMail;
      stateToUpdate.eMailError = "";
      stateToUpdate.emailValid = true;
    }

    let isValidPassword = validator.isStrongPassword(e.pwd);
    if (!isValidPassword) {
      stateToUpdate.passwordError = "*Entered password didn't meet the requirements";
    } else {
      stateToUpdate.enteredPassword = e.pwd;
      stateToUpdate.passwordError = "";
      stateToUpdate.passwordValid = true;
    }

    this.setState(stateToUpdate,() => {

      if(this.state.emailValid && this.state.passwordValid){
        console.log(this.state.enteredEmail , this.state.enteredPassword)
        axios.post(baseUrl+'login',{
        eMail:this.state.enteredEmail,
        pwd:this.state.enteredPassword,
      }).then((res) =>{
        if(res.status === 200){
          window.sessionStorage.setItem("eMail",e.eMail);
          window.sessionStorage.setItem("pwd",e.pwd)
          if(res.data[0].makeAdmin === 1){
            this.setState({
              isAdmin:true,
              showDetails:false
            })
          }else{
            this.setState({
              isAdmin:false,
              errorMessage:"",
              showDetails:false
            })
          }
        }
      }).catch((err) => {
        console.log(err.response.data)
        this.setState({
          errorMessage:err.response.data,
          showDetails:true
        })
      })
      }else{
        console.log(this.state.enteredEmail,this.state.eMailError,this.state.emailValid,this.state.enteredEmail,'')
    
      }
      console.log(this.state.enteredPassword,this.state.passwordError,this.state.passwordValid,this.state.enteredPassword)
    })


      }
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
  layout="vertical" onFinish={this.onFinish}>
  <Form.Item label="E-Mail">
    <Form.Item name="eMail"><Input type="email" placeholder='Enter your e-mail' size="large"/></Form.Item>
    <p style={{color:"red",marginBottom:"0"}}>{this.state.eMailError}</p>
  </Form.Item>
  <Form.Item label="Password">
    <Form.Item name="pwd"><Input.Password  placeholder='Enter your password' size="large"/></Form.Item>
    <p style={{color:"red",marginBottom:"0"}}>{this.state.passwordError}</p>
  </Form.Item>
  <Form.Item>
    <Button type="primary" htmlType='submit' style={{marginRight:".3rem"}}>Log in</Button>
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