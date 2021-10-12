import './statics/css/appLogin.css'
import email_logo from './statics/images/email.svg'
import password_logo from './statics/images/password.svg'
import form_background from './statics/images/form_background.svg'
import appConfig from './statics/appConfig.json'

import anime from 'animejs'
import { Login_context } from '../App'
import { useEffect, useRef , useState , useContext, useCallback, useMemo} from 'react'
import {
    Link} from 'react-router-dom'

var AppLogin = props=>{
   
    let ref = useRef({})

    let login_context = useContext(Login_context)

    let [Error, set_Error] = useState('form')

    useEffect(()=>{
        try{
            anime({
                targets:ref.current['heading'],
                update:function(anime){
                    try{
                    ref.current['heading'].style.filter = `hue-rotate(${anime.progress *3.6}deg)`
                    }catch(err){let get }
                },
                duration:2000,
                autoplay:true,
                direction:'alternate',
                loop:true
            })
        if (Error){
            ref.current['form'].style.backgroundImage = `url(${form_background})`
            if(ref.current['email'])ref.current['email'].style.backgroundImage = `url(${email_logo})` 
            if(ref.current['confirm_password'])ref.current['confirm_password'].style.backgroundImage = `url(${password_logo})` 
        ref.current['password'].style.backgroundImage = `url(${password_logo})`
    }
    }catch(err){
        console.log(err)
    }


    },[ref , Error])

    const origin = appConfig.origin

   let Login = useCallback((event)=>{
       event.preventDefault()
        let form = event.target
        let email_input = form[0]
        let password_input = form[1]

        let xhr = new XMLHttpRequest()
        xhr.open('POST', `${origin}backend_api/loginmanully`)
        props.appbodyloading('flex')

        xhr.onreadystatechange = ()=>{
            if (xhr.status === 200 && xhr.readyState === 4){
                let response = JSON.parse(xhr.response)
                
                if(response.status === "fail"){
                    set_Error("error")
                    props.appbodyloading('none')

                }else if(response.status === "not_match"){
                    password_input.focus()
                    password_input.setCustomValidity('⚠️invalid password⚠️Forgot password ?')
                    password_input.reportValidity()
                    setTimeout(()=>password_input.setCustomValidity('') , 2000)
                    props.appbodyloading('none')

                }else if(response.status === "success"){
                    props.change_login_context(response.session)
                    sessionStorage.setItem('session', response.session)
                    let login_data = JSON.stringify(response.login_data)
                    localStorage['login_data'] = login_data
                    sessionStorage['login_data'] = login_data
                    props.appbodyloading('none')

                }
            }
        }

        xhr.setRequestHeader("credentails" , JSON.stringify({email : email_input.value,
                                                        password : password_input.value}))
        xhr.send()
    })
    

    let login_form =useMemo(()=> (<><h1 align='center' ref = {el =>ref.current['heading'] =el} >Login</h1>
    <form action= 'javascript:void(0);' method = 'POST' onSubmit =  {(e)=>Login(e) } >  
        <input id='email' maxLength={100} type="email" ref= {el=>ref.current['email']= el} placeholder = 'Email' required = {true} />
        <input type="password" minLength={8} maxLength={100} id='password' ref = {el=>ref.current['password']=el}  placeholder= "Password" required = {true} />
        <input className='submit' type="submit"  value= 'Login'   />
        <div className="redirectSignup">
                    <p>Didn't Have an account?<Link to = '/blog_tube_react/Signup'>SignUp</Link>
                    <br />
                    <a href = "#" onClick = {()=>set_Error('ask_email')} >Forgot Password </a>
                    </p>
                </div>
    </form></>))

    let error_msg =useMemo(()=> (<div className = 'error'>
    <h2 ref = {el =>ref.current['heading'] =el} align = 'cetner'>Invalid Credentials</h2>
    <button className = "back"  onClick = {()=>set_Error("form")} >Back</button>
    
    </div>))

    //email_form functions
    let forgot_pass_email= useCallback(event=>{
        let form = event.target
        let email_input = form[0]
        let email = email_input.value

        let xhr = new XMLHttpRequest()
        xhr.open('POST', origin + "backend_api/forgototp")
        props.appbodyloading('flex')

        xhr.onreadystatechange = ()=>{
            if(xhr.status === 200 && xhr.readyState === 4){
                let response = JSON.parse(xhr.response)
                console.log(response)

                if (response.status === "error"){
                    set_Error('error')
                    props.appbodyloading('none')
                }else if (response.status === 'success'){
                    set_Error('otp')
                    props.appbodyloading('none')
                }
            }
        }

        xhr.setRequestHeader("userData" , JSON.stringify({ email : email}))
        xhr.send()
    })

    let email_form = useMemo(()=>(<>
            <h1 align='center' ref = {el =>ref.current['heading'] =el} >Email</h1>
        <div className = "forgot_form"  >
            <form action="javascript:void(0);" onSubmit = {forgot_pass_email} >
            <input type="email" id='email' ref={el => ref.current['email']=el} placeholder= "Email" required = {true} />
            <input className='submit' type="submit"  value= 'Submit'   />
            </form>
        </div>
        </>
    ))
    
    let forgot_pass_otp = useCallback( event =>{
        let form = event.target
        let otp_input  = form [0]

        let xhr = new XMLHttpRequest()
        xhr.open('POST', origin+'backend_api/validateforgototp')
        props.appbodyloading('flex')

        xhr.onreadystatechange = ()=>{
            if (xhr.status === 200 && xhr.readyState === 4){
                let response = JSON.parse(xhr.response)
                console.log(response)
                
                if(response.status === 'fail'){
                    otp_input.focus()
                    otp_input.setCustomValidity('⚠️invalid OTP⚠️')
                    otp_input.reportValidity()
                    props.appbodyloading('none')
                }else if (response.status === 'success'){
                    set_Error('change_password')
                    props.appbodyloading('none')
                }
            }
        }

        xhr.setRequestHeader('otp' , otp_input.value)
        xhr.send()
    })
    const validotp= useCallback((e)=>{
        if(e.target.value.length > 4){e.target.setCustomValidity('OTP must be of 4 digit');e.target.reportValidity()}
        else if(e.target.value.length < 4){e.target.setCustomValidity('OTP must have 4 digits')}
        else{e.target.setCustomValidity('')}
    })

    let otp_form = useMemo(()=>(<>
            <h1 align='center' ref = {el =>ref.current['heading'] =el} >OTP</h1>
            <div className = "forgot_form"  >
            <form action="javascript:void(0);" onSubmit = {forgot_pass_otp} >
            <input type="number" onInput={validotp} id= "password"
            ref = {el=>ref.current['password']=el}  
            placeholder= "OTP" required = {true}
            style= {{fontSize : '35px', letterSpacing : "20px" , paddingLeft: "60px"}}
             />
            <input className='submit' type="submit"  value= 'Submit'   />
            </form>
        </div>
    </>))

    let change_pass =useCallback( event =>{
        let form = event.target
        let password_input = form[1]

        let xhr = new XMLHttpRequest()
        xhr.open('POST' , origin + 'backend_api/changepassword')
        props.appbodyloading('flex')

        xhr.onreadystatechange  = ()=>{
            if (xhr.status === 200 && xhr.readyState === 4){
                let response  = JSON.parse(xhr.response)
                
                if (response.status === 'fail'){
                    password_input.focus()
                    password_input.setCustomValidity('Something went wrong')
                    password_input.reportValidity()
                    props.appbodyloading('none')
                }else if (response.status === 'success'){
                    set_Error('form')
                    props.appbodyloading('none')
                }
            }
        }

        xhr.setRequestHeader('newpass' , password_input.value)
        xhr.send()
    })


    let change_pass_from = useMemo(()=>(
        <><h1 align='center' ref = {el =>ref.current['heading'] =el} >Change</h1>
    <form action= 'javascript:void(0);'  onSubmit = {change_pass} >  
    <input type="password" minLength={8} maxLength={100} id='password' ref = {el=>ref.current['password']=el}  placeholder= "New password" required = {true} />
        <input type="password" minLength={8} maxLength={100} id='password' onInput = {(e)=>e.target.setCustomValidity('')} ref = {el=>ref.current['confirm_password']=el}  placeholder= "Confirm password" required = {true} />
        <input className='submit' type="submit"  value= 'Change'   />
                    
    </form></>
    ))


    return (
        <div className="login">
            <div className="form" ref = {el =>ref.current['form'] = el}>
                 {Error === "form"?login_form :null }
                 {Error === "ask_email"? email_form :null}
                 {Error === "otp" ? otp_form :null}
                 {Error === "change_password" ? change_pass_from :null}
                 {Error === "error"? error_msg:null}

                

                
            </div>
        </div>
    )
}


export default AppLogin;