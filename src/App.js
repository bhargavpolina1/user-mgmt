import 'antd/dist/antd.css';
import UserDetails  from './components/addUser';
import AdminLogin from './components/adminLogin';
import './App.css';
import Home from './components/home';
import SignIn from './components/signIn';
import SignUp from './components/signUp';
import { BrowserRouter,Route,Switch } from 'react-router-dom';

function App() { 
  return (
    <div className="App">
      <BrowserRouter>
      <Switch>
        <Route exact path = "/" component = {Home}/>
        <Route exact path = "/signin" component = {SignIn}/>
        <Route exact path = "/signup" component = {SignUp}/>
        <Route exact path = "/admin/userdetails" component = {AdminLogin}/>
        <Route exact path = "/admin/adduser" component = {UserDetails}/>
      </Switch>
      </BrowserRouter>
      {/* <Home/>
      <SignIn/>
      <SignUp/>
      <UserDetails/>
      <AdminLogin/> */}
    </div>
  );
}

export default App;
