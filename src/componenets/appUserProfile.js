import './statics/css/appUserProfile.css'
import {useParams} from 'react-router-dom'
import { useCallback, useContext , useEffect ,useRef,useState} from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import appConfig from './statics/appConfig.json'
import PropTypes from 'prop-types'
import { Login_context } from '../App'

const AppUserProfile = props =>{
    let {user_id} = useParams()
    
    return (<div className = "profile_div">
        <div className = "pic backgorud"></div>
        <Follow_button user_id = {user_id} />
   <h1>{user_id}</h1>
    </div>)
}
export default AppUserProfile;

const Follow_button=props=>{
    const [follow_state, set_follow_state] = useState('Follow')
    var context = useContext(Login_context)
    var ref = useRef()
    const history = useHistory()

    const check_follower  = useCallback(()=>{
        console.log(context)
        if (context === sessionStorage.session){
            let xhr = new XMLHttpRequest()
            xhr.open('POST' , appConfig.origin+'backend_api/getFollowingList')
            xhr.onreadystatechange=()=>{if(xhr.status === 200 && xhr.readyState ===4){
                let response = JSON.parse(xhr.response)
                
                switch (response.status) {
                    case "success":
                        response.followings.indexOf(props.user_id)!== -1?
                        set_follow_state('Following'):set_follow_state('Follow')
                        console.log(response.followings.indexOf(props.user_id))
                        
                        break;
                    case "loginRequired":
                        history.push('/Error')
                        break;
                    case "fail":
                        check_follower()
                        break;
                    default:
                        break;
                }
            }}
            xhr.setRequestHeader('session'  , context)
            xhr.send()
        }
    })

    
    useEffect(()=>{
        const observer = new IntersectionObserver(entries=>{
            if (entries[0].intersectionRatio > 0){
                check_follower()
            }
        })
        observer.observe(ref)

    },[ref])

    const follow_unfollow = useCallback(()=>{
        if (context === sessionStorage.session){
            let xhr = new XMLHttpRequest()
            xhr.open('POST' , appConfig.origin+'backend_api/followUnfollow')
            xhr.onreadystatechange=()=>{if(xhr.status === 200 && xhr.readyState ===4){
                let response = JSON.parse(xhr.response)
                console.log(response)
                switch (response.status) {
                    case "success":
                        response.followings.indexOf(props.user_id)!== -1?
                        set_follow_state('Following'):set_follow_state('Follow')
                        break;
                    case "loginRequired":
                        history.push('/Error')
                        break;
                    case "fail":
                        break;
                    default:
                        break;
                }
            }}
            xhr.setRequestHeader('session'  , context)
            xhr.setRequestHeader('toFollow'  , props.user_id)
            xhr.setRequestHeader('state' , follow_state)
            xhr.send()
        }
    })
    return(
        <button ref = {el=>ref = el} onClick={follow_unfollow} disabled ={context !== sessionStorage.session || JSON.parse(localStorage.login_data).user_id === props.user_id} >{follow_state}</button>
    )
}

Follow_button.propTypes = {
    user_id : PropTypes.string.isRequired
}