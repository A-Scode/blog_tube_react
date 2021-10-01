import "./statics/css/appHome.css"
import UserImage from './userImage'
import PropType from 'prop-types'
import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import appConfig from './statics/appConfig.json'
import { Login_context } from "../App"
import "./statics/css/appBlog.css"
import view_logo from './statics/images/preview.svg'
import like_logo from './statics/images/like.svg'
import dislike_logo from './statics/images/dislike.svg'
import steps_bg from './statics/images/steps_bg.svg'

const AppHome = props=>{

    const session = useContext(Login_context)
    const [blogs_list , set_blogs_list] = useState([])

    useEffect( ()=>{
        fetch(appConfig.origin+'backend_api/retriveHomeBlogs',{ 
            mode:'cors',
            method:"POST",
            headers:{ session : session }
        })
        .then(response=> response.text().then(
            text=>{
                let response = JSON.parse(text)
                switch (response.status) {
                    case "success":
                        set_blogs_list(response.blogs_list)
                        break;
                
                    default:
                        break;
                }
            }
        ))
    },[])
    
    return(
        <div className="homepage">
           {blogs_list.map(item=>( <BlogComponent user_details={item.user_details} 
            views= {item.blog_details.views} likes={item.blog_details.likes} dislikes={item.blog_details.dislikes}
            date = {item.blog_details.datetime}
            title = {item.blog_details.title} 
            discription = {item.blog_details.discription}
            image_url = {item.blog_details.blog_title_image} blog_id = {item.blog_details.blog_id} />))}
        </div>
    )
}
export default AppHome

const BlogComponent = props=>{
    const [style , set_style ] = useState({blog_details:{gridTemplateColumns: "minmax(40%, 350px) minmax(calc(60% - 15px), auto)",
        gridTemplateRows: "60px 170px 30px",backgroundImage : `url(${steps_bg})`}})
        
    return (<Link to = {`/Blog/${props.title}?id=${props.blog_id}`} style ={{display:"flex",width:"100%" ,placeItems:"center"}} >
        <div className="blog_details" style = {style.blog_details} >
            <img className="blog_image" src = {props.image_url} loading= "lazy" />
            
                <div className="blogger">
                    <UserImage user_id = {props.user_details.user_id} width="35px" height="35px" style ={{
                        borderWidth:"2px"
                    }} to ={`/Profile/${props.user_details.user_id}`}  onClick ={()=>null} />
                    <span id = "username">{props.user_details.username}</span>
                </div>
                <span className = "head_dis">
                    <h4>{props.title}</h4>
                    <p>{props.discription!==""?props.discription :"No Discription"}</p>
                </span>
                <span className="public_details">
                    <span id = "like_label" style = {{backgroundImage : `url(${like_logo})`,backgroundSize:"20px 20px",paddingLeft:"25px"}} >{props.likes?props.likes:"No likes"}</span>
                    <span id = "view_label" style = {{backgroundImage : `url(${view_logo})`,backgroundSize:"20px 20px",paddingLeft:"25px"}} >{props.views?props.views:"No views"}</span>
                    <span id = "dislike_label" style = {{backgroundImage : `url(${dislike_logo})`,backgroundSize:"20px 20px",paddingLeft:"25px"}} >{props.dislikes?props.dislikes:"No dislikes"}</span>
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
