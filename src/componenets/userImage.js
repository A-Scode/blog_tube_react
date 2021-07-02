import PropTypes from 'prop-types'
import unkownUser from './statics/images/unkownUser.svg'
import appConfig from './statics/appConfig.json'
import {Link } from 'react-router-dom'
let UserImage = props=>{

    let div_style = {
        width        : props.width,
        height       : props.height,
        borderRadius : '100%',
        borderStyle  : 'inset',
        borderWidth  : '4px',
        borderColor  : '#0334dd',
        backgroundSize : `${props.width} ${props.height }`,
        alignSelf : 'center',
        justifySelf : 'center'
    }
    if (props.user_id === "unknown"){
        div_style.backgroundImage = `url(${unkownUser})`
        let to = '/Signup'
        }else{
            div_style.backgroundImage = `url(${appConfig.origin + `backend_api/getprofilephoto?user_id=${props.user_id}`})`
        }
    return  <Link to = {props.to} style = {div_style} onClick= {()=>props.onClick()} ></Link>
}


UserImage.propTypes = {
    width : PropTypes.string.isRequired,
    height : PropTypes.string.isRequired,
    user_id : PropTypes.string.isRequired,
    to : PropTypes.string.isRequired
}

export default UserImage;