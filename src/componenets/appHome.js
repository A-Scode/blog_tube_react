import "./statics/css/appHome.css"
import UserImage from './userImage'
import PropTypes from 'prop-types'

const AppHome = props=>{
    return(
        <div className="homepage">
            <BlogComponent />
        </div>
    )
}
export default AppHome

const BlogComponent = props=>{
    return (
        <div className="blog_details">
            <div className="blog_image"></div>
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
                    <span>{props.date}</span>
                </span>
            </div>
        </div>
    )
}

BlogComponent.propTypes = {
    user_details : PropTypes.object.isRequired,
    views : PropTypes.number.isRequired,
    likes : PropTypes.number.isRequired,
    dislikes : PropTypes.number.isRequired
}
