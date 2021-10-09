import './statics/css/appBlogians.css'
import appConfig from './statics/appConfig.json'
import {useEffect, useState ,useRef , useContext, useCallback} from 'react'
import blogiansIcon from './statics/images/blogians.svg'
import PropTypes from 'prop-types'
import {Login_context} from '../App'
import { useLocation , Link ,Redirect, useRouteMatch , useHistory} from 'react-router-dom'
import { CacheSwitch as Switch, CacheRoute as Route} from 'react-router-cache-route'
import AppUserProfile, { FollowButton } from './appUserProfile'
import UserImage from './userImage'
import { parseHTML } from 'jquery'


var AppBlogians = props=>{
    const {path} = useRouteMatch()

    const [user_list , set_user_list] = useState([])

    var ref_list = useRef([]) ;

    useEffect(()=>{
    var xhr = new XMLHttpRequest()
    xhr.open('GET' , appConfig.origin + "backend_api/userlist")
    xhr.onreadystatechange = ()=>{
        if (xhr.readyState === 4 && xhr.status === 200){
            let response = JSON.parse(xhr.response)

            if (response.status == 'success'){
                ref_list.current['list'] = response.userslist
                set_user_list(response.userslist)
            }else if (response.status === 'fail'){
                set_user_list([])
            }

        }
    }
    xhr.send()

    window.addEventListener('resize' , hide_preview , true)
    return ()=>window.removeEventListener('resize' , hide_preview , true)
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

    const mq = window.matchMedia('(min-width : 768px)')


    let ref = useRef({})

    const [user_id , set_user_id]= useState(null)
    
    function show_preview(uid){
        set_user_id(uid)
        if (mq.matches){
            ref.current['preview_window'].style.display = "block"
            ref.current['blogians_window'].style.gridColumn = "1 / span 1"
            set_follow('none')
        }
    }
    function hide_preview(){
        
        ref.current['preview_window'].style.display = "none"
        ref.current['blogians_window'].style.gridColumn = "1 / span 2"
        
        set_follow('block')
    }
    let history = useHistory()
    const [follow ,set_follow] = useState('block')

    return (
    <div className= "holder">

    <div  className="blogians" ref = {el=>ref.current['blogians_window']=el} onDoubleClick= {()=>hide_preview()}>
                <input className = "blogiansInput" onInput= {event=>search(event)} style= {{backgroundImage:`url(${blogiansIcon})`}} type = "text" placeholder = "Search Blogians" />
                <div className="allBlogians">
                    {user_list.map(item=>{
                        return(<BlogiansMiniProfile follow={follow} key = {item.user_id} user_details = {item}  onClick = {(uid)=>show_preview(uid)} to={`${path}/profile_small/${item.user_id}`} />)
                    })}
                </div>
            </div>
            <div className="profile_preview" ref  = {el=>ref.current['preview_window']=el}>   
                <Route exact  path = {`${path}/profile_small/:user_id`}>
                    {mq.matches?(<>
                    <AppUserProfile />
                    {follow==='none'?<button id = "FullpageProfile"  onClick={()=>history.push(`/blog_tube_react/Profile/${user_id}`)}> Full Profile </button>:null}
                    </>)
                    : <Redirect to = {`/blog_tube_react/Profile/${user_id}`} />}
                </Route>
                

            </div>
            </div>
    )
}


function BlogiansMiniProfile(props){
    const [followers ,set_followers] = useState(props.user_details.followers_count)

    const change_followers = useCallback((state)=>{
        if (state)set_followers(followers+1)
        else set_followers(followers -1)
    })

    return(
        <Link className = "links" onClick = {()=>props.onClick(props.user_details.user_id)} style = {{textDecoration:'none',width : '100%',display:'flex', maxWidth: "1000px", justifyContent:'center',placeItems:'center'}} to = {props.to} >
        <div className="miniprofile"  >
            <UserImage  width = "50px" height = "50px" to = {`/blog_tube_react/Profile/${props.user_details.user_id}`}
             style = {{backgroundColor : "rgb(255, 255, 255)",
                        margin:"auto",
                        gridArea : "photo" ,
                        borderWidth : "2px"}} 
                        
                user_id = {props.user_details.user_id}
                onClick = {()=>null} />
            <div className="profile_name" title = {props.user_details.user_name} >
                {props.user_details.user_name}
                
                </div>
            <div className="follower" >
                <div className="follower_count" style= {{backgroundImage : `url(${blogiansIcon})`}}   >  {followers > 0 ?followers:"No"} Followers </div>
            <FollowButton change_followers = {change_followers}  user_id = {props.user_details.user_id} style = {{marginRight: "10px" , marginLeft: 'auto',display:props.follow}}  /></div>
            {props.user_details.total_blogs > 0 ?<div className="tag">🏹Blogger</div>:null}
        </div>
        </Link>
    )
}

BlogiansMiniProfile.propTypes = {
    user_details : PropTypes.object.isRequired,
    to : PropTypes.string.isRequired
}

export {BlogiansMiniProfile}

export  default AppBlogians;
