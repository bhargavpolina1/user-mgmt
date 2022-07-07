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
import baseUrl from './url';
  
  class SignUp extends Component {
    state = {
      successMessage:"",
      errorMessage:"",
      modalNeeded:false,
      nameError:"",
      ageError:"",
      mobileNumberError:"",
      eMailError:"",
      passwordError:"",
      enteredPasswordError:"",
      confirmPasswordError:"",
      photo:"",
      photoError:"",
      isDisabled: false,
      nameObtained: false,
      ageObtained: false,
      mobileNumberObtained: false,
      eMailObtained: false,
      passwordMetRules: false,
      passwordsMatched: false,
      allDetailsToPostArr:[]
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
      const imageType = /image.*/
      console.log(event.target.files);
      const file = event.target.files[0];
      if (file.type.match(imageType)) {
        const base64=await this.convertBase64(file);
      this.setState({
        photo:base64,
        photoError:"",
      },() =>console.log(this.state.photo))
      }else{
        this.setState({
          photo:"",
          photoError:"Image type not valid"
        })
      }
      
    }

    onFinish = (e) => {
      console.log(e)

      if(e.name === undefined || e.age === undefined || e.eMail === undefined || e.mobileNumber === undefined || e.password === undefined || e.confirmPassword === undefined){
        this.setState({
          errorMessage:"Enter all fields to initiate validation"
        })
      }

      else{
        this.setState({
          errorMessage:""
        })
        let stateToUpdate = {};

    let validName = validator.isAlpha(e.name);
    if (!validName) {
      stateToUpdate.nameError =
        "*Enter a valid name. It should contain only alphabets";
    } else {
      stateToUpdate.nameObtained = true;
      stateToUpdate.nameError = "";
    }


    let isValidAge = validator.isNumeric(e.age) && e.age<=60;
    if (!isValidAge) {
      stateToUpdate.ageError =
        "*Enter a valid age. It should contain only numbers and should be less than or equal to 60";
    } else {
      stateToUpdate.ageError = "";
      stateToUpdate.ageObtained = true;
    }
    let isValidMobileNumber = validator.isMobilePhone(
      e.mobileNumber,
      ["en-IN"]
    )

      if (!isValidMobileNumber) {
        stateToUpdate.mobileNumberError =
          "*Enter a valid mobile number. It should contain 10 digits";
      } else {
        stateToUpdate.mobileNumberError = "";
        stateToUpdate.mobileNumberObtained = true;
      }

    let isValidEmail = validator.isEmail(e.eMail);
    if (!isValidEmail) {
      stateToUpdate.eMailError = "*Enter a valid mail id";
    } else {
      stateToUpdate.eMailError = "";
      stateToUpdate.eMailObtained = true;
    }

    let isValidPassword = validator.isStrongPassword(e.password);
    if (!isValidPassword) {
      stateToUpdate.passwordError = "*Entered password didn't meet requirement";
    } else {
      stateToUpdate.passwordError = "";
      stateToUpdate.passwordMetRules = true;
    }

    let didPasswordsMatch =
    e.password !== "" &&
      e.confirmPassword !== "" &&
      e.password === e.confirmPassword;
    if (!didPasswordsMatch) {
      stateToUpdate.confirmPasswordError =
        "*Passwords didn't match. Enter same passwords";
    } else {
      stateToUpdate.confirmPasswordError = "";
      stateToUpdate.passwordsMatched = true;
    }


    

    this.setState(stateToUpdate,() => {
      if (this.state.nameObtained && this.state.ageObtained && this.state.eMailObtained && this.state.mobileNumberObtained && this.state.passwordMetRules && this.state.passwordsMatched& this.state.photoError === ""){
        const allDetails = {};
        const allDetailsArr = [];
        allDetails.name = e.name;
        allDetails.age = e.age;
        allDetails.mobileNumber = e.mobileNumber;
        allDetails.eMail = e.eMail;
        allDetails.pwd = e.confirmPassword;
        allDetails.photo = this.state.photo;
        allDetailsArr.push(allDetails)
        this.setState({
          allDetailsToPostArr:allDetailsArr
        },() => {
          axios.post(baseUrl,{
            usersObject:this.state.allDetailsToPostArr
          }).then((res) =>{
            console.log(res)
            if(res.status === 200){
              this.setState({
                isDisabled: true,
                successMessage:"Account created sucessfully. Thank you for joining us!!!",
                errorMessage:""
              })
            }else{
              this.setState({
                successMessage:"",
              })
            }
          }).catch((err) => console.log(err))

        })

      }
    })

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
        layout="vertical" onFinish={this.onFinish}>
          <div>
          <div style = {{display:"flex"}}>
            <div style = {{margin:"10px",width:"30vw"}}>
              <Form.Item label="Name">
                <Form.Item name="name"><Input placeholder='Enter your name' size="small"/></Form.Item>
                <p style={{color:"red",marginBottom:"0"}}>{this.state.nameError}</p>
              </Form.Item>
            </div>
            <div style = {{margin:"10px",width:"30vw"}}>
            <Form.Item label="Age">
            <Form.Item name = "age"><Input placeholder='Enter your age' size="small"/></Form.Item>
              <p style={{color:"red",marginBottom:"0"}}>{this.state.ageError}</p>
            </Form.Item>
            </div>
          </div>  
          <div style = {{display:"flex"}}>
            <div style = {{margin:"10px",width:"30vw"}}>
            <Form.Item label="Mobile Number">
            <Form.Item name="mobileNumber"><Input placeholder='Enter your mobile number' size="small"/></Form.Item>
            <p style={{color:"red",marginBottom:"0"}}>{this.state.mobileNumberError}</p>
            </Form.Item>
            </div>
            <div style = {{margin:"10px",width:"30vw"}}>
            <Form.Item label="E-Mail">
            <Form.Item name ="eMail"><Input type = "email" placeholder='Enter your e-mail' size="small"/></Form.Item>
            <p style={{color:"red",marginBottom:"0"}}>{this.state.eMailError}</p>
             </Form.Item>
            </div>
            </div>
            <div style = {{display:"flex"}}>
            <div style = {{margin:"10px",width:"30vw"}}>
            <Form.Item label="Password">
            <Form.Item name = "password"><Input.Password type = "password" placeholder='Enter your password' size="small"/></Form.Item>
              <p style={{color:"red",marginBottom:"0"}}>{this.state.passwordError}</p>
            </Form.Item>
            </div>
            <div style = {{margin:"10px",width:"30vw"}}>
            <Form.Item label="Re-enter Password">
            <Form.Item name = "confirmPassword"><Input.Password placeholder='Re-enter your password' size="small"/></Form.Item>
              <p style={{color:"red",marginBottom:"0"}}>{this.state.confirmPasswordError}</p>
            </Form.Item>
            </div>
            </div>
          </div>
        <Form.Item label="Photo">
        <Form.Item name = "photo"><Input type="file" onChange={this.handleFileUpload} size="medium"/></Form.Item>
          <p style={{color:"red",marginBottom:"0"}}>{this.state.photoError}</p>
        </Form.Item>
        <Form.Item>
          <Button disabled = {this.state.isDisabled} htmlType="submit" type="primary" style={{marginRight:".3rem"}}>Submit</Button>
          <Link to = '/'><Button type='primary'>Back</Button></Link>
        </Form.Item>
       </Form>
       <h3 style={{color:"red",marginBottom:"0"}}>{this.state.errorMessage}</h3>
       <h3 style={{color:"green",marginBottom:"0"}}>{this.state.successMessage}</h3>
      </Col>
    </Row>
        </div>
    )
  }
   ;
  };
  
  export default SignUp;