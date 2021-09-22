import PropTypes from 'prop-types'
import unkownUser from './statics/images/unkownUser.svg'
import appConfig from './statics/appConfig.json'
import {Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
let UserImage = props=>{
    let ref = useRef("")
    let div_style = {
        width        : props.width,
        height       : props.height,
        borderRadius : '100%',
        borderStyle  : 'inset',
        borderWidth  : '4px',
        borderColor  : '#0334dd',
        backgroundSize : `contain`,
        backgroundPosition:'center',
        alignSelf : 'center',
        justifySelf : 'center',
        backgroundRepeat :'no-repeat'
    }
    function load_image(){
        let top =  ref.current.getBoundingClientRect().top
        let win_height = window.innerHeight
        if(window.innerHeight >= top){
        if (props.user_id === "unknown"){
            ref.current.style.backgroundImage = `url(${unkownUser})`
            let to = '/Signup'
        }else{
                ref.current.style.backgroundImage = `url(${appConfig.origin + `backend_api/getprofilephoto?user_id=${props.user_id}`})`
        }}
    }
    useEffect(()=>{
    load_image()
    document.documentElement.onscroll = ()=>load_image()
},[props.user_id])
    return  <Link to = {props.to} ref ={el =>ref.current =el}  style = {div_style} onClick= {()=>props.onClick()} ></Link>
}


UserImage.propTypes = {
    width : PropTypes.string.isRequired,
    height : PropTypes.string.isRequired,
    user_id : PropTypes.string.isRequired,
    to : PropTypes.string.isRequired
}

export default UserImage;