import {useHistory,  HashRouter as Router ,Route ,Redirect} from 'react-router-dom'
import {CacheSwitch , CacheRoute } from 'react-router-cache-route'
import $ from 'jquery'
import AppHeader from './componenets/appHeader';
import AppFooter from './componenets/appFooter';
import AppLogin from './componenets/appLogin';
import AppSignup from './componenets/appSignup';
import AppBodyLoading from './componenets/appBodyLoading';
import AppBlogians from './componenets/appBlogians';
import AppBlog from './componenets/appBlog';
import appConfig from './componenets/statics/appConfig.json'

import './App.css'
import  React , {useState , useCallback , useEffect, useRef} from 'react'
import AppUserProfile from './componenets/appUserProfile';
import AppUploadBlog from './componenets/appUploadBlog';
import AppHome from './componenets/appHome';

var Login_context = React.createContext(null)
var Theme_context = React.createContext('Light')

function App() {
  const [login_context_state , set_login_context_state] = useState(null)
  const [theme_context , set_theme_context] = useState('Light')

  const change_login_context=useCallback( (state)=>{
    set_login_context_state(state)
  })
  const change_theme_context=useCallback( (state)=>{
    set_theme_context(state)
  })

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

    const history = useHistory()
    const [blogs_list , set_blogs_list] = useState([])

    useEffect(()=>{
    fetch(appConfig.origin+'backend_api/retriveHomeBlogs',{ 
      mode:'cors',
      method:"POST",
      headers:{ session : login_context_state }
  })
  .then(response=> response.text().then(
      text=>{
          let response = JSON.parse(text)
          switch (response.status) {
              case "success":
                  set_blogs_list(response.blogs_list)
                  break;
              case "fail":
                  history.push('/Home')
                  break;
              default:
                  break;
          }}))
        }
    
    ,[])
    useEffect(()=>{
      if (sessionStorage.session !== null){
        set_login_context_state(sessionStorage.session)
      }
    },[sessionStorage])
    useEffect(()=>{
      if (theme_context === "Dark"){
      document.documentElement.style.backgroundColor = "#272727"
      document.documentElement.style.color = "white"
    }
      else{
      document.documentElement.style.backgroundColor = "white"
      document.documentElement.style.color = "none"
      }
    },[theme_context])  
    const theme_query = window.matchMedia('(prefers-color-scheme:dark)')
    useEffect(()=>{
      if (theme_query.matches)set_theme_context("Dark")
      else set_theme_context("Light")
    },[theme_query])

    
  return (
    <Router>
  <Theme_context.Provider value = {theme_context} > 
  <Login_context.Provider value = {login_context_state}>
      <AppHeader  bloglist = {blogs_list} login_state = {login_context_state} change_theme = {change_theme_context} />
    <div className="appcontent" ref = {app_container_callback} >
      <div className="appbody" ref = {callback}>
        <AppBodyLoading loading = {appbodyloading_state} />
        <CacheSwitch>
            <Route exact path = '/Blog/:title'>
              <AppBlog appbodyloading = {change_appbodyloading} />
            </Route>
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
            <Route  path = '/UploadBlog'>
              <AppUploadBlog appbodyloading= {change_appbodyloading} />
            </Route>
            <Route exact path = "/Home" >
              <AppHome blogs_list = {blogs_list} />
            </Route>
            <CacheRoute exact path = "/Error">
              <h1>Error</h1>
            </CacheRoute>
            <Route path = "/"><Redirect to="/Home" /></Route>
        </CacheSwitch>
      
      </div>
      <AppFooter appbody = {appbody} appcontainer = {appcontainer}/>  
      </div>   
  </ Login_context.Provider>
  </Theme_context.Provider>

    </Router>
  );
}

export default App;
export { Login_context , Theme_context};
