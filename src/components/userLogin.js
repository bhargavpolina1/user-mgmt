import React,{Component} from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";

class UserLogin extends Component {

    state={
        isDataFetched:false,
        newsData:"",

    }

    componentDidMount(){
        axios.get("https://newsapi.org/v2/top-headlines?country=in&apiKey=3d5a6f221fdc49908694f2b2d34fdc25")
        .then((res) =>{
            this.setState({
                isDataFetched:true,
                newsData:res.data.articles
            },() =>console.log(this.state.newsData))

        }).catch((err) => console.log(err))
    }

    handleLogout = () => {
        window.sessionStorage.clear()

    }
    render(){
        return(
        <div>
            <div style= {{display:"flex",justifyContent:"space-around"}}>
                <h1>Welcome User</h1>
                <Link to = '/'><Button style= {{marginTop:"10px"}} onClick = {this.handleLogout} type="primary">Logout</Button></Link>
            </div>
            {this.state.isDataFetched?<div style={{display:"flex",flexDirection:"column",justifyContent:"row",width:"100vw"}}>
                <h1>Latest News</h1>
                {this.state.newsData.map((eachNews) => {
                    return(
                        <div style={{borderStyle:"solid",borderRadius:"1px",margin:"10px",width:"80%",alignSelf:"center"}}>
                            <h3>{eachNews.title}</h3>
                            <p style={{marginBottom:"0"}}>{eachNews.description}</p>
                            <p style={{marginBottom:"0"}}>Author: {eachNews.author} </p>
                            <p style={{marginBottom:"0"}}>source: {eachNews.source.name? eachNews.source.name:"NA"}</p>
                            <img style={{width:"200px"}} src = {eachNews.urlToImage} alt = "img"/>
                            <a rel="noreferrer" style={{display:"block"}} target="_blank" href={eachNews.url}>Read More</a>
                        </div>
                        
                    )
                })
                }
                
            </div>:<h1>Data Fetching</h1>}
        </div>
        )
            
        

    }
}

export default UserLogin;