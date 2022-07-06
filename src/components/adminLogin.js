import React, { Component } from "react";
import axios from "axios";

import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
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
    searchedText:"",
    searchedColumn:"",
    searchInput: "",
    selectedKeys:"",
    sortedInfo:"",
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

handleLogout = () => {
  window.sessionStorage.clear()
}

handleSearch = (selectedKeys, confirm, dataIndex) => {
  confirm({ closeDropdown: false });
  this.setState({
      searchedText: selectedKeys[0],
      searchedColumn: dataIndex,
  },() => console.log)
}

handleReset = (clearFilters) => {
  clearFilters(); 
  this.setState({
    searchedText:""
  });
};
  
getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm,clearFilters}) => (
        <div style={{ padding: 8 }}>
            <Input
                ref={node => {
                    this.searchInput = node;
                }}
                placeholder={`Search ${dataIndex}`}
                value={selectedKeys[0]}
                onChange={e => {
                    setSelectedKeys(e.target.value ? [e.target.value] : []);
                    this.handleSearch(selectedKeys, confirm, dataIndex);
                }
                }
                style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
             <Button
                      onClick={() => {
                        this.handleSearch(selectedKeys, confirm, dataIndex)
                      }}
                      type="primary"
                    >
                      Search
                    </Button>
                    <Button
                      onClick={() => {
                        clearFilters && this.handleReset(clearFilters);
                      }}
                      type="danger"
                    >
                      Reset
                    </Button>
                    <Button
                      onClick={() => {
                        confirm({closeDropdown: true})
                        this.setState({
                          searchedText:selectedKeys[0],
                          searchedColumn:dataIndex
                        })
                      }}
                      type="link"
                    >
                      Filter
                    </Button>
        </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
        record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
        if (visible) {
            setTimeout(() => this.searchInput.select());
        }
    },
    render: text =>
        this.state.searchedColumn === dataIndex ? (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[this.state.searchedText]}
                autoEscape
                textToHighlight={text ? text.toString() : ''}
            />
        ) : (
                text
            ),
});
    render(){
      if (this.state.isDataFetched){
        const data = this.state.dataFetched.map((eachUser) => {
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
              sorter: (a, b) => a.name.localeCompare(b.name),
              ...this.getColumnSearchProps('name')
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
              },
              sorter:(a,b) => a.age - b.age
              


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
              },
              sorter:(a,b) => a.mobileNumber - b.mobileNumber
              
          },
          {
            title:"E-Mail",
             dataIndex:"eMail",
              key:"email",
              ...this.getColumnSearchProps('eMail'),
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
              console.log(value,record)
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
            },
            sorter: (a, b) => a.makeAdmin-(b.makeAdmin),
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
          <Link to = '/'><Button onClick = {this.handleLogout} style= {{marginTop:"10px"}} type="primary">Logout</Button></Link>
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
  <label>Admin: </label>
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
        return(<h1>Getting users data. Hold on!!!</h1>)
      }
    }
}

export default AdminLogin;