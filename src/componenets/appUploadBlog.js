import React ,{useEffect ,useContext , useState, useCallback, useMemo, useRef} from 'react'
import { useHistory, useRouteMatch  } from 'react-router'
import { CacheSwitch as Switch , CacheRoute as Route  } from 'react-router-cache-route'
import { Login_context } from '../App'
import './statics/css/appUploadBlog.css'
import $ from "jquery"
import preview_image from './statics/images/preview.svg'
import editor_image from './statics/images/editor.svg'
import youtubeLogo from './statics/images/youtubeLogo.svg'
import popComp from './statics/images/popComp.svg'
import appConfig from './statics/appConfig.json'


var final_data = {}

var AppUploadBlog = props=>{
    var login_context  = useContext(Login_context)
    const history  = useHistory()
    const ref = useRef({})

    const [upload_blog_state , set_upload_blog_state] = useState('blog')
    
    
    const change_image = useCallback(event=>{
        let target = $('#label_image')
        if (event.target.files != []){
        let image_file = event.target.files[0]
        
        let image_url = URL.createObjectURL(image_file)
        let image_span = $('#image_span')
        image_span.css({
            'backgroundImage':`url(${image_url})`,
            backgroundSize:'contain',
            backgroundPosition : 'center',
            backdropFilter:'blur(3px)',
            'borderRadius':'20px',
           
        })
        target.css({'backgroundImage': `url(${image_url})`})
        final_data['blog_title_image']=image_file
    }else
        target.css({'borderRadius':'20px',
           'backgroundSize' :'cover',
           "boxShadow": "0px 1px 7px 3px #1976d2"
        })        
    },[])

    const forward_to_editor = useCallback((event)=>{
        event.preventDefault()
        final_data.title = ref.current['blog_title'].value
        final_data.discription = ref.current['blog_discription'].value
        set_upload_blog_state('blog_editor')
        history.push("/UploadBlog/editor")
    })
    
    const blog_info = useMemo(()=>(
        <form className="blog_info" action='javascript:void(0);' onSubmit = {event=>forward_to_editor(event)}>
            <div className="blog_info_child">
            <h1 align = "center">Blog Information </h1>
            <label htmlFor="blog_title" id = "label_title">Title</label>
            <input type="text" autoFocus placeholder = "Title" autoComplete="off" spellCheck="true" autoCapitalize="words"  id = "blog_title" maxLength={100} ref= {el =>ref.current['blog_title']=el} required />

            <label htmlFor="blog_discription" id = "label_discription">Discription</label>
            <textarea type="text" autoComplete="off" spellCheck="true" autoCapitalize="sentences" id="blog_discription" placeholder="Discription" maxLength={200} ref= {el =>ref.current['blog_discription']=el} />

            <span id="span_label" style = {{gridArea:"image",alignSelf:"center",justifySelf:"center" ,display:"grid"}}><label htmlFor="blog_image" id = "label_image" ><span id = "image_span"></span></label></span>
            <input type="file" id = "blog_image" accept="image/*" onChange={change_image} hidden />

            <input type="submit"  value="Next" id = "submit" />
            </div>

        </form>
    ),[upload_blog_state, change_image,forward_to_editor])

    const [editor_state,set_editor_state] = useState('editor')

    let set_to_editor= e=>{
        set_editor_state(e.target.value)
    }
    useEffect(()=>{
        if (editor_state==="editor"){
            history.push("/UploadBlog/editor")
            set_editor_state("editor")
        }else if (editor_state === "preview"){
            history.push("/UploadBlog/preview")
            set_editor_state("preview")
        }
    },[editor_state])

    const[blog , set_blog] = useState([])
    const set_myblog = useCallback(data=>set_blog(data))

    const blog_editor = useMemo(()=>(
        <div className="editor">
            <Editor_tabs change_state = {set_to_editor} editor_state = {editor_state} />

            <Switch>
                <Route exact path = "/UploadBlog/editor">
                    <Editing_pane appbodyloading = {state =>props.appbodyloading(state)} blog = {set_myblog} />
                </Route>
                <Route exact path="/UploadBlog/preview">
                    <Preview_tab list = {blog} appbodyloading={state =>props.appbodyloading(state)} />
                </Route>
            </Switch>
        </div>
    ))
    
    useEffect(()=>{
        final_data['blog_title_image']=""
        if (login_context !== sessionStorage.session){
            history.push('/Login')

            return null
        }
    },[])
    return(
        <div className="blog_upload_page">
            {upload_blog_state === 'blog'? blog_info : null}
            {upload_blog_state === 'blog_editor'?blog_editor:null}
        </div>
    )
}

export default  AppUploadBlog;

var Preview_tab =props =>{
    const history = useHistory()
    const [data_list, set_data_list] = useState([])
    useEffect(()=>{
        if (props.list ){
        console.log(props.list)
        props.appbodyloading('flex')
        let xhr = new XMLHttpRequest()
        xhr.open("POST" , appConfig.origin+"backend_api/blogPreview")
        xhr.onreadystatechange =()=>{
            if (xhr.readyState === 4 && xhr.status === 200){
                let response = JSON.parse(xhr.response)
                switch (response.status) {
                    case "success":
                        set_data_list(response.hydratedBlog)
                        console.log("data_list:",data_list)
                        props.appbodyloading('none')
                        break;
                    case "loginRequired":
                        history.push("/Login")
                        break
                    default:
                        console.log(response.status)
                        props.appbodyloading('none')
                        break;
                }
            }
        }
        xhr.setRequestHeader("session" , sessionStorage.session)
        xhr.setRequestHeader("contentType" , "application/json;charset=utf-8")
        let formdata = new FormData()
        formdata.append('blog' , JSON.stringify(props.list))
        xhr.send(formdata)}
    },[props.list])
    return(
        <div className="showpreview">
            <Blog>
                {data_list.map(item=>(<div className="container_data" dangerouslySetInnerHTML = {{__html: item}}></div>))}
            </Blog>
        </div>
    )
}

const Blog =props=>{
    return(<div className="blog_preview">
        {props.children}
    </div>)
}

export {Blog}


var Editor_tabs= props =>{
    const ref = useRef({})
    useEffect(()=>{
        ref.current[props.editor_state].click()
    },[props.editor_state])
    const {path , url} = useRouteMatch()

    useEffect(()=>{
        if (path === "/UploadBlog/editor"){
            props.change_state("editor")
        }else if (path === "/UploadBlog/preview"){
            props.change_state("preview")
        }
    },[])
    return(
        <div className="tabs">
            <input ref = {el=>ref.current['editor']=el} type="radio" name="tabs" id="editer_radio" value={"editor"} onInput= {(e)=>props.change_state(e)} hidden   defaultChecked />
            <label htmlFor="editer_radio" id = "label_editor" ><img src = {editor_image}  className = "label_ico" />Editor</label>
            <input ref = {el=>ref.current['preview']=el} type="radio" name="tabs" id="preview_radio" value= "preview" onInput= {(e)=>props.change_state(e)} hidden   />
            <label htmlFor= "preview_radio" id = "label_preview" ><img src = {preview_image}  className = "label_ico" />Preview</label>
        </div>
        )
}

var Editing_pane = props =>{
    const ref = useRef({})
    const [edit_state , set_edit_state ] = useState(true)

    const mq = window.matchMedia("(max-width : 767px)") 

    const switch_comp = useCallback(()=>{
        let display = ref.current['components'].style.display
        if (mq.matches){
            if (display === "none" || display === ""){
                ref.current['components'].style.display = "flex"
            }else{
                ref.current['components'].style.display = ""
            }
        }else{
            ref.current['components'].style.display = "flex"
        }

    },[mq])

    const [input_state , set_input_state] = useState("Heading")

    function change_input_state(event){
        set_input_state(event.target.value)
        ref.current['maintext'].focus()
    }

    useEffect(()=>{
        ref.current['maintext'].innerHTML = ""
        if (input_state === "Photo" || input_state === "Video"||input_state === "Youtube Video" ){
            set_edit_state(false)
            ref.current['maintext'].classList.remove("bullet_list")

        }else if(input_state === "List"){
            set_edit_state(true)
            ref.current['maintext'].classList.add("bullet_list")
        }        
        else{
            set_edit_state(true)
        ref.current['maintext'].classList.remove("bullet_list")
        }

        let widget ;


        switch (input_state) {
            case "Video":
                widget = (`<input type= "file" accept ="video/*" id = "videofile" hidden  required />
                           <label  for = "videofile">Video</label> `)
                set_edit_state(false)
                break;
            case "Photo":
                widget = (`<input type= "file" accept ="image/*" id = "photofile" hidden required />
                           <label  for = "photofile">Photo</label> `)
                set_edit_state(false)
                break;
            case "Youtube Video":
                widget = (` <label  for = "videolink" style = "border:none;padding:0;">video Link</label> 
                            <input  style="    height: 20px;
                            width: 90%;
                            margin: 0;
                            place-self: center;
                            padding: 0;
                            border-color: blueviolet;
                            border-radius: 5px"  type= "url" id = "videolink" required  />`)
                set_edit_state(false)
                break;        
            default:
                widget=""
                    set_edit_state(true)
                    break;
        }
        ref.current['maintext'].innerHTML = widget

    }, [input_state])

    const [blog , set_blog] = useState([])
    useEffect(()=>props.blog([]),[])

    const data_submit = e=>{
        e.preventDefault()
        e.nativeEvent.stopImmediatePropagation();
        if (input_state === "Heading"){
            let heading = ref.current['maintext'].innerText
            set_blog([...blog,{"Heading" : heading}])
            props.blog([...blog,{"Heading" : heading}])
            ref.current['maintext'].innerText = ""
        }else if (input_state === "Paragraph"){
            let para = ref.current['maintext'].innerText
            set_blog([...blog,{"Paragraph" : para}])
            props.blog([...blog,{"Paragraph" : para}])
            ref.current['maintext'].innerText = ""
        }else if (input_state === "List"){
            let list = ref.current['maintext'].innerText
            list = list.split("\n").filter(i=>i?i:null)
            set_blog([...blog,{"List":list}])
            props.blog([...blog,{"List":list}])
            ref.current['maintext'].innerText = ""
        }else if (input_state === "Photo"){
            
            let photofile = e.target[0].files[0]
            set_blog([...blog,{ "Photo": photofile , "name" : photofile.name}])
            props.blog([...blog,{ "Photo": photofile , "name" : photofile.name}])
        
        }else if  (input_state === "Video" ){
           
                
            let videofile = e.target[0].files[0]
            set_blog([...blog,{ "Video": videofile, "name" : videofile.name}])
            props.blog([...blog,{ "Video": videofile, "name" : videofile.name}])
           
        }
        else if (input_state === "Youtube Video"){
            let pathList = e.target[0].value.split('/')
            let temp_id = pathList[pathList.length - 1].split("=")
            let id = temp_id[temp_id.length - 1]
            set_blog([...blog,{"Youtube Video": id}])
            props.blog([...blog,{"Youtube Video": id}])
            e.target[0].value = ""
        }
        final_data.blog = blog
    }
    const login_context = useContext(Login_context)
    const history = useHistory()
    const submit_data  = useCallback(()=>{
        final_data.blog = blog
        console.log(final_data)
        props.appbodyloading('flex')
        if (login_context === sessionStorage.session){
            let login_data = JSON.parse(localStorage.login_data)
            let xhr = new XMLHttpRequest()
            let blog_details = JSON.stringify(final_data)
            xhr.open("POST" , `${appConfig.origin}backend_api/uploadBlog`)
            xhr.onreadystatechange = ()=>{
                if (xhr.readyState === 4 && xhr.status === 200){
                    let response =JSON.parse( xhr.response)
                    switch (response.status) {
                        case "loginRequired":
                            history.push('/Login')
                            props.appbodyloading('none')
                            break;
                        case "fail":
                            history.push('/Error')
                            props.appbodyloading('none')
                            break;
                        case "success":
                            history.push('/Home')
                            props.appbodyloading('none')
                            break;
                        default:
                            console.log(response.status);
                    }
                }
            }
            let formdata = new FormData()
            for (var i = 0; i < final_data.blog.length;i++ ){
                let el = final_data.blog[i]
                if (el.Photo){
                    formdata.append(el.name , el.Photo)
                }else if(el.Video){
                    formdata.append(el.name , el.Video)
                }
            }
            if (final_data.blog_title_image){
                formdata.append('blog_title_image' , final_data.blog_title_image)
            }
            xhr.setRequestHeader("session" , login_context)
            xhr.setRequestHeader("logindata" , login_data)
            formdata.append("blogDetails" , blog_details)
            xhr.send(formdata)
        }
    },[blog])
    
    function rmcomp(i){
        let b = blog
        b.splice(i, 1)
        console.log("b-",b)
        set_blog([...b])
        props.blog([...b])
    }

    useEffect(()=>{
        ref.current['editing'].scrollTo(0,ref.current['editing'].scrollHeight )
    },[blog])

    return (
        <div className="editing_pane">
            <div className="editing" ref ={el=>ref.current['editing']=el}>
                <button className = "upload" onClick ={submit_data}  >Upload</button>
                <button className = "addComponents" onClick = {switch_comp} ></button>

                {blog.map((value , index, arr)=>{return (<Blog_part data = {value} index={index} key= {index} arr= {arr} rm = {rmcomp} />)})}

            </div>
            <div className="components" ref = {el=>ref.current['components']=el}>
                <h6 align = "center" className="heading">Components</h6>
                <input onClickCapture={e=>change_input_state(e)} name="comp" hidden checked = {input_state === "Heading" } type="radio"  value="Heading"     id="Heading"    defaultChecked/>
                <label className="complist" htmlFor="Heading">Heading</label>
                <input onClickCapture={e=>change_input_state(e)} name="comp" hidden checked = {input_state === "Paragraph" } type="radio"  value="Paragraph"     id="Paragraph"    />
                <label className="complist" htmlFor="Paragraph">Paragraph</label>
                <input onClickCapture={e=>change_input_state(e)} name="comp" hidden checked = {input_state === "List" } type="radio"  value="List"     id="List"    />
                <label className="complist" htmlFor="List">List</label>
                <input onClickCapture={e=>change_input_state(e)} name="comp" hidden checked = {input_state === "Photo" } type="radio"  value="Photo"     id="Photo"    />
                <label className="complist" htmlFor="Photo">Photo</label>
                <input onClickCapture={e=>change_input_state(e)} name="comp" hidden checked = {input_state === "Video" } type="radio"  value="Video"     id="Video"    />
                <label className="complist" htmlFor="Video">Video</label>
                <input onClickCapture={e=>change_input_state(e)} name="comp" hidden checked = {input_state === "Youtube Video"} type="radio"  value="Youtube Video"     id="Youtube Video"    />
                <label className="complist" htmlFor="Youtube Video"><img src={youtubeLogo} width = {30} height={30} style={{verticalAlign:"middle"}} /> Video Link</label>



            </div>

            <form action="javascript:void(0);" id="text_input" ref = {el=>ref.current["text_input"]=el} cols="30" rows="10"  onSubmit= {e=>data_submit(e)} >
                <span ref = {el => ref.current['comp_tag']=el} contentEditable = "false" className="comp_tag">{input_state}</span>
                <div ref = {el => ref.current['maintext']= el}  className="maintext"contentEditable = {edit_state}></div>
                <input type="submit" className="insert_comp" ref = {el => ref.current['insert_comp']=el} value="" />
            </form >

        </div>
    )
}

const Blog_part = props=>{
    let heading = String(Object.keys(props.data)[0])
    let data
    if (heading === "Heading"){
        data =(<p className = "h5">{props.data[heading]}</p>) 
    }else if (heading === "Paragraph"){
        data = (<p>{`${props.data[heading]}`}</p>)
    }
    else if (heading === "List"){
        data = (<ul>
            {props.data[heading].map(item=>(<li>{item}</li>))}
            </ul>
            )
    }else if(heading ==="Photo"){
        let url = URL.createObjectURL(props.data[heading])
        data =(<img src = {url} height={200} width={400}  style={{boxShadow:"rgb(0 0 0 / 20%) 0px 0px 5px 3px", borderRadius : "5px", maxWidth:"95%",justifySelf:"center"}  } />)
    }else if(heading ==="Video"){
        let url = URL.createObjectURL(props.data[heading])
        data =(<video src = {url}  controls style={{boxShadow:"rgb(0 0 0 / 20%) 0px 0px 5px 3px", borderRadius : "5px" , maxWidth:"95%" ,justifySelf:"center" ,zIndex:"-1" }} />)
    }else if(heading === "Youtube Video"){
        data = (<iframe  src={`https://www.youtube.com/embed/${props.data[heading]}`}
        title="YouTube video player" frameborder="0" style={{boxShadow:"rgb(0 0 0 / 20%) 0px 0px 5px 3px",width :"auto",height:"auto", borderRadius : "5px" ,justifySelf:"center"}}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen></iframe>)
    }
    return (
        <div className="container_part">
            <h5>{`${heading}`}</h5>
         <img src={popComp} width = {20} height= {20} onClick={()=>props.rm(props.index)} style = {{gridArea:"img", alignSelf:'center' , justifySelf :'center'}}  />
            <span className="container_data">{data}</span>
        </div>
    )
}