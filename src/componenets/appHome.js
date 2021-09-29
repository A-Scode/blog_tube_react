import "./statics/css/appHome.css"
import UserImage from './userImage'
import PropType from 'prop-types'
import { useContext, useEffect } from "react"
import appConfig from './statics/appConfig.json'
import { Login_context } from "../App"

const AppHome = props=>{

    const session = useContext(Login_context)
    useEffect( ()=>{
        fetch(appConfig.origin+'backend_api/retriveBlogs',{ 
            mode:'cors',
            method:"POST",
            headers:{ session : session }
        })
        .then(response=> response.text().then(
            text=>console.log(text)
        ))
    },[])
    
    return(
        <div className="homepage">
            <BlogComponent user_details={{uid:"hello",name:"hello",date:'hello'}} views= {0} likes={0} dislikes={0} />
        </div>
    )
}
export default AppHome

const BlogComponent = props=>{
    return (
        <div className="blog_details">
            <img className="blog_image" />
            <div className="details">
                <div className="blogger">
                    <UserImage usre_id = {props.user_details.uid} />
                    <span>{props.user_details.name}</span>
                </div>
                <span className = "discription"></span>
                <span className="public_details">
                    <span>{props.views}</span>
                    <span>{props.likes}</span>
                    <span>{props.dislikes}</span>
                    <span>{props.user_details.date}</span>
                </span>
            </div>
        </div>
    )
}

BlogComponent.propTypes = {
    user_details : PropType.object.isRequired,
    views : PropType.number.isRequired,
    likes : PropType.number.isRequired,
    dislikes : PropType.number.isRequired,
    mini : PropType.bool
}
