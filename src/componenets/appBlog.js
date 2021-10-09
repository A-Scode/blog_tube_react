import { useContext, useEffect, useState ,useRef, useCallback, useMemo} from "react";
import { useHistory } from "react-router";
import { Blog } from "./appUploadBlog";
import { BlogiansMiniProfile } from "./appBlogians";
import appConfig from './statics/appConfig.json'
import './statics/css/appUploadBlog.css'
import './statics/css/appBlog.css'
import view_logo from './statics/images/preview.svg'
import like_logo from './statics/images/like.svg'
import dislike_logo from './statics/images/dislike.svg'
import { Login_context } from "../App";
import UserImage from "./userImage";
import { logout } from "./statics/utils";

const AppBlog  = props=>{
    const url = new URLSearchParams(window.location.search)
    const blog_id = url.get('id')    
    const history = useHistory()
    if (blog_id === null){
        history.push('/blog_tube_react/Error')
    }

    const [blog_data_list , set_blog_data_list] = useState([])
    const [blog_details , set_blog_details] = useState({likes:"" , dislikes:"" ,
     views :"" , title:"" , image_url:"",blogger_details:{}})

     const ref = useRef({})
    useEffect(()=>{
    const xhr = new XMLHttpRequest()
    xhr.open('GET' ,appConfig.origin+'backend_api/getBlog?blog_id='+blog_id )
    xhr.onreadystatechange =()=>{
        if (xhr.readyState === 4 && xhr.status === 200){
            let response = JSON.parse(xhr.response)
            switch (response.status){
                case "success":
                    set_blog_data_list(response.blog)
                    set_blog_details({likes:response.likes ,
                                      dislikes:response.dislikes ,
                                    views:response.views ,
                                title :response.title ,
                            image_url:response.image_url,
                                blogger_details : response.blogger_details})
                    break;
                case "page_not_found":
                    history.push('/blog_tube_react/Error')
                    break;
                case "fail":
                    history.push('/blog_tube_react/Error')
                    break;
                default:
                    break;
            }
        }
    }
    xhr.send()

    },[])

    var full = false

    const getFullScreen = useCallback(()=>{
        if (!full){
        document.documentElement.requestFullscreen()
        .then( ()=>full= true)
        .catch(()=>full = false)}    
        
    },[ref.current.blog_page])
    useEffect(()=>{
        let ele  = document.getElementsByClassName("appbody")[0]
        ele.scrollTo(0,0)
    }
    
    ,[blog_details])


    return(<div  className = "blog_page" ref ={el=>ref.current.blog_page = el} onMouseDown={getFullScreen} >
        <h2 align = "center">{blog_details.title}</h2>
        <img src = {blog_details.image_url} className = "title_image" loading = {"eager"} />
        <BlogiansMiniProfile user_details = {blog_details.blogger_details} onClick={()=>null}  to ={`/blog_tube_react/Profile/${blog_details.blogger_details.user_id}`} />
        <Blog>
            {blog_data_list.map((item,index)=>(<div key = {index} className = "container_data" dangerouslySetInnerHTML = {{__html:item}}></div>))}
        </Blog>
        <ReviewBlog blog_id = {blog_id} likes = {blog_details.likes} dislikes= {blog_details.dislikes} views= {blog_details.views} />
        <Comments  blog_id = {blog_id} />
    </div>)
}

export default AppBlog

const ReviewBlog=props=>{
    const session_id = useContext(Login_context)
    const history = useHistory()
    const[ reviewed  ,set_reviewed] = useState("not yet")
    const[reviews ,set_reviews] =useState({likes : props.likes ,dislikes : props.dislikes ,views : props.views})
    const ref = useRef({})
    useEffect(()=>{
        set_reviews({likes : props.likes ,dislikes : props.dislikes ,views : props.views})
    },[props.likes , props.dislikes , props.views])

    const review=useCallback(event=>{
        let opt = event.target.value
        if (session_id === sessionStorage.session ){
            let xhr = new XMLHttpRequest()
            let uid = JSON.parse(localStorage.login_data).user_id
            xhr.open('POST' , appConfig.origin+`backend_api/Blogreview`)
            xhr.onreadystatechange=()=>{if(xhr.readyState===4 && xhr.status===200){
                let response = JSON.parse(xhr.response)
                if(response.status==="success"){
                    set_reviews({...response.details})
                }
            }}
            let formdata = new FormData()
            formdata.append('uid' , uid)
            formdata.append('bid' , props.blog_id)
            formdata.append('review' , opt)
            xhr.send(formdata)
        }else{
            history.push('/blog_tube_react/Error')
        }
    },[session_id,props.blog_id ])
    useEffect(()=>{
        if (session_id===sessionStorage.session){

            let xhr = new XMLHttpRequest()
            let uid = JSON.parse(localStorage.login_data).user_id
            xhr.open('GET' , appConfig.origin+`backend_api/checkReviewr?bid=${props.blog_id}&uid=${uid}`)
            xhr.onreadystatechange=()=>{if(xhr.readyState===4 && xhr.status===200){
                let response = JSON.parse(xhr.response)
                if(response.status==="success"){
                    set_reviewed( response.isreviewer)
                }
            }}
            xhr.send()
        }
    },[session_id])
    useEffect(()=>{
        if (reviewed === "like"){
            ref.current.like.click()
        }else if (reviewed === "dislike"){
            ref.current.dislike.click()
        }
    },[reviewed])

    
    return(
        <div className="review">
            <input type="radio" name="review" ref = {el=>ref.current.like = el}  id="like" value= {"like"} onInput={e=>review(e)}  hidden/>
            <label htmlFor="like" id="like_label" style={{backgroundImage:`url(${like_logo})`}} >{reviews.likes>0?reviews.likes:"No Likes"}</label>
            <label id ="view_label" style={{backgroundImage:`url(${view_logo})`}}>{reviews.views>0?reviews.views:"No Views"}</label>
            <input type="radio" name="review" ref = {el=>ref.current.dislike = el}  id="dislike" value={"dislike"} onInput={e=>review(e)} disabled={!session_id} hidden/>
            <label htmlFor="dislike" id="dislike_label" style={{backgroundImage:`url(${dislike_logo})`}}  >{reviews.dislikes>0?reviews.dislikes:"No Dislikes"}</label>
        </div>
    )
}

const Comments =props=>{
    let session_id = useContext(Login_context)
    const ref = useRef({})
    const [login_status , set_login_status] = useState(false)
    const history = useHistory()
    useEffect(()=>{
        if(session_id === sessionStorage.session){
            set_login_status(true)
        }else{
            set_login_status(false)
        }
    },[session_id])

    const [comment_list , set_comment_list] = useState([])

    useEffect(()=>{
        let xhr = new XMLHttpRequest()
        xhr.open('POST' , appConfig.origin+`backend_api/getComments`)
        xhr.onreadystatechange=()=>{
            if(xhr.status===200 && xhr.readyState === 4 ){
                let response = JSON.parse(xhr.response)
                switch (response.status) {
                    case "success":
                        set_comment_list(response.comment_list)
                        console.log(response)
                        break;
                    case "loginRequired":
                        console.log(`backend_api/getComments`)
                        logout()
                        history.push("/blog_tube_react/Login")
                        break;
                
                    default:
                        console.log(response.status)
                        break;
                }
            }
        }
        let formdata = new FormData()
        formdata.append('blog_id' , props.blog_id)
        xhr.send(formdata)
        
    },[props.blog_id])

    const send_comment = useCallback(()=>{
        let comment = ref.current.comment_input.value
        if (session_id === sessionStorage.session &&  comment !== ''){
            const xhr = new XMLHttpRequest()
            xhr.open("POST" , appConfig.origin+`backend_api/uploadComment`)
            props.appbodyloading('flex')
            xhr.onreadystatechange = ()=>{
                if(xhr.readyState === 4 && xhr.status === 200){
                let response = JSON.parse(xhr.response) 
                ref.current.comment_input.value =''
                switch (response.status) {
                    case "success":
                        console.log(response)
                        set_comment_list([response.new_comment ,...comment_list])
                        props.appbodyloading('none')
                        break;
                    case "loginRequired":
                        console.log(response.status)
                        logout()
                        history.push("/blog_tube_react/Login")
                        props.appbodyloading('none')
                        break;
                    case "fail":
                        console.log(response.status)
                        history.push("/blog_tube_react/Error") 
                        props.appbodyloading('none')
                        break;              
                    default:
                        console.log(response.status)
                        props.appbodyloading('none')
                        break;                                 // list has to be updated here
            }}}
            const formdata = new FormData()
            xhr.setRequestHeader("session" ,session_id )
            formdata.append("comment" , comment)
            formdata.append("user_id"  , JSON.parse(localStorage.login_data).user_id)
            formdata.append("blog_id" , props.blog_id)
            xhr.send(formdata)
        }
    
    },[session_id,ref.current.comment_input.value,localStorage])
    const cList = useMemo(()=>(comment_list.map(item=>(<Comment c_detials = {item} key ={item.cid} />))))
    const nList = useMemo(()=>(<span style ={{display:"grid",placeItems:"center",
    fontSize:"30px",width:"100%" ,height:"100%"}} id = "no_comments">No Comments😅</span>))
    return(<div className="comments">
                <h5 align = "center">Comments</h5>
                <div className="cover">
                <textarea name="comment" maxLength={1000} id="comment_input"  disabled={!login_status}
                ref={el=>ref.current.comment_input = el} cols="3" rows="5">
                </textarea>
                <button ref = {el=>ref.current.send_comment = el} disabled= {!login_status}
                   id="send_comment" onClick = {()=>send_comment()} ></button>
                </div>
                <div className="comment_list">
                    {comment_list.length ===0?nList: cList }
                </div>
            </div>
    )
}

const Comment = props=>{
    return (
        <div className="comment" id = {props.key}>
            <UserImage user_id= {props.c_detials.uid} width={"50px"} height="50px"
             style= {{gridArea :"user_image" , borderWidth : "2px" , alignSelf : "center" , justifySelf: "center"}}
             to = {`/blog_tube_react/Profile/${props.c_detials.uid}`} onClick={()=>null} />
            <span id="user_name">{props.c_detials.name}</span>
            <p className="comment_text" style={{whiteSpace:"break-spaces"}}>{props.c_detials.text}</p>
            <div className="datetime">{props.c_detials.upload_datetime}</div>
        </div>
    )
}
export {Comment}