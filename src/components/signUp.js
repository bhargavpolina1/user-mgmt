import {
    Button,
    Col,
    Form,
    Input,
    Row
  } from 'antd';
  import React, { Component } from 'react';
import { Link } from 'react-router-dom';
  
  class SignUp extends Component {
  render(){
    return (
        <div>
            <h1> Enter your details below to join us</h1>
            <Row justify="center">
                <Col>
                <Form
        labelCol={{
          span: 16,
        }}
        wrapperCol={{
          span: 24,
        }}
        layout="vertical">
        <Form.Item label="Name" >
          <Input  placeholder='Enter your name' size="large"/>
          <p style={{color:"red",marginBottom:"0"}}></p>
        </Form.Item>
        <Form.Item label="Age">
          <Input placeholder='Enter your age' size="large"/>
          <p style={{color:"red",marginBottom:"0"}}></p>
        </Form.Item>    
        <Form.Item label="Mobile Number">
          <Input placeholder='Enter your mobile number' size="large"/>
          <p style={{color:"red",marginBottom:"0"}}></p>
        </Form.Item>
        <Form.Item label="E-Mail">
          <Input type = "email" placeholder='Enter your e-mail' size="large"/>
          <p style={{color:"red",marginBottom:"0"}}></p>
        </Form.Item>
        <Form.Item label="Password">
          <Input type = "password" placeholder='Enter your password' size="large"/>
          <p style={{color:"red",marginBottom:"0"}}></p>
        </Form.Item>
        <Form.Item label="Re-enter Password">
          <Input type = "password" placeholder='Re-enter your password' size="large"/>
          <p style={{color:"red",marginBottom:"0"}}></p>
        </Form.Item>
        <Form.Item label="Photo">
          <Input type="file" size="large"/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" style={{marginRight:".3rem"}}>Submit</Button>
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
  
  export default SignUp;