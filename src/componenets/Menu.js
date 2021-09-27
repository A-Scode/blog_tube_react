import {useContext, useEffect, useRef ,useState } from 'react'
import { Login_context } from '../App'
import './statics/css/Menu.css'
import { Link } from 'react-router-dom'
import UserImage from './userImage'
import {profile_photo , logout} from './statics/utils'
import homeIcon from './statics/images/homeIcon.svg'
import PropType from 'prop-types'
import loginIcon from './statics/images/password.svg'
import logoutIcon from './statics/images/logoutIcon.svg'
import uploadBlogIcon from './statics/images/uploadblogIcon.svg'
import blogians from  './statics/images/blogians.svg'

function Menu  (props){
    var ref = useRef({})

    let count = 0 

    function click_event(event){
        const elements_list = ref.current['menu_container'].getElementsByTagName("*")

        let get_done = true
        for (let elem of elements_list){
            if (elem === event.target){
                get_done = false
            }
        }
        if(get_done){
            count+=1
                if (count===1){
                    props.onClick()
                    count=0
                
                }
                event.target.removeEventListener('click' ,click_event , true)}
        
    }

    function change_display(item){
        if (!props.open){
            if(mq.matches){item.style.display= 'none'}
            else{
            item.style.transform = 'translateX(-270px)'
            setTimeout(()=>{
                item.style.display = 'none'
                
            },300)}
        }else{
            item.style.display = 'flex'
            item.style.transform = 'translateX(0px)'
            item.addEventListener('click' , click_event , true)

        }
    }


    var login_context = useContext(Login_context)
    useEffect(()=>{
        change_display(ref.current['menu_box'])
    }, [props.open])

    const [login , set_login ] = useState(Boolean(sessionStorage.session))


    useEffect(()=>{
        if( sessionStorage.session === login_context ){
            set_login(true)
        }else{ set_login(false) }

    } , [sessionStorage.session , login,login_context])


    let mq = window.matchMedia('(min-width: 576px)')

    
    try{if (!mq.matches){
        ref.current["menu_container"].style.left = 0
    }}catch(err){
        console.log(err)}

    return(
        <div className="menu_box" id = "menu_box"  ref= {el => ref.current['menu_box'] = el}  >
            <div className="menu_container" id = "menu_container" ref = { el => ref.current['menu_container']=el}>
                <UserImage onClick = {()=>props.onClick()} width = "80px"  height = "80px" to = {login?`/Profile/${profile_photo()}`:'/Signup'} user_id={profile_photo()} login_state = {props.login_state}  />
                <MenuItem onClick = {()=>props.onClick()}  img = {homeIcon} to = "/Home" >Home</MenuItem>
                <MenuItem  onClick = {()=>props.onClick()} to = "/Blogians"  img = {blogians}>Blogians</MenuItem>
                <MenuItem  onClick = {()=>props.onClick()} to = "/UploadBlog"  img = {uploadBlogIcon}>Upload Blog</MenuItem>
                <MenuItem  onClick = {()=>props.onClick()} to = "/Login" logout = {login?true:false} img = {login?logoutIcon:loginIcon}>{login?"Logout":"Login"}</MenuItem>


            </div>
        </div>
    )
}

var MenuItem = props=>{
    const child_style = {
        width : '60%',
        position : 'inherit',
        backgroundImage : `url(${props.img})`,
        backgroundRepeat : 'no-repeat',
        backgroundSize: "25px 25px",
        backgroundPosition: "0px 0px",
        paddingLeft : "40px",
        minHeight : '30px',
        fontSize : '25px',
        fontWeight : '500',
        fontFamily : "sans-serif",
    }
    const menuItem_style = {
        position:'inherit',
        width : '100%',
        height: '100%',
        display : 'flex',
        justifyContent : 'center',
        placeItems : 'center',
    }

    const click= ()=>{
        props.onClick()
        if( props.logout === true){
            logout()
        }
    }

    return (
        <Link  to = {props.to} onClick={()=>click()} style = {{textDecoration: 'none'}}>
        <div style = {menuItem_style} className="menuItem">
            <div style = {child_style}>{props.children}</div>
        </div>
        </Link>
    )
}

MenuItem.propType = {
    to : PropType.string,
    img : PropType.string.isRequired
}

export default Menu;