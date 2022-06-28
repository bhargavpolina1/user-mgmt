import {
    Button,
    Col,
    Form,
    Input,
    Row
  } from 'antd';
  import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import validator from "validator";
  
  class SignUp extends Component {
    state = {
      enteredName:"",
      enteredAge:"",
      enteredMobileNumber:"",
      enteredEmail:"",
      enteredPassword:"",
      confirmPassword:"",
      successMessage:"",
      modalNeeded:false,
      nameError:"",
      ageError:"",
      mobileNumberError:"",
      eMailError:"",
      passwordError:"",
      enteredPasswordError:"",
      confirmPasswordError:"",
      photo:"",
      photoName:"",
      photoSize:"",
      isDisabled: false,
      nameObtained: false,
      ageObtained: false,
      mobileNumberObtained: false,
      eMailObtained: false,
      passwordMetRules: false,
      passwordsMatched: false,

    }

  validateFields = (
    enteredName,
    enteredAge,
    enteredMobileNumber,
    enteredEmail,
    enteredPassword,
    confirmPassword
  ) => {

    console.log("Validation initiated")
    let validName = validator.isAlpha(enteredName);

    let stateToUpdate = {};
    if (!validName) {
      stateToUpdate.nameError =
        "*Enter a valid name. It should contain only alphabets";
    } else {
      stateToUpdate.enteredName = enteredName;
      stateToUpdate.nameObtained = true;
      stateToUpdate.nameError = "";
    }


    let isValidAge = validator.isNumeric(enteredAge);
    if (!isValidAge) {
      stateToUpdate.ageError =
        "*Enter a valid age. It should contain only numbers";
    } else {
      stateToUpdate.age = enteredAge;
      stateToUpdate.ageError = "";
      stateToUpdate.ageObtained = true;
    }
    let isValidMobileNumber = validator.isMobilePhone(
        enteredMobileNumber,
        ["en-IN"]
      )

      if (!isValidMobileNumber) {
        stateToUpdate.mobileNumberError =
          "*Enter a valid mobile number. It should contain 10 digits";
      } else {
        stateToUpdate.enteredMobileNumber = enteredMobileNumber;
        stateToUpdate.mobileNumberError = "";
        stateToUpdate.mobileNumberObtained = true;
      }

      if (!isValidAge) {
        stateToUpdate.ageError =
          "*Enter a valid age. It should contain only numbers";
      } else {
        stateToUpdate.age = enteredAge;
        stateToUpdate.ageError = "";
        stateToUpdate.ageObtained = true;
      }

    let isValidEmail = validator.isEmail(enteredEmail);
    if (!isValidEmail) {
      stateToUpdate.eMailError = "*Enter a valid mail id";
    } else {
      stateToUpdate.eMail = enteredEmail;
      stateToUpdate.eMailError = "";
      stateToUpdate.eMailObtained = true;
    }

    let isValidPassword = validator.isStrongPassword(enteredPassword);
    if (!isValidPassword) {
      stateToUpdate.passwordError = "*Entered password didn't meet requirement";
    } else {
      stateToUpdate.enteredPassword = enteredPassword;
      stateToUpdate.passwordError = "";
      stateToUpdate.passwordMetRules = true;
    }

    let didPasswordsMatch =
      enteredPassword !== "" &&
      confirmPassword !== "" &&
      enteredPassword === confirmPassword;
    if (!didPasswordsMatch) {
      stateToUpdate.confirmPasswordError =
        "*Passwords didn't match. Enter same passwords";
    } else {
      stateToUpdate.confirmPassword = confirmPassword;
      stateToUpdate.confirmPasswordError = "";
      stateToUpdate.passwordsMatched = true;
    }

    this.setState(stateToUpdate)

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

    convertBase64 = (file) => {

      return new Promise((resolve,reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
          resolve(fileReader.result)
        }

        fileReader.onerror = (error) => {
          reject(error)
        }
      })

    }

    handleFileUpload = async(event) => {
      console.log(event.target.files);
      const file = event.target.files[0];
      const base64=await this.convertBase64(file);
      this.setState({
        photo:base64
      },() =>console.log(this.state.photo))
      
      // this.setState({
      //   photo:event.target.files["0"],
      // },() => console.log(this.state.photo))
    }

    handleNewUser = (e) => {
      e.preventDefault();
      this.validateFields(this.state.enteredName,
          this.state.enteredAge,
          this.state.enteredMobileNumber,
          this.state.enteredEmail,
          this.state.enteredPassword,
          this.state.confirmPassword)

      if (this.state.nameObtained && this.state.ageObtained && this.state.eMailObtained && this.state.mobileNumberObtained && this.state.passwordMetRules && this.state.passwordMetRules){
        axios.post('http://localhost:8080/api/users/',{
        name:this.state.enteredName,
        age:this.state.enteredAge,
        mobileNumber:this.state.enteredMobileNumber,
        eMail:this.state.enteredEmail,
        pwd:this.state.confirmPassword,
        photo:this.state.photo
      },{
        headers: {
          "Content-Type": "multipart/form-data"
        }
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
    }
  render(){
    return (
        <div>
            <h1> Enter your details below to join us</h1>
            <Row justify="center">
                <Col>
                <Form method="post" encType="multipart/form-data"
        labelCol={{
          span: 16,
        }}
        wrapperCol={{
          span: 24,
        }}
        layout="vertical">
        <Form.Item label="Name" >
          <Input value={this.state.enteredName} onChange={this.onNameChange} placeholder='Enter your name' size="large"/>
          <p style={{color:"red",marginBottom:"0"}}>{this.state.nameError}</p>
        </Form.Item>
        <Form.Item label="Age">
          <Input value={this.state.enteredAge} onChange={this.onAgeChange} placeholder='Enter your age' size="large"/>
          <p style={{color:"red",marginBottom:"0"}}>{this.state.ageError}</p>
        </Form.Item>    
        <Form.Item label="Mobile Number">
          <Input value={this.state.enteredMobileNumber} onChange={this.onMobileChange} placeholder='Enter your mobile number' size="large"/>
          <p style={{color:"red",marginBottom:"0"}}>{this.state.mobileNumberError}</p>
        </Form.Item>
        <Form.Item label="E-Mail">
          <Input value={this.state.enteredEmail} onChange={this.onEMailChange} type = "email" placeholder='Enter your e-mail' size="large"/>
          <p style={{color:"red",marginBottom:"0"}}>{this.state.eMailError}</p>
        </Form.Item>
        <Form.Item label="Password">
          <Input value={this.state.enteredPassword} onChange={this.onPasswordChange} type = "password" placeholder='Enter your password' size="large"/>
          <p style={{color:"red",marginBottom:"0"}}>{this.state.passwordError}</p>
        </Form.Item>
        <Form.Item label="Re-enter Password">
          <Input value={this.state.confirmPassword} onChange={this.onConfirmPasswordChange} type = "password" placeholder='Re-enter your password' size="large"/>
          <p style={{color:"red",marginBottom:"0"}}>{this.state.confirmPasswordError}</p>
        </Form.Item>
        <Form.Item label="Photo">
          <Input type="file" onChange={this.handleFileUpload} size="large"/>
        </Form.Item>
        <Form.Item>
          <Button type="submit" style={{marginRight:".3rem"}} onClick = {this.handleNewUser}>Submit</Button>
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