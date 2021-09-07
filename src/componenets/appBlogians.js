import './statics/css/appBlogians.css'
import appConfig from './statics/appConfig.json'
import {useEffect, useState ,useRef , useContext} from 'react'
import blogiansIcon from './statics/images/blogians.svg'
import PropTypes from 'prop-types'
import {Login_context} from '../App'
import { useLocation , Link ,Redirect, useRouteMatch , useHistory} from 'react-router-dom'
import { CacheSwitch as Switch, CacheRoute as Route} from 'react-router-cache-route'
import AppUserProfile from './appUserProfile'


var AppBlogians = props=>{
    const {path} = useRouteMatch()

    const [user_list , set_user_list] = useState([])

    var ref_list = useRef([]) ;

    useEffect(()=>{
    var xhr = new XMLHttpRequest()
    xhr.open('GET' , appConfig.origin + "backend_api/userlist")
    xhr.onreadystatechange = ()=>{
        if (xhr.readyState == 4 && xhr.status == 200){
            let response = JSON.parse(xhr.response)

            if (response.status == 'success'){
                ref_list.current['list'] = response.userslist
                set_user_list(response.userslist)
            }else if (response.status == 'fail'){
                set_user_list([])
            }

        }
    }
    xhr.send()
},[])

    function search(event){
        const target = event.target
        let data = event.nativeEvent.data

        if ( "?\"':;!*()".search(data) != -1){
            target.setCustomValidity("username does not contain ?!:;#$%^&*\"'() ")
            target.value = target.value.slice(0 , target.value.length -1)
            target.reportValidity()
        }else{
            target.setCustomValidity("")
            target.reportValidity()
            
            let filtered_list = []
            
            for (var user of ref_list.current['list']){
                if(user.user_name.search(target.value) != -1){
                    filtered_list.push(user)
                }
            filtered_list.sort((a,b)=>b.followers_count - a.followers_count)
            set_user_list(filtered_list)
            
            }
        }
        
    }
    let location = useLocation()

    const mq = window.matchMedia('(min-width : 768px)')


    let ref = useRef({})

    const [user_id , set_user_id]= useState(null)
    
    function show_preview(uid){
        set_user_id(uid)
        if (mq.matches){
            console.log(ref)
            ref.current['preview_window'].style.display = "block"
            ref.current['blogians_window'].style.gridColumn = "1 / span 1"
        }
    }
    function hide_preview(){
        if  (mq.matches){
            ref.current['preview_window'].style.display = "none"
            ref.current['blogians_window'].style.gridColumn = "1 / span 2"
        }
    }
    let history = useHistory()

    return (
    <div className= "holder">

    <div className="blogians" ref = {el=>ref.current['blogians_window']=el} onDoubleClick= {()=>hide_preview()}>
                <input className = "blogiansInput" onInput= {event=>search(event)} style= {{backgroundImage:`url(${blogiansIcon})`}} type = "text" placeholder = "Search Blogians" />
                <div className="allBlogians">
                    {user_list.map(item=>{
                        return(<BlogiansMiniProfile key = {item.user_id} user_details = {item}  onClick = {(uid)=>show_preview(uid)} />)
                    })}
                </div>
            </div>
            <div className="profile_preview" ref  = {el=>ref.current['preview_window']=el}>   
                <Route exact  path = {`${path}/profile_small/:user_id`}>
                    {mq.matches?(<>
                    <AppUserProfile />
                    <button id = "FullpageProfile"  onClick={()=>history.push(`/Profile/${user_id}`)}> Full Profile </button>
                    </>)
                    : <Redirect to = {`/Profile/${user_id}`} />}
                </Route>
                

            </div>
            </div>
    )
}


function BlogiansMiniProfile(props){

    const {path }= useRouteMatch()
    // console.log(`${path}/profile_small/${props.user_details.user_id}`)

    let ref = useRef({})
    const session = useContext(Login_context)
    let xhr = new XMLHttpRequest()
    xhr.open('POST', appConfig.origin + "backend_api/getprofilephoto")
    xhr.responseType = 'blob'
    useEffect(()=>{
    xhr.onreadystatechange = ()=>{
        if (xhr.readyState == 4 && xhr.status == 200){
           ref.current['profile_photo'].style.backgroundImage = `url(${URL.createObjectURL(xhr.response)})`
        }
    }
    xhr.setRequestHeader("session" , session)
    xhr.setRequestHeader("photouid" ,JSON.stringify( props.user_details.user_id))
    xhr.send()}, [ref])


    return(
        <Link className = "links" onClick = {()=>props.onClick(props.user_details.user_id)} style = {{textDecoration:'none',width : '100%',display:'flex', justifyContent:'center',placeItems:'center'}} to = {`${path}/profile_small/${props.user_details.user_id}`} >
        <div className="miniprofile" >
            <div className="profilePhoto" ref = {el=>ref.current['profile_photo']=el}>
            </div>
            <div className="profile_name">{props.user_details.user_name}</div>
            <div className="follower_count" style= {{backgroundImage : `url(${blogiansIcon})`}} >{props.user_details.followers_count > 0 ?props.user_details.followers_count:"No"} Followers</div>
            {props.user_details.total_blogs > 0 ?<div className="tag">🏹Blogger</div>:null}
        </div>
        </Link>
    )
}

BlogiansMiniProfile.propTypes = {
    user_details : PropTypes.object.isRequired
}



export  default AppBlogians;
