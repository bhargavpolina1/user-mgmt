import React, { Component } from "react";
import axios from "axios";


import { Table,Switch,Space,Button,Modal,Input } from 'antd';
import { Link } from "react-router-dom";

class AdminLogin extends Component {


  state = {
    isDataFetched:false,
    dataFetched: "",
    isModelNeedsToPopup:false,
    isDeletModalNeedsToPopup:false,
    deleteitemId:"",
    id:"",
    name:"",
    age:"",
    mobileNumber:"",
    eMail:"",
    makeAdmin:false,
  }

  componentDidMount(){
    console.log("Mount initiated")
    axios
      .get("http://localhost:8080/api/users/")
      .then((res) => {
        console.log(res.data)
        this.setState({
          isDataFetched:true,
          dataFetched:res.data,
        })
  }).catch((err) => console.log(err))
}

showDeleteItemModel = (record) => {
  this.setState({
    isDeletModalNeedsToPopup:true,
    deleteitemId:record.id
  })
}

handleEdit = (record) => {
    this.setState({
      isModelNeedsToPopup:true,
      id:record.id,
      name:record.name,
      age:record.age,
      mobileNumber:record.mobileNumber,
      eMail:record.eMail,
      makeAdmin:record.makeAdmin
    })
  }


handleOk =() => {
  console.log("ok Clicked")
  this.setState({
    isModelNeedsToPopup:false
  },() => {
    axios.put(`http://localhost:8080/api/users/${this.state.id}`, {
    name:this.state.name,
    age:this.state.age,
    mobileNumber:this.state.mobileNumber,
    eMail:this.state.eMail,
    makeAdmin:this.state.makeAdmin
  },() => console.log(this.state.makeAdmin))
  .then(response => {
    console.log(response);
    axios.get("http://localhost:8080/api/users/")
                .then(res => {
                  console.log("Re-fetching data")
                const users = res.data;
                this.setState({
                  dataFetched:users
                },() => console.log(this.state.dataFetched));
            })
  })
  .catch(error => {
    console.log(error);
  });
  })
}

handleCancel =() => {
  console.log("Cancel Clicked")
  this.setState({
    isModelNeedsToPopup:false
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

oneEMailChange = (event) => {
  this.setState({
    eMail:event.target.value
  },() => console.log(this.state.eMail))
}

handleDelete = (id) => {
  console.log(`Delete request received for id:${id}`)
  axios.delete(`http://localhost:8080/api/users/${id}`).then((res) => {
    console.log(res)
    axios.get("http://localhost:8080/api/users/")
                .then(res => {
                  console.log("Re-fetching data")
                const users = res.data;
                this.setState({
                  dataFetched:users
                });
                console.log(this.state.dataFetched);
            })
  }).catch((err) => console.log(err))

}

handleDeleteOk = () => {
  this.handleDelete(this.state.deleteitemId)
  this.setState({
    isDeletModalNeedsToPopup:false
  })
}
handleDeleteCancel = () =>{
  this.setState({
    isDeletModalNeedsToPopup:false
  })
}



handleSwitch = () => {
  this.setState({
    makeAdmin:!this.state.makeAdmin
  },() => console.log(`${this.state.makeAdmin} for ${this.state.id}`))
}
    render(){
      if (this.state.isDataFetched){
        const data = this.state.dataFetched.map((eachUser) => {
          console.log(eachUser.makeAdmin)
          return {
            id:eachUser.id,
            name:eachUser.name,
            age:eachUser.age,
            mobileNumber:eachUser.mobileNumber,
            eMail:eachUser.eMail,
            photo:eachUser.photo,
            makeAdmin:eachUser.makeAdmin
          }
        })

         const columns = [
          {
            title:"Name",
             dataIndex:"name",
              key:"name",
              filters:[
                {text:"Starting with a",value:"a"},
                {text:"starting with v", value:"v"}
              ],
              onFilter:(value,record)=> {
                return record.name.startsWith(value)
              }
          },
          {
            title:"Age",
             dataIndex:"age",
              key:"Age",
              filters:[
                {text:"<= 30 Years",value: 30},
              ],
              onFilter:(value,record) => {
                return record.age <= value
              }
          },
          {
            title:"Mobile",
             dataIndex:"mobileNumber",
              key:"mobileNumber",
              filters:[
                {text:"Starting with 9",value:"9"},
                {text:"starting with 8", value:"8"}
              ],
              onFilter:(value,record)=> {
                console.log(typeof record.mobileNumber)
                const strNumber = record.mobileNumber.toString();

                return strNumber[0] === value;
              }
          },
          {
            title:"E-Mail",
             dataIndex:"eMail",
              key:"email",
              filters:[
                {text:"AOL Mail", value: "@aol.com"},
                {text:"Gmail",value:"@gmail.com"}
              ],
              onFilter:(value,record) => {
                return record.eMail.endsWith(value)
              }
          },
          {
            title:"Photo",
            dataIndex:"photo",
            key:"photo",
            render: (record) => (
              <img src = {record} alt = "" style = {{height:"100px"}}/>
            ),
            filters:[
              {text:"No photo",value: null},
            ],
            onFilter:(value,record) => {
              return record.photo === value
            }
          },
          {
            title:"Is Abmin?",
            dataIndex:"makeAdmin",
            key:"makeadmin",
            render: (record)=><div> {record ? 'Yes':'No'}</div>,
            filters:[
              {text:"Yes",value:true},
              {text:"No",value:false}
            ],
            onFilter:(value,record) => {
              return record.makeAdmin === value
            }
          },
          {
            title:"Action",
                  key: "action",
                  id: "id",
                  render: (record) => (
                    <Space size="middle">
                        <Button type = "primary" onClick={() => this.handleEdit(record)}>Edit</Button>
                        <Button type = "primary" onClick={() => this.showDeleteItemModel(record)}>Delete</Button>
                    </Space>
                  )
                }
        ];

        return(
          <div>
          <div style= {{display:"flex",justifyContent:"space-around"}}>
          <h1> User Details</h1>
          <Link to = '/'><Button style= {{marginTop:"10px"}} type="primary">Logout</Button></Link>
          </div>
          
          <Modal
          title="Edit user details"
          visible={this.state.isModelNeedsToPopup}
          okText = "save"
          onOk={this.handleOk}
          onCancel={this.handleCancel}>
  {" "}
  <label>Name</label>
  <Input value = {this.state.name} onChange = {this.onNameChange}/>
  <label>Age</label>
  <Input  type = "number" value = {this.state.age} onChange = {this.onAgeChange}/>
  <label>Mobile Number</label>
  <Input value = {this.state.mobileNumber} onChange = {this.onMobileChange}/>
  <label>email</label>
  <Input value = {this.state.eMail} onChange = {this.oneEMailChange}/>
  <lable>Admin: </lable>
  <label>No </label><Switch checked = {this.state.makeAdmin} onChange = {this.handleSwitch}/><label> Yes</label>
</Modal>
      <Modal
          title={`Do you want to delete the user?`}
          visible={this.state.isDeletModalNeedsToPopup}
          okText = "Confirm"
          onOk={this.handleDeleteOk}
          onCancel={this.handleDeleteCancel}>
      </Modal>
          <Table columns = {columns} dataSource={data} rowKey={record => record.id}>
        </Table>
        <div> 
          <Link to = "/admin/adduser">
          <Button onClick = {this.handleAdduser} type = "primary" style ={{marginRight:"0.3rem"}}>Add User</Button>
          </Link>
        </div>
      </div>)
      }else{
        return(<h1>Data Fetching</h1>)
      }
    }
}

export default AdminLogin;