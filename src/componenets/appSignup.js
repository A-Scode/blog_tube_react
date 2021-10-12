import './statics/css/appSignup.css'
import {useState,useRef , useEffect, useCallback} from 'react'
import username from './statics/images/username.svg'
import password from './statics/images/password.svg'
import email from './statics/images/email.svg'
import uplaod_background_image from './statics/images/upload_image_background.svg'
import signup_background from './statics/images/signup_background.svg'
import { Link } from 'react-router-dom'
import appConfig from './statics/appConfig.json'

import anime from 'animejs'


var AppSignup = props=>{


    let chars = {"!":null , "#":null , "$":null,"%":null,"^":null,"&":null,"*":null,"(":null,")":null,"'":null, '"':null,";":null, ":":null}


    function checkUsername(event) {
        event.preventDefault()
        let filtered_list = [...event.target.value].filter((item)=> !(item in chars))
        let list = [...event.target.value]

        if( filtered_list.join('') == list.join('') ){
                event.target.setCustomValidity("")
            }

        else if (event.nativeEvent.data === '"' || event.nativeEvent.data === "'"){
            event.target.value = event.target.value.slice(0, event.target.value.length-1)
        }else if (event.nativeEvent.data in chars ){
            event.target.setCustomValidity("username should not contain \n ------------ ?!:;\"'#$%^&*() ------------")
            event.target.reportValidity()
            
        }
    }

    function removequotes(event){
        if (event.nativeEvent.data === '"' || event.nativeEvent.data === "'"){
            event.target.value = event.target.value.slice(0, event.target.value.length-1)
            event.target.setCustomValidity('Cannot use " or \' ')
            event.target.reportValidity()
        }else{
            event.target.setCustomValidity('')
            
        }
    }

    const ref = useRef({})



    // useEffect for ref
    useEffect(()=>{
try{
    anime({
        targets:ref.current['signup_heading'],
        update:function(anime){
            try{
            ref.current['signup_heading'].style.filter = `hue-rotate(${anime.progress *3.6}deg)`
            }catch(err){
                
            }
        },
        duration:2000,
        autoplay:true,
        direction:'alternate',
        loop:true
    })
        set_refs()
    }catch(err){
        console.log(err)
    }

    }, [ref, block_state])

    let set_refs = ()=>{
        ref.current['signup_form'].style.backgroundImage = `url(${signup_background})`
        ref.current['username'].style.backgroundImage = `url(${username})`
        ref.current['password'].style.backgroundImage = `url(${password})`
        ref.current['email'].style.backgroundImage = `url(${email})`
        ref.current['image'].style.backgroundImage = `url(${uplaod_background_image})`


    }

    var [block_state, set_block_state] = useState('form')

    const origin = appConfig.origin
    const data_ref = useRef({});

    let submit_data=(event)=>{
        
        let xhr = new XMLHttpRequest()
        props.appbodyloading('flex')
        xhr.onreadystatechange = ()=>{
            console.log(xhr.status, xhr.readyState)
            if (xhr.status === 200 && xhr.readyState ===4){
                let response = JSON.parse(xhr.response)
                console.log(response)
                
                if(response.status === "exists"){
                        ref.current['email'].focus()
                        ref.current['email'].setCustomValidity('This Email Exists!!!')
                        ref.current['email'].reportValidity()
                        props.appbodyloading('none')

                    }
                    else if(response.status === "otp"){
                        set_block_state("otp")
                        ref.current['otp_input'].style.backgroundImage = `url(${password})`
                        props.appbodyloading('none')
                        
                    }
                    else if(response.status === "fail"){
                        set_block_state("error")
                        props.appbodyloading('none')

                    }
                }
            }
        
        
        
        xhr.open('POST',origin+'backend_api/signup')
        let progressbar = document.getElementById('progressbar')
        xhr.upload.addEventListener('progress',(event)=>{
            let percent = Math.round( (event.loaded/event.total)*100)
            progressbar.style.width = `${percent}%`
            progressbar.innerText = `Image ${percent}%`
        })
        xhr.upload.onloadend = ()=>{
            progressbar.style.width = `${0}%`
            progressbar.innerText = ''
        }

        let form = event.target
        data_ref.current.username = form[0].value
        data_ref.current.email    = form[1].value
        data_ref.current.password = form[2].value
              
        xhr.setRequestHeader('userData' , JSON.stringify(data_ref))

        let form_data = new FormData()
        let imagefile = form[4].files[0]
        console.log(imagefile)
        form_data.append('image' , imagefile)
        imagefile?
        xhr.send(form_data)
        :xhr.send()
            }

    
    var input_id
    var prev_value
    function change_image(){
        try{
        if (ref.current['image_input'].value !== '' && ref.current['image_input'].value !== prev_value ){
            try{let image_url = URL.createObjectURL( ref.current['image_input'].files[0])
            ref.current['image'].style.backgroundImage = `url(${image_url})`}catch(e){console.log(e)}
            prev_value = ref.current['image_input'].value
            clearInterval(input_id)
    }}catch(e){}
    }

    const check_otp = useCallback((event)=>{
        let form = event.target
        let otp_input = form[0]
        if(otp_input.value.length !== 4){
            otp_input.focus()
            otp_input.setCustomValidity('OTP must be of 4 digits!!!')
            otp_input.reportValidity()
            return
        }else{ 
            otp_input.setCustomValidity('')
            otp_input.reportValidity()
        }
        let xhr = new XMLHttpRequest()
        props.appbodyloading('flex')

        xhr.open( 'POST', origin+'backend_api/verifyotp' )
        xhr.onreadystatechange = ()=>{
            if(xhr.status === 200 && xhr.readyState === 4){
                let response = JSON.parse(xhr.response)
                console.log(response)
                
                if(response.status === 'fail'){
                    otp_input.focus()
                    otp_input.setCustomValidity('⚠️ Wrong OTP⚠️ Signup Again!!! ')
                    otp_input.reportValidity()
                    setTimeout(()=>{set_block_state('form');set_refs()},2000)
                    props.appbodyloading('none')

                }else if (response.staus === 'success'){
                    set_block_state('success')
                    props.appbodyloading('none')

                }
            }
        }

        xhr.setRequestHeader('otp' , otp_input.value)
        xhr.setRequestHeader('email' , data_ref.current.email)
        xhr.send()
        
    },[data_ref])

    let form_block = (<>
        <h1 className = "signup_heading" ref = {el=>ref.current['signup_heading']=el} >Sign Up</h1>
        <form action="javascript:void(0);" onSubmit = {event=>submit_data(event)}>
            <input required = {true} type="text" placeholder = 'Username' className= 'signup_username' ref = {el => ref.current['username']= el} maxLength={100} onInput= {event=>checkUsername(event)} />
            <input required = {true} type= "email" placeholder = 'Email' className= "signup_email"  ref = {el => ref.current['email']= el}  maxLength={100} onInput= {e=>removequotes(e)} />
            <input required = {true} type="password" placeholder = 'Password' className= 'signup_password'  ref = {el => ref.current['password']= el}  minLength={8} onInput={e=>removequotes(e)}  />
            <input type="submit" id = "signup_submit" value="Sign Up" />
            <div className="upload_image" ref = {el => ref.current['image']=el} >
                <input type="file"  id = 'file_input'  ref = {el=>ref.current['image_input']=el}  accept= "image/*"  />
                <label htmlFor= "file_input" id = "file_input_label" ref = {el=>ref.current['image_percent']= el}  onClick={()=>input_id = setInterval(change_image, 2000)}  >100%</label>
            </div>
        </form>
        </>)


    let otp_block = (<>
        <h1 className = "signup_heading" ref = {el=>ref.current['signup_heading']=el} align='center' style = {{color:'rgb(24, 151, 201)'}} > 
        OTP
        </h1>
        <form action= {'javascript:void(0);'} onSubmit = {event =>{set_block_state('otp') ;check_otp(event)}} >
            <input required = {true} type="number" ref= {el=>ref.current['otp_input']=el} className = "signup_password"   onInput= {(e)=>{e.target.value.length>4?
                e.target.setCustomValidity('No More than 4 Digits')
                :e.target.setCustomValidity('')
                e.target.reportValidity()
                }} style = {{gridColumn:'1 / span 2',gridRow:'1 / span 2' , marginRight:'20px', marginLeft : '20px',fontSize:'30px', letterSpacing:'32px', color:"#0334dd" }} />

            <ul className = 'instList'>
                <li>Check Email for OTP</li>
                <li>Must have 4 digits</li>
                <li>Email is identity</li>
            </ul>
            <input type="submit" id = "signup_submit"  />
        </form>
        </>)

    let error_block = ( <>
        <h2 className = "signup_heading" ref = {el=>ref.current['signup_heading']=el} align='center' style = {{color:'rgb(24, 151, 201)'}} >Error Occured!!</h2>
        <button id = "signup_submit" onClick= {()=>{set_block_state('form')
    setTimeout(()=>set_refs(),500)
    }} style = {{justifySelf:'center',  gridColumn: '1/span 2', cursor:'pointer'}}>Back</button>
        </>)

        let success_block = (<>
            <h3 ref = {el=>ref.current['signup_heading']=el} style = {{color:'rgb(24, 151, 201)', gridColumn:'1/ span 2'}}  align='center'>🎉Welcome🎉</h3>
             <button id = "signup_submit"  style = {{justifySelf:'center',  gridColumn: '1/span 2',cursor:'pointer'}}><Link style  = {{textDecoration:'none'}} to  = "/blog_tube_react/Login"><span>Login</span></Link></button>
            
            </>)

 
    return(
      <div className="signup">
          <div className="signup_form"  ref = {el=>ref.current['signup_form']=el}>
            { block_state==='form'?form_block
                : null}
            {block_state === 'otp'?otp_block
            :null}
            {block_state==='error'?error_block
            :null
            }
            {block_state==='success'?success_block
        :null}
                
          </div>
          <div className="progress signup_heading" id = 'progressbar'></div>
      </div>
    )
}

export default AppSignup