import './statics/css/appUserProfile.css'
import {useParams} from 'react-router-dom'
import { useContext , useEffect ,useState} from 'react'

const AppUserProfile = props =>{
    let {user_id} = useParams()

    return (<div className = "profile_div">
        <div className = "pic backgorud"></div>
   <h1>{user_id}</h1>
    </div>)
}

export default AppUserProfile;