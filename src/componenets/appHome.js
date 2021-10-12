import "./statics/css/appHome.css"
import UserImage from './userImage'
import PropType from 'prop-types'
import { useContext, useEffect, useState } from "react"
import { Link ,useHistory } from "react-router-dom"
import appConfig from './statics/appConfig.json'
import { Login_context } from "../App"
import "./statics/css/appBlog.css"
import view_logo from './statics/images/preview.svg'
import like_logo from './statics/images/like.svg'
import dislike_logo from './statics/images/dislike.svg'
import steps_bg from './statics/images/steps_bg.svg'
import { FollowButton } from "./appUserProfile"

const AppHome = props=>{

    const mq = window.matchMedia('(max-width:768px)')
    const [mini , set_mini] = useState(false)

    function mq_change(){
        if (mq.matches){
            set_mini(true)
        }else{
            set_mini(false)
        }
    }
    useEffect( ()=>{
                mq_change()
            window.addEventListener("resize",mq_change,true)
            return ()=>window.removeEventListener("resize",mq_change,true)
            },[])
            
    
    return(
        <div className="homepage">
           {props.blogs_list.map(item=>( <BlogComponent mini={mini} user_details={item.user_details} 
            views= {item.blog_details.views} likes={item.blog_details.likes} dislikes={item.blog_details.dislikes}
            date = {item.blog_details.datetime}
            title = {item.blog_details.title} 
            discription = {item.blog_details.discription}
            image_url = {item.blog_details.blog_title_image} blog_id = {item.blog_details.blog_id}
            key = {item.blog_details.blog_id} />))}
        </div>
    )
}
export default AppHome

const BlogComponent = props=>{
    const [style , set_style ] = useState({blog_details:{gridTemplateColumns: "minmax(40%, 350px) minmax(calc(60% - 15px), auto)",
    gridTemplateRows: "60px 170px 50px",  gridGap: "10px",
    gridTemplateAreas: `"image blogger" "image head_dis" "image public"`,
    maxWidth: "1000px",width: "90%",
        backgroundImage : `url(${steps_bg})`},
        title_image:{
            width: "90%",margin:"0 10px",border: "2px solid #cca200"
        }
        })

    useEffect(()=>{
        if (props.mini){
            set_style({blog_details:{gridTemplateColumns: "100%",
    gridTemplateAreas: `"image" "blogger" "head_dis" "public"`,
    width:"95%" , maxWidth:"400px", gridGap: "0",
            gridTemplateRows: "minmax(200px,auto) 60px 170px 50px",
            backgroundImage : `url(${steps_bg})`},
        title_image:{
            width:"100%",margin:"0",border:"none"
        }
        })
        }else{
            set_style({blog_details:{gridTemplateColumns: "minmax(40%, 350px) minmax(calc(60% - 15px), auto)",
    gridTemplateAreas: `"image blogger" "image head_dis" "image public"`,
    gridTemplateRows: "60px 170px 50px", gridGap: "10px",
            width: "90%",maxWidth: "1000px",
            backgroundImage : `url(${steps_bg})`},
            title_image:{
                width: "90%",margin:"0 10px",border: "2px solid #cca200"
            }
            })
        }
    },[props.mini])
        
    return (<Link to = {`/Blog/${props.title}?id=${props.blog_id}`} style ={{display:"flex",width:"100%" ,placeItems:"center"}} >
        <div className="blog_details" style = {style.blog_details} >
            <img className="blog_image" style={style.title_image} src = {props.image_url} loading= "lazy" />
            
                <div className="blogger">
                    <UserImage user_id = {props.user_details.user_id} width="35px" height="35px" style ={{
                        borderWidth:"2px"
                    }} to ={`/Profile/${props.user_details.user_id}`}  onClick ={()=>null} />
                    <span id = "username">{props.user_details.username}</span>
                    <FollowButton user_id = {props.user_details.user_id}
                    style = {{marginLeft:'auto' , marginRight:"10px"  , height:"30px" , alignSelf:'center'}}                    
                    />
                </div>
                <span className = "head_dis">
                    <h4>{props.title}</h4>
                    <p>{props.discription!==""?props.discription :"No Discription"}</p>
                </span>
                <span className="public_details">
                    <span id = "like_label" style = {{backgroundImage : `url(${like_logo})`}} >{props.likes?props.likes:"No likes"}</span>
                    <span id = "view_label" style = {{backgroundImage : `url(${view_logo})`}} >{props.views?props.views:"No views"}</span>
                    <span id = "dislike_label" style = {{backgroundImage : `url(${dislike_logo})`}} >{props.dislikes?props.dislikes:"No dislikes"}</span>
                    <span className ="datetime">{props.date}</span>
                </span>
            </div>
        </Link>
    )
}

BlogComponent.propTypes = {
    user_details : PropType.object.isRequired,
    views : PropType.number.isRequired,
    likes : PropType.number.isRequired,
    dislikes : PropType.number.isRequired,
    mini : PropType.bool
}
export {BlogComponent}