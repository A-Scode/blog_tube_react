import {useHistory,  BrowserRouter as Router ,Route ,Redirect} from 'react-router-dom'
import {CacheSwitch , CacheRoute } from 'react-router-cache-route'
import AppHeader from './componenets/appHeader';
import AppFooter from './componenets/appFooter';
import AppLogin from './componenets/appLogin';
import AppSignup from './componenets/appSignup';
import AppBodyLoading from './componenets/appBodyLoading';
import AppBlogians from './componenets/appBlogians';
import config from './componenets/statics/appConfig.json'
import AppBlog from './componenets/appBlog';
import appConfig from './componenets/statics/appConfig.json'

import './App.css'
import  React , {useState , useCallback , useEffect} from 'react'
import AppUserProfile from './componenets/appUserProfile';
import AppUploadBlog from './componenets/appUploadBlog';
import { logout } from './componenets/statics/utils';
import AppHome from './componenets/appHome';

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

    const history = useHistory()
    const [blogs_list , set_blogs_list] = useState([])

    useEffect(()=>{
    let xhr = new XMLHttpRequest()
    xhr.open("POST",config.origin+"backend_api/getSessionId")

    xhr.onreadystatechange = ()=>{
      if (xhr.readyState === 4 && xhr.status === 200){
        let session = JSON.parse(xhr.response).session
        if (session === ""){
          logout()
        } 
        else{
          set_login_context_state(session)
          }
        console.log(session)
      }
    }
    xhr.send()
    
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
                  history.push('/blog_tube_react/Home')
                  break;
              default:
                  break;
          }}))}
    
    ,[login_context_state])
  

    
  return (
    <Router>
      
  <Login_context.Provider value = {login_context_state}>
      <AppHeader  bloglist = {blogs_list} login_state = {login_context_state}  />
    <div className="appcontent" ref = {app_container_callback} >
      <div className="appbody" ref = {callback}>
        <AppBodyLoading loading = {appbodyloading_state} />
        <CacheSwitch>
            <Route exact path = '/blog_tube_react/Blog/:title'>
              <AppBlog appbodyloading = {change_appbodyloading} />
            </Route>
            <CacheRoute exact path = '/blog_tube_react/Login'  >
              <AppLogin appbodyloading = {change_appbodyloading} change_login_context = {change_login_context} />
            </CacheRoute>
            <CacheRoute exact path = '/blog_tube_react/Signup'>
              <AppSignup appbodyloading = {change_appbodyloading}  />
            </CacheRoute>
            <Route  path = '/blog_tube_react/Blogians' >
              <AppBlogians />
            </Route>
            <Route exact path = '/blog_tube_react/Profile/:user_id'>
              <AppUserProfile />
            </Route>
            <Route  path = '/blog_tube_react/UploadBlog'>
              <AppUploadBlog appbodyloading= {change_appbodyloading} />
            </Route>
            <Route exact path = "/blog_tube_react/Home" >
              <AppHome blogs_list = {blogs_list} />
            </Route>
            <CacheRoute exact path = "/blog_tube_react/Error">
              <h1>Error</h1>
            </CacheRoute>
            <Route path = "/blog_tube_react/"><Redirect to="/blog_tube_react/Home" /></Route>
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
