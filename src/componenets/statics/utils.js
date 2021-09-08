import appConfig from './appConfig.json'
const profile_photo=()=>{
    if (sessionStorage.session){
        let id = JSON.parse(localStorage.getItem('login_data')).user_id
        return id
    }
    else{
        let id = "unknown"
        return id
    }
}
const logout = ()=>{
    if (sessionStorage.session){
    let xhr = new XMLHttpRequest()
    xhr.open('POST'  , appConfig.origin + "backend_api/logout")
    xhr.onreadystatechange = ()=>{
        if (xhr.readyState == 4 && xhr.status == 200){
            console.log("successfully Logged Out")
            delete sessionStorage.session
        }
    }
    xhr.setRequestHeader('session' ,JSON.stringify(sessionStorage.session) )
    xhr.send()
}
}




export {profile_photo , logout}