

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
import papa from "papaparse";
import { CSVLink } from 'react-csv';

const headers =[
{
  label:'name',key:'name'
},
{
  label:'age',key:'age'
},
{
  label:"mobileNumber",key:"mobileNumber"
},
{
  label:"eMail",key:"eMail"
},
{
  label:"pwd",key:"pwd"
},
{
  label:"errorMessage",key:"errorMessage"
}
]


  class UserDetails extends Component {

    state = {
      enteredName:"",
      enteredAge:"",
      enteredMobileNumber:"",
      enteredEmail:"",
      enteredPassword:"",
      confirmPassword:"",
      photo:"",
      obtainedJson:[],
      successMessage:"",
      modalNeeded:false,
      nameError:"",
      ageError:"",
      mobileNumberError:"",
      eMailError:"",
      passwordError:"",
      enteredPasswordError:"",
      confirmPasswordError:"",
      photoAdded:"",
      photoError:"",
      errorEntries:[],
      isDisabled: false,
      nameObtained: false,
      ageObtained: false,
      mobileNumberObtained: false,
      eMailObtained: false,
      passwordMetRules: false,
      passwordsMatched: false,
      errorMessage:"",
      bulkUploadError:"",
      csvDetails:[],
      errorInBulkUpload:false,
      bulkUploadSuccess:"",
      bulkUploadFileTypeError:"",
      successfulUsers:0,
      addBulkDisabled:true

    }
  obtainedJson = "";
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

    this.setState(stateToUpdate,() => {
      if (this.state.nameObtained && this.state.ageObtained && this.state.eMailObtained && this.state.mobileNumberObtained && this.state.passwordMetRules && this.state.passwordsMatched && this.state.photoError === ""){
        axios.post('http://localhost:8080/api/users/',{
        name:this.state.enteredName,
        age:this.state.enteredAge,
        mobileNumber:this.state.enteredMobileNumber,
        eMail:this.state.enteredEmail,
        pwd:this.state.confirmPassword,
        photo:this.state.photo

      }).then((res) =>{
        console.log(res)
        if(res.status === 200){
          this.setState({
            isDisabled:true,
            successMessage:"User added successfully",
            errorMessage:""
          })
        }else{
          this.setState({
            errorMessage:"Error while adding user",
            successMessage:""
          })
        }
      }).catch((err) => {
        console.log(err)
        this.setState({
          successMessage:"",
          errorMessage: err.response.data.errorMessage

        })
      })
      }
    })

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
    handleMultipleUSerAddition = () => {
      console.log("Trying to add multiple");
      this.setState({
        modalNeeded:true
      })
    }

    handleBulkUpload = () => {
      console.log("Upload clicked")
    }
    


    handleFiles = (event) => {

    const reqFile = event.target.files[0];
    console.log(reqFile)

    if (reqFile === undefined){
      this.setState({
        addBulkDisabled:true
      })
    }

    if(reqFile.type === "text/csv"){
      
    const self = this;
    papa.parse(reqFile, {
      header:true,
      dynamicTyping:true,
      skipEmptyLines:true,
      preview:1000,
      complete(result){
      this.obtainedJson = result.data;
      self.setState({obtainedJson:result.data,bulkUploadFileTypeError:"",addBulkDisabled:false},() => console.log(self.state.obtainedJson))
    }
    })

    }else{
      this.setState({bulkUploadFileTypeError:"Invalid file type. Select a csv file",addBulkDisabled:true},() => console.log(this.state.bulkUploadFileTypeError))

    }
    }
    postData = async() => {
      const allErrorEntries = []
      console.log("upload initiated")
       if(this.state.obtainedJson) {
        console.log(this.state.obtainedJson)
        console.log("Inside post data");
        for(let i = 0;i<this.state.obtainedJson.length;i++){
         await axios.post('http://localhost:8080/api/users/',{
            name:this.state.obtainedJson[i].name,
            age:this.state.obtainedJson[i].age,
            mobileNumber:this.state.obtainedJson[i].mobileNumber,
            eMail:this.state.obtainedJson[i].eMail,
            pwd:this.state.obtainedJson[i].pwd,
            photo:this.state.obtainedJson[i].photo
            }).then((res) =>{
               console.log(res)
             if(res.status === 200){
              this.setState({
                successfulUsers:this.state.successfulUsers+1
              })

                console.log("User added from CSV data")
              }
             
             }).catch((err) => {
              let errorEntry = this.state.obtainedJson[i];
              console.log(errorEntry)
              errorEntry["errorMessage"] = err.response.data.message;
              allErrorEntries.push(errorEntry)
               })
        }
        this.setState({errorEntries:allErrorEntries},() => {
          console.log(this.state.errorEntries.length)
          if(this.state.errorEntries.length !== 0){
            const csvReport = {
              filename:"userswitherrors.csv",
              headers:headers,
              data:this.state.errorEntries
            }
            this.setState({
              csvDetails:csvReport,
              errorInBulkUpload:true,
              bulkUploadSuccess:"",
              addBulkDisabled:true,
              bulkUploadError:`Error in details of ${csvReport.data.length} user(s). Correct and retry`
            })
          }else{
            this.setState({ 
              csvDetails:[],
              errorInBulkUpload:false,
              bulkUploadSuccess:`${this.state.successfulUsers} user(s) added successfully.`,
              bulkUploadError:"",
              addBulkDisabled:true
            })
          }
        })
      }
          }

    handleNewUser = () => {
      this.validateFields(this.state.enteredName,
          this.state.enteredAge,
          this.state.enteredMobileNumber,
          this.state.enteredEmail,
          this.state.enteredPassword,
          this.state.confirmPassword)
    }
    
  render(){
    return (
        <div>
            <div>
            <h1>Add bulk users</h1>
          <div>
            <Input type="file" style = {{margin:"10px",width:"30vw"}} onChange={this.handleFiles} size="medium"/>
            <p style ={{color:"red",marginBottom:"0"}}>{this.state.bulkUploadFileTypeError}</p>
            <Button type='primary' disabled ={this.state.addBulkDisabled} onClick = {this.postData} style={{margin:"10px"}}>Upload</Button>
            {this.state.errorInBulkUpload?<Button style={{margin:"10px"}} type = 'primary'><CSVLink {...this.state.csvDetails}>Click to download the users with errors</CSVLink></Button>:null}
            <p style ={{color:"green",marginBottom:"0"}}>{this.state.bulkUploadSuccess}</p>
            <p style ={{color:"red",marginBottom:"0"}}>{this.state.bulkUploadError}</p>
          </div>
            </div>
            <h1> Enter the details of the user below</h1>
            <Row justify="center">
                <Col>
                <div>
                <Form
        labelCol={{
          span: 16,
        }}
        wrapperCol={{
          span: 24,
        }}
        layout="vertical">
        <div style = {{display:"flex"}}>
          <div style = {{margin:"10px",width:"30vw"}}>
          <Form.Item label="Name" >
          <Input value = {this.state.enteredName} onChange = {this.onNameChange} placeholder='Enter the name' size="small"/>
          <p style ={{color:"red",marginBottom:"0"}}>{this.state.nameError}</p>
        </Form.Item>
          </div>
          <div style = {{margin:"10px",width:"30vw"}}>
          <Form.Item label="Age">
          <Input type = "number" value = {this.state.enteredAge} onChange = {this.onAgeChange} placeholder='Enter the age' size="small"/>
          <p style ={{color:"red",marginBottom:"0"}}>{this.state.ageError}</p>
          </Form.Item>      
          </div>  
        </div>
        <div style = {{display:"flex"}}>
          <div style = {{margin:"10px",width:"30vw"}}>
          <Form.Item label="Mobile Number">
          <Input type = "number" value = {this.state.enteredMobileNumber} onChange = {this.onMobileChange} placeholder="Enter the mobile number" size="small"/>
          <p style ={{color:"red",marginBottom:"0"}}>{this.state.mobileNumberError}</p>
        </Form.Item>
          </div>
          <div style = {{margin:"10px",width:"30vw"}}>
          <Form.Item label="Email">
          <Input placeholder='Enter the e-mail' value = {this.state.enteredEmail} onChange = {this.onEMailChange} type="email" size="small"/>
          <p style ={{color:"red",marginBottom:"0"}}>{this.state.eMailError}</p>
          </Form.Item>
          </div>
        </div>
        <div style = {{display:"flex"}}>
          <div style = {{margin:"10px",width:"30vw"}}>
          <Form.Item label="Password">
          <Input type = "password" value = {this.state.enteredPassword} onChange = {this.onPasswordChange} placeholder='Enter the password' size="small"/>
          <p style ={{color:"red",marginBottom:"0"}}>{this.state.passwordError}</p>
        </Form.Item>
          </div>
          <div style = {{margin:"10px",width:"30vw"}}>
          <Form.Item label="Re-enter Password">
          <Input type = "password" value = {this.state.confirmPassword} onChange = {this.onConfirmPasswordChange} placeholder='Re-enter the password' size="small"/>
          <p style ={{color:"red",marginBottom:"0"}}>{this.state.confirmPasswordError}</p>
        </Form.Item>
          </div>
        </div>
        <Form.Item label="Photo" style = {{margin:"10px"}}>
          <Input type="file" onChange={this.handleFileUpload} size="medium"/>
          <p style ={{color:"red",marginBottom:"0"}}>{this.state.photoError}</p>
        </Form.Item>
        <Form.Item>
          <Button disabled = {this.state.isDisabled} type="primary" onClick = {this.handleNewUser} style = {{marginRight:"0.3rem"}}>Submit</Button>
          <Link to = "/admin/userdetails">
          <Button type = "primary">Back</Button>
          </Link>
        </Form.Item>
      </Form>
    </div>
       <h1 style={{color:"green",marginBottom:"0"}}>{this.state.successMessage}</h1>
       <p>{this.state.errorMessage}</p>
      </Col>
    </Row>
        </div>
    )
  }
   ;
  };
  
  export default UserDetails;