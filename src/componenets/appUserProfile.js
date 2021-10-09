import './statics/css/appUserProfile.css'
import {Link, useParams} from 'react-router-dom'
import { useCallback, useContext , useEffect ,useMemo,useRef,useState} from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import appConfig from './statics/appConfig.json'
import PropTypes from 'prop-types'
import { Login_context } from '../App'
import UserImage from './userImage'
import followers_icon from './statics/images/blogians.svg'
import followings_icon from './statics/images/unkownUser.svg'
import blogs_icon from './statics/images/uploadblogIcon.svg'
import views_icon from './statics/images/preview.svg'
import email_icon from './statics/images/email.svg'
import datetime_icon from './statics/images/join_datetime.svg'
import comments_icon from './statics/images/comments.svg'
import { BlogComponent } from './appHome'
import { BlogiansMiniProfile } from './appBlogians'
import { Comment } from './appBlog'

const AppUserProfile = props =>{
    let {user_id} = useParams()
    const history = useHistory()

    const [profile_data , set_profile_data] = useState({
        userName:'',joinDatetime:'',email:'',
        blogs:[],comments:[],followings:[],
        followers:[]
    })
    useEffect(()=>{
        if(user_id === "null")history.goBack()

        let xhr = new XMLHttpRequest()
        xhr.open('POST' , appConfig.origin+`backend_api/getUserDetails`)
        xhr.onreadystatechange=()=>{
            if(xhr.readyState === 4 && xhr.status === 200){
                let response = JSON.parse(xhr.response)
                switch (response.status) {
                    case "success":
                        console.log(response.userData)
                        set_profile_data(response.userData)
                        break;
                    case "fail":
                        history.push('/blog_tube_react/Error')
                        break;
                    default:
                        break;
                }
            }
        }
        xhr.setRequestHeader('userId' , user_id)
        xhr.send()
        
    }, [user_id])
    

    const[ views, set_views]= useState(0) ;

    useEffect(()=>{
        let views = 0
        for (let i of profile_data.blogs){
            views+= i.blog_details.views
        }
        set_views(views)
    },[profile_data])

    const usingColor = Math.floor(Math.random()*360)

    useEffect(()=>{
        let ele  = document.getElementsByClassName("appbody")[0]
        ele.scrollTo(0,0)
    })
    
    return (<div className = "profile_div">
        <div className = "pic_bg" style = {{filter:`hue-rotate(${usingColor}deg)`}}></div>
        <div className="user_head">
            <UserImage  user_id= {user_id} to="#"  
            width= '100px' height = '100px'  onClick={()=>null}
            style = {{borderWidth:"2px",borderRadius:"5px" ,margin:"auto 10px"}}
            
            />
            <h3 style={{color:"#00aed5",filter:`hue-rotate(${usingColor}deg) brightness(0.5)`}}
             id="profile_username" >{profile_data.userName}</h3>
            <FollowButton user_id = {user_id}
            style={{marginLeft:'auto' ,marginRight:'20px',color:"#00aed5",filter:`hue-rotate(${usingColor}deg) brightness(0.5)`,
            borderColor:"#00aed5"
        }} />
        </div>
        <div className="data">
            <UserDataItem filter = {`hue-rotate(${usingColor-33}deg)  brightness(0.7)`} data_icon = {followers_icon} data={`${profile_data.followers.length?profile_data.followers.length:'No'} Followers`} />
            <UserDataItem filter = {`hue-rotate(${usingColor-33}deg)  brightness(0.7)`} data_icon = {followings_icon} data={`${profile_data.followings.length?profile_data.followings.length:'No'} Followings`} />
            <UserDataItem filter = {`hue-rotate(${usingColor-33}deg)  brightness(0.7)`} data_icon = {blogs_icon} data={`${profile_data.blogs.length?profile_data.blogs.length:'No'} Blogs`} />
            <UserDataItem filter = {`hue-rotate(${usingColor-33}deg)  brightness(0.7)`} data_icon = {views_icon} data={`${views?views:'No'} Views`} />
            <UserDataItem filter = {`hue-rotate(${usingColor-33}deg)  brightness(0.7)`} data_icon = {datetime_icon} data={profile_data.joinDatetime} />
            <UserDataItem filter = {`hue-rotate(${usingColor-33}deg)  brightness(0.7)`} data_icon = {comments_icon} data={`${profile_data.comments.length?profile_data.comments.length:'No'} Comments`} />
            <UserDataItem filter = {`hue-rotate(${usingColor-33}deg)  brightness(0.5)`} 
            style = {{flexBasis:'100%', overflow:'auto',userSelect:'text',placeContent:"center"}}
            data_icon = {email_icon} data={profile_data.email} />
        </div>
        <ProfileTabs 
        followers = {profile_data.followers}
        blogs = {profile_data.blogs} 
        comments = {profile_data.comments}
        followings = {profile_data.followings}
        filter = {`hue-rotate(${usingColor-33}deg)`} />
    </div>)
}
export default AppUserProfile;

const ProfileTabs=props=>{
    var ref = useRef({})
    const change_tab  = useCallback(event=>{
        let value = event.target.value
        let width = ref.current.all_comments.getBoundingClientRect().width
        switch (value){
            case "blogs":
                ref.current.profile_tabs.scrollTo(0,0)
                break;
            case "followers":
                ref.current.profile_tabs.scrollTo(width,0)
                break;
            case "comments":
                ref.current.profile_tabs.scrollTo(width*2,0)
                break;
            case "followings":
                ref.current.profile_tabs.scrollTo(width*3,0)
                break;
            default :
                ref.current.profile_tabs.scrollTo(0,0)
                break;
        }
    },[ref])
    
    return(
        <div className="profile_tabs_container">
        <div className="tab_options">
            <input value = "blogs" type="radio" onInput={e=>change_tab(e)} name="options" id="blogs_option" hidden defaultChecked />
            <label style = {{filter:props.filter,'--bg-image':`url(${blogs_icon})`}} htmlFor="blogs_option" className="optionlabel">Blogs</label>
            <input value = "followers" type="radio" onInput={e=>change_tab(e)} name="options" id="followers_option" hidden />
            <label style = {{filter:props.filter,'--bg-image':`url(${followers_icon})`}} htmlFor="followers_option" className="optionlabel">Followers</label>
            <input value = "comments" type="radio" onInput={e=>change_tab(e)} name="options" id="comments_option" hidden />
            <label style = {{filter:props.filter,'--bg-image':`url(${comments_icon})`}} htmlFor="comments_option" className="optionlabel">Comments</label>
            <input value = "followings" type="radio" onInput={e=>change_tab(e)} name="options" id="followings_option" hidden />
            <label style = {{filter:props.filter,'--bg-image':`url(${followings_icon})`}} htmlFor="followings_option" className="optionlabel">Followings</label>
        </div>
        <div className="profile_tabs" ref = {el => ref.current.profile_tabs = el} >
            <span id="all_blogs" ref={el=>ref.current.all_blogs=el} >
                {props.blogs!==[]?props.blogs.map(item=>(<BlogComponent mini={true} user_details={item.user_details}

            views= {item.blog_details.views} likes={item.blog_details.likes} dislikes={item.blog_details.dislikes}
            date = {item.blog_details.datetime}
            title = {item.blog_details.title} 
            discription = {item.blog_details.discription}
            image_url = {item.blog_details.blog_title_image} blog_id = {item.blog_details.blog_id}
            key = {item.blog_details.blog_id} />))
            :"No Blogs"}
            </span>
            <span id="all_followers"  ref={el=>ref.current.all_followers=el} >
                    {props.followers !==[]?
                    props.followers.map(item=>(<BlogiansMiniProfile follow={'block'} key = {item.user_id} user_details = {item}  onClick = {()=>null} to={`/blog_tube_react/Profile/${item.user_id}`} />))
                    :"No Followers"}
            </span>
            <span id="all_comments" ref={el=>ref.current.all_comments=el} >
                {props.comments!==[]?
                (props.comments.map(item=>(<><Link className="comment_title" to={`/blog_tube_react/Blog/${item.blog_title}?id=${item.blog_id}`} ><span>{item.blog_title}</span></Link><Comment c_detials = {item} key ={item.cid} /></>)))
                :"No Comments"}
            </span>
            <span id="all_followings" ref={el=>ref.current.all_followings=el} >
            {props.followings !==[]?
                    props.followings.map(item=>(<BlogiansMiniProfile follow={'block'} key = {item.user_id} user_details = {item}  onClick = {()=>null} to={`/blog_tube_react/Profile/${item.user_id}`} />))
                    :"No Followings"}
            </span>
        </div>
        
        </div>
    )
}

const UserDataItem = props=>{
    return (
        <span className="data_item" title = {props.data} style = {props.style}>
            <img src = {props.data_icon} className = "data_icon" style = {{filter:props.filter}} width= "30" height="30"  />
            {props.data}
            </span>
    )
}

const FollowButton=props=>{
    const [follow_state, set_follow_state] = useState('Follow')
    var context = useContext(Login_context)
    var ref = useRef()
    const history = useHistory()

    const check_follower  = useCallback(()=>{
        if (context === sessionStorage.session){
            let xhr = new XMLHttpRequest()
            xhr.open('POST' , appConfig.origin+'backend_api/getFollowingList')
            xhr.onreadystatechange=()=>{if(xhr.status === 200 && xhr.readyState ===4){
                let response = JSON.parse(xhr.response)
                
                switch (response.status) {
                    case "success":
                        response.followings.indexOf(props.user_id)!== -1?
                        set_follow_state('Following'):set_follow_state('Follow')
                        break;
                    case "loginRequired":
                        console.log('backend_api/getFollowingList LoginRequired')
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
    },[context])

    
    useEffect(()=>{
        const observer = new IntersectionObserver(entries=>{
            if (entries[0].intersectionRatio > 0){
                check_follower()
            }
        })
        observer.observe(ref)

    },[ref,props.user_id,context])

    const follow_unfollow = useCallback((event)=>{
        event.stopPropagation()
        event.preventDefault()
        if (context === sessionStorage.session){
            let xhr = new XMLHttpRequest()
            xhr.open('POST' , appConfig.origin+'backend_api/followUnfollow')
            xhr.onreadystatechange=()=>{if(xhr.status === 200 && xhr.readyState ===4){
                let response = JSON.parse(xhr.response)
                switch (response.status) {
                    case "success":
                        if(response.followings.indexOf(props.user_id)!== -1){
                        set_follow_state('Following')
                        props.change_followers(true)
                    }
                        else{
                            set_follow_state('Follow')
                            props.change_followers(false)
                    }
                        
                        break;
                    case "loginRequired":
                        console.log('backend_api/followUnfollow')
                        history.push('/blog_tube_react/Login')
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
    },[context ,props.user_id ])
    return(
        <button id="follow_button" style = {props.style} ref = {el=>ref = el} onClick={follow_unfollow} disabled ={context !== sessionStorage.session || JSON.parse(localStorage.login_data).user_id === props.user_id} >{follow_state}</button>
    )
}

export {FollowButton}

FollowButton.propTypes = {
    user_id : PropTypes.string.isRequired,
    style : PropTypes.object
}