import PropTypes from 'prop-types'
import unkownUser from './statics/images/unkownUser.svg'
import appConfig from './statics/appConfig.json'
import {Link } from 'react-router-dom'
import { useEffect, useRef ,useContext , useState} from 'react'
import {Login_context} from '../App'
let UserImage = props=>{
    var session  = useContext(Login_context)
    let ref = useRef("")
    const [ div_style , set_div_style] = useState({
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
    })
    var flag;

    function load_image(){
        if (flag === false){
        if (props.user_id === "unknown"){
            set_div_style({...div_style , ...props.style ,backgroundImage : `url(${unkownUser})` })
            let to = '/Signup'
            flag = true
        }else{
                let xhr = new XMLHttpRequest()
    xhr.open('POST', appConfig.origin + "backend_api/getprofilephoto")
    xhr.responseType = 'blob'
    xhr.onreadystatechange = ()=>{
        if (xhr.readyState === 4 && xhr.status === 200){
            let response = xhr.response
            set_div_style({...div_style , ...props.style ,backgroundImage : `url(${URL.createObjectURL(response)})` })
            flag = true
            console.log(props.user_id)
        }
    }
    xhr.setRequestHeader("session" , session?session:'')
    xhr.setRequestHeader("photouid" , props.user_id)
    xhr.send()
        }}
    }
    

    useEffect(()=>{
        var observer = new IntersectionObserver((entries,observer)=>{
            if (entries[0].intersectionRatio > 0){
                load_image()
            }
        })
        observer.observe(ref.current)
        flag = false;
        set_div_style({...div_style , ...props.style})
},[props.user_id])

    return  <Link to = {props.to} ref ={el =>ref.current =el}  style = {div_style} onClick= {()=>props.onClick()} ></Link>
}


UserImage.propTypes = {
    width : PropTypes.string.isRequired,
    height : PropTypes.string.isRequired,
    user_id : PropTypes.string.isRequired,
    to : PropTypes.string.isRequired,
    style : PropTypes.object
}

export default UserImage;