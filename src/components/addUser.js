

import {
    Button,
    Col,
    Form,
    Input,
    Row,Modal
  } from 'antd';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
  
  class UserDetails extends Component {

    state = {
      enteredName:"",
      enteredAge:"",
      enteredMobileNumber:"",
      enteredEmail:"",
      enteredPassword:"",
      confirmPassword:"",
      photo:"",
      successMessage:"",
      modalNeeded:false,
    }

    onNameChange =(event)=> {
      this.setState({
        enteredName: event.target.value
      },() => console.log(this.state.enteredName))
    }
    
    onAgeChange = (event)=> {
      this.setState({
        enteredAge:event.target.value
      },() => console.log(this.state.enteredAge))
    }
    
    onMobileChange = (event) => {
      this.setState({
        enteredMobileNumber:event.target.value
      },() => console.log(this.state.enteredMobileNumber))
    }
    
    onEMailChange = (event) => {
      this.setState({
        enteredEmail:event.target.value
      },() => console.log(this.state.enteredEmail))
    }
    onPasswordChange = (event) => {
      this.setState({
        enteredPassword:event.target.value
      },() => console.log(this.state.enteredPassword))
    }
    onConfirmPasswordChange = (event) => {
      this.setState({
        confirmPassword:event.target.value
      },()=>console.log(this.state.confirmPassword))
    }

    handleMultipleUSerAddition = () => {
      console.log("Trying to add multiple");
      this.setState({
        modalNeeded:true
      })
    }

    handleUpload = () => {
      console.log("Upload clicked")
      this.setState({
        modalNeeded:false
      })
    }
    handleUploadCancel = () => {
      console.log("cancel CSV file upload clicked")
      this.setState({
        modalNeeded:false
      })
    }

    handleNewUser = () => {
      console.log(
        this.state.enteredName,
        this.state.enteredAge,
        this.state.enteredMobileNumber,
        this.state.enteredEmail,
        this.state.enteredPassword,
        this.state.confirmPassword
      )
      axios.post('http://localhost:8080/api/users/',{
        name:this.state.enteredName,
        age:this.state.enteredAge,
        mobileNumber:this.state.enteredMobileNumber,
        eMail:this.state.enteredEmail,
        pwd:this.state.confirmPassword,

      }).then((res) =>{
        console.log(res)
        if(res.status === 200){
          this.setState({
            successMessage:"User added successfully"
          })
        }else{
          this.setState({
            successMessage:"Error while adding user"
          })
        }
      }).catch((err) => console.log(err))
    }


  render(){
    return (
        <div>
          <Modal
          title="Upload CSV file"
          visible={this.state.modalNeeded}
          okText = "Upload"
          onOk={this.handleUpload}
          onCancel={this.handleUploadCancel}>
          <Input type="file"/>
</Modal>
            <h1> Enter the details of the user below</h1>
            <Button type='primary' onClick = {this.handleMultipleUSerAddition}>Add bulk users</Button>
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
          <Input value = {this.state.enteredName} onChange = {this.onNameChange} placeholder='Enter the name' size="large"/>
        </Form.Item>
        <Form.Item label="Age">
          <Input type = "number" value = {this.state.enteredAge} onChange = {this.onAgeChange} placeholder='Enter the age' size="large"/>
        </Form.Item>      
        <Form.Item label="Mobile Number">
          <Input type = "number" value = {this.state.enteredMobileNumber} onChange = {this.onMobileChange} placeholder="Enter the mobile number" size="large"/>
        </Form.Item>
        <Form.Item label="Email">
          <Input placeholder='Enter the e-mail' value = {this.state.enteredEmail} onChange = {this.onEMailChange} type="email" size="large"/>
        </Form.Item>
        <Form.Item label="Password">
          <Input type = "password" value = {this.state.enteredPassword} onChange = {this.onPasswordChange} placeholder='Enter the password' size="large"/>
        </Form.Item>
        <Form.Item label="Re-enter Password">
          <Input type = "password" value = {this.state.confirmPassword} onChange = {this.onConfirmPasswordChange} placeholder='Re-enter the password' size="large"/>
        </Form.Item>
        <Form.Item label="Photo">
          <Input type="file" size="large"/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick = {this.handleNewUser} style = {{marginRight:"0.3rem"}}>Submit</Button>
          <Link to = "/admin/userdetails">
          <Button type = "primary">Back</Button>
          </Link>
        </Form.Item>
       </Form>
       <p>{this.state.successMessage}</p>
      </Col>
    </Row>
        </div>
    )
  }
   ;
  };
  
  export default UserDetails;