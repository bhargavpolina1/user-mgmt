import {
    Button,
    Col,
    Form,
    Input,
    Row
  } from 'antd';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
  
  class SignIn extends Component {

    state = {
      enteredMail:"",
      enteredPassword:""
    }

    handleEmailChange = (event)=> {
      this.setState({
        enteredMail:event.target.value
      },() => console.log(this.state.enteredMail))
    }

    handlePasswordChange = (event)=> {
      this.setState({
        enteredPassword:event.target.value
      },() => console.log(this.state.enteredPassword))
    }

    handleSign = () => {
      console.log("Login clicked")
      console.log(this.state.enteredMail)
      console.log(this.state.enteredPassword)
    }
    
  render(){
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
          <Input type="email" value={this.state.enteredMail} onChange = {this.handleEmailChange} placeholder='Enter your e-mail' size="large"/>
        </Form.Item>
        <Form.Item>
        <Form.Item label="Password">
          <Input  placeholder='Enter your password' onChange={this.handlePasswordChange} value = {this.state.enteredPassword} type = "password" size="large"/>
        </Form.Item>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick = {this.handleSign} style={{marginRight:".3rem"}}>Log in</Button>
          <Link to = '/'><Button type='primary'>Back</Button></Link>
        </Form.Item>
       </Form>
      </Col>
    </Row>

        </div>
    )

  }
   ;
  };
  
  export default SignIn;