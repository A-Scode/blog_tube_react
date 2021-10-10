import appConfig from './appConfig.json'

const logout = ()=>{
    if (sessionStorage.session){
    let xhr = new XMLHttpRequest()
    xhr.open('POST'  , appConfig.origin + "backend_api/logout")
    xhr.onreadystatechange = ()=>{
        if (xhr.readyState === 4 && xhr.status === 200){
            console.log("successfully Logged Out")
            delete sessionStorage.session
            delete sessionStorage.login_data
        }
    }
    xhr.setRequestHeader('session' ,sessionStorage.session )
    xhr.setRequestHeader('user_id'   , JSON.parse(sessionStorage.login_data).user_id)
    xhr.send()
}
}




export { logout}