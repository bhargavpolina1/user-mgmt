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
      name:"",
      age:"",
      mobileNumber:"",
      eMail:"",
      password:"",
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
  validateFields = (
    name,
    age,
    mobileNumber,
    eMail,
    password,
    confirmPassword
  ) => {

    console.log("Validation initiated");
    let stateToUpdate = {};

    let validName = validator.isAlpha(name);
    if (!validName) {
      stateToUpdate.nameError =
        "*Enter a valid name. It should contain only alphabets";
    } else {
      stateToUpdate.name = name;
      stateToUpdate.nameObtained = true;
      stateToUpdate.nameError = "";
    }


    let isValidAge = validator.isNumeric(age);
    if (!isValidAge) {
      stateToUpdate.ageError =
        "*Enter a valid age. It should contain only numbers";
    } else {
      stateToUpdate.age = age;
      stateToUpdate.ageError = "";
      stateToUpdate.ageObtained = true;
    }
    let isValidMobileNumber = validator.isMobilePhone(
      mobileNumber,
      ["en-IN"]
    )

      if (!isValidMobileNumber) {
        stateToUpdate.mobileNumberError =
          "*Enter a valid mobile number. It should contain 10 digits";
      } else {
        stateToUpdate.mobileNumber = mobileNumber;
        stateToUpdate.mobileNumberError = "";
        stateToUpdate.mobileNumberObtained = true;
      }

      if (!isValidAge) {
        stateToUpdate.ageError =
          "*Enter a valid age. It should contain only numbers";
      } else {
        stateToUpdate.age = age;
        stateToUpdate.ageError = "";
        stateToUpdate.ageObtained = true;
      }

    let isValidEmail = validator.isEmail(eMail);
    if (!isValidEmail) {
      stateToUpdate.eMailError = "*Enter a valid mail id";
    } else {
      stateToUpdate.eMail = eMail;
      stateToUpdate.eMailError = "";
      stateToUpdate.eMailObtained = true;
    }

    let isValidPassword = validator.isStrongPassword(password);
    if (!isValidPassword) {
      stateToUpdate.passwordError = "*Entered password didn't meet requirement";
    } else {
      stateToUpdate.password = password;
      stateToUpdate.passwordError = "";
      stateToUpdate.passwordMetRules = true;
    }

    let didPasswordsMatch =
    password !== "" &&
      confirmPassword !== "" &&
      password === confirmPassword;
    if (!didPasswordsMatch) {
      stateToUpdate.confirmPasswordError =
        "*Passwords didn't match. Enter same passwords";
    } else {
      stateToUpdate.confirmPassword = confirmPassword;
      stateToUpdate.confirmPasswordError = "";
      stateToUpdate.passwordsMatched = true;
    }

    this.setState(stateToUpdate,() => {
      if (this.state.nameObtained && this.state.ageObtained && this.state.eMailObtained && this.state.mobileNumberObtained && this.state.passwordMetRules && this.state.passwordsMatched& this.state.photoError === ""){
        const allDetails = {};
        const allDetailsArr = [];
        allDetails.name = this.state.name;
        allDetails.age = this.state.age;
        allDetails.mobileNumber = this.state.mobileNumber;
        allDetails.eMail = this.state.eMail;
        allDetails.pwd = this.state.confirmPassword;
        allDetails.photo = this.state.photo;
        allDetailsArr.push(allDetails)
        this.setState({
          allDetailsToPostArr:allDetailsArr
        },() => {
          axios.post('http://localhost:8080/api/users/',{
            usersObject:this.state.allDetailsToPostArr
          }).then((res) =>{
            console.log(res)
            if(res.status === 200){
              this.setState({
                isDisabled: true,
                successMessage:"Account created sucessfully. Thank you for joining us!!!"
              })
            }else{
              this.setState({
                successMessage:""
              })
            }
          }).catch((err) => console.log(err))

        })

      }
    })
  }

    onNameChange =(event)=> {
      this.setState({
        name: event.target.value
      },() => console.log(this.state.name))
    }
    
    onAgeChange = (event)=> {
      this.setState({
        age:event.target.value
      },() => console.log(this.state.age))
    }
    
    onMobileChange = (event) => {
      this.setState({
        mobileNumber:event.target.value
      },() => console.log(this.state.mobileNumber))
    }
    
    onEMailChange = (event) => {
      this.setState({
        eMail:event.target.value
      },() => console.log(this.state.eMail))
    }
    onPasswordChange = (event) => {
      this.setState({
        password:event.target.value
      },() => console.log(this.state.password))
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

    handleNewUser = (e) => {
      e.preventDefault();
      this.validateFields(this.state.name,
          this.state.age,
          this.state.mobileNumber,
          this.state.eMail,
          this.state.password,
          this.state.confirmPassword)
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
          <div>
          <div style = {{display:"flex"}}>
            <div style = {{margin:"10px",width:"30vw"}}>
              <Form.Item label="Name">
                <Input value={this.state.name} onChange={this.onNameChange} placeholder='Enter your name' size="small"/>
                <p style={{color:"red",marginBottom:"0"}}>{this.state.nameError}</p>
              </Form.Item>
            </div>
            <div style = {{margin:"10px",width:"30vw"}}>
            <Form.Item label="Age">
          <Input value={this.state.age} onChange={this.onAgeChange} placeholder='Enter your age' size="small"/>
          <p style={{color:"red",marginBottom:"0"}}>{this.state.ageError}</p>
        </Form.Item> 
            </div>
          </div>  
          <div style = {{display:"flex"}}>
            <div style = {{margin:"10px",width:"30vw"}}>
            <Form.Item label="Mobile Number">
            <Input value={this.state.mobileNumber} onChange={this.onMobileChange} placeholder='Enter your mobile number' size="small"/>
            <p style={{color:"red",marginBottom:"0"}}>{this.state.mobileNumberError}</p>
            </Form.Item>
            </div>
            <div style = {{margin:"10px",width:"30vw"}}>
            <Form.Item label="E-Mail">
            <Input value={this.state.eMail} onChange={this.onEMailChange} type = "email" placeholder='Enter your e-mail' size="small"/>
            <p style={{color:"red",marginBottom:"0"}}>{this.state.eMailError}</p>
             </Form.Item>
            </div>
            </div>
            <div style = {{display:"flex"}}>
            <div style = {{margin:"10px",width:"30vw"}}>
            <Form.Item label="Password">
          <Input value={this.state.password} onChange={this.onPasswordChange} type = "password" placeholder='Enter your password' size="small"/>
          <p style={{color:"red",marginBottom:"0"}}>{this.state.passwordError}</p>
        </Form.Item>
            </div>
            <div style = {{margin:"10px",width:"30vw"}}>
            <Form.Item label="Re-enter Password">
          <Input value={this.state.confirmPassword} onChange={this.onConfirmPasswordChange} type = "password" placeholder='Re-enter your password' size="small"/>
          <p style={{color:"red",marginBottom:"0"}}>{this.state.confirmPasswordError}</p>
        </Form.Item>
            </div>
            </div>
          </div>
        <Form.Item label="Photo">
          <Input type="file" onChange={this.handleFileUpload} size="medium"/>
          <p style={{color:"red",marginBottom:"0"}}>{this.state.photoError}</p>
        </Form.Item>
        <Form.Item>
          <Button disabled = {this.state.isDisabled} type="submit" style={{marginRight:".3rem"}} onClick = {this.handleNewUser}>Submit</Button>
          <Link to = '/'><Button type='primary'>Back</Button></Link>
        </Form.Item>
       </Form>
       <h3 style={{color:"green",marginBottom:"0"}}>{this.state.successMessage}</h3>
      </Col>
    </Row>
        </div>
    )
  }
   ;
  };
  
  export default SignUp;