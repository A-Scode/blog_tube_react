import {  BrowserRouter as Router ,Route} from 'react-router-dom'
import {CacheSwitch , CacheRoute } from 'react-router-cache-route'
import AppHeader from './componenets/appHeader';
import AppFooter from './componenets/appFooter';
import AppLogin from './componenets/appLogin';
import AppSignup from './componenets/appSignup';
import AppBodyLoading from './componenets/appBodyLoading';
import AppBlogians from './componenets/appBlogians';
import config from './componenets/statics/appConfig.json'

import './App.css'
import  React , {useState , useCallback , useEffect} from 'react'
import AppUserProfile from './componenets/appUserProfile';

var Login_context = React.createContext(null)


function App() {
  var login_data = false

  const [login_context_state , set_login_context_state] = useState(null)

  function change_login_context (state){
    set_login_context_state(state)
  }
  

  var blogs= [
    'How 5g will Revolutionize the world...',
    'Is Self-Driving and Electric Vehical worth buy Now??',
    'Rasmali reciepe',
    'what after 5g',
    'What is Quantu Computing',
    'See How PUBG  changed lives of hunderds of people sjdfhasjkfdhufnskfaueasfajukjfdskajfkmlkvcdljfierfnolfsia',

    ]

    let [appbody , set_appbody] = useState(null)

    let callback = useCallback((el)=>{
      set_appbody(el)
    })


    let app_container_callback = (el)=>{
      set_appcontainer(el)
    }

    var [ appcontainer, set_appcontainer] = useState(null)

   

    const [appbodyloading_state , set_appbodyloading_state]= useState('none')

    let change_appbodyloading = (display) =>{
          set_appbodyloading_state(display)
    }

    useEffect(()=>{
    let xhr = new XMLHttpRequest()
    xhr.open("POST",config.origin+"backend_api/getSessionId")

    xhr.onreadystatechange = ()=>{
      if (xhr.readyState == 4 && xhr.status == 200){
        let session = JSON.parse(xhr.response).session
        set_login_context_state(session)
        console.log("login_successfull")
      }
    }
    xhr.send()})

    
  return (
    <Router>
      
  <Login_context.Provider value = {login_context_state}>
      <AppHeader  bloglist = {blogs}   />
    <div className="appcontent" ref = {app_container_callback} >
      <div className="appbody" ref = {callback}>
        <AppBodyLoading loading = {appbodyloading_state} />
        <CacheSwitch>
            <CacheRoute exact path = '/Login'  >
              <AppLogin appbodyloading = {change_appbodyloading} change_login_context = {change_login_context} />
            </CacheRoute>
            <CacheRoute exact path = '/Signup'>
              <AppSignup appbodyloading = {change_appbodyloading}  />
            </CacheRoute>
            <Route  path = '/Blogians' >
              <AppBlogians />
            </Route>
            <Route exact path = '/Profile/:user_id'>
              <AppUserProfile />
            </Route>
        </CacheSwitch>
      
      </div>
      <AppFooter appbody = {appbody} appcontainer = {appcontainer}/>  
      </div>   
  </ Login_context.Provider>

    </Router>
  );
}

export default App;
export { Login_context};
