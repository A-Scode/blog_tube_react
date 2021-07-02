import './statics/css/appBlogians.css'
import appConfig from './statics/appConfig.json'
import {useEffect, useState } from 'react'
import blogiansIcon from './statics/images/blogians.svg'
import PropTypes from 'prop-types'

var AppBlogians = props=>{
    const [user_list , set_user_list] = useState([])

    useEffect(()=>{
    var xhr = new XMLHttpRequest()
    xhr.open('GET' , appConfig.origin + "backend_api/userlist")
    xhr.onreadystatechange = ()=>{
        if (xhr.readyState == 4 && xhr.status == 200){
            let response = JSON.parse(xhr.response)

            if (response.status == 'success'){
                set_user_list(response.userslist)
            }else if (response.status == 'fail'){
                set_user_list([])
            }
        }
    }
    xhr.send()
},[])

    return (<div className="blogians">
                <input className = "blogiansInput" style= {{backgroundImage:`url(${blogiansIcon})`}} type = "text" placeholder = "Search Blogians" />
                <div className="allBlogians">
                    {user_list.map(item=>{
                        <blogiansMiniProfile user_details = {item} />
                    })}
                </div>
            </div>
    )
}


function blogiansMiniProfile(props){
    return(
        <div className="miniprofile">
            <div className="profilePhoto">
            </div>
            <div className="profile_name">{props.user_details.user_name}</div>
            {props.user_details.total_blogs === 0 ?<div className="tag">🏹Blogger</div>:null}
        </div>
    )
}

blogiansMiniProfile.propTypes = {
    user_details : PropTypes.object.isRequired
}



export  default AppBlogians;
