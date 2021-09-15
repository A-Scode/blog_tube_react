import {useEffect ,useContext , useState, useCallback, useMemo, useRef} from 'react'
import { Redirect ,useHistory } from 'react-router'
import { Login_context } from '../App'
import './statics/css/appUploadBlog.css'
import $, { event } from "jquery"
import domtoimage from 'dom-to-image'
import preview_image from './statics/images/preview.svg'
import editor_image from './statics/images/editor.svg'


var AppUploadBlog = props=>{
    var login_context  = useContext(Login_context)
    const history  = useHistory()
    const ref = useRef({})
    useEffect(()=>{
        if (login_context !== sessionStorage.session){
            history.push('/Login')
            return null
        }        
    },[])

    const [upload_blog_state , set_upload_blog_state] = useState('blog')

    function dataURLtoFile(image_span){
        let u8arr , mime

        domtoimage.toJpeg(image_span ,{quality:1}).then(data=>{
        final_image_blob = data

        let arr =  final_image_blob.split(',')
        mime = 'image/jpeg'
        let bstr = atob(arr[1])
        let n = bstr.length
        u8arr = new Uint8Array(n)
        while(n--){
            u8arr[n] = bstr.charCodeAt(n)
        }
    })

        return new File([u8arr],"blog_image.jpg" , {type:mime})
    
    }

    var final_image_blob
    var new_image_file
    var blog_info_obj = {}

    const change_image = useCallback(event=>{
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
        let target = $('#label_image')
        target.css({'backgroundImage': `url(${image_url})`,
           'borderRadius':'20px',
           'backgroundSize' :'cover',
           "boxShadow": "0px 1px 7px 3px #1976d2"
        })

        image_span = document.getElementById("image_span")
    
    new_image_file = dataURLtoFile(image_span)
    console.log(new_image_file)
    },[final_image_blob , new_image_file])

    const [blog_details , set_blog_details] = useState({})

    const forward_to_editor = useCallback((event)=>{
        event.preventDefault()
        blog_info_obj.title = ref.current['blog_title'].value
        blog_info_obj.discription = ref.current['blog_discription'].value
        set_upload_blog_state('blog_editor')
        console.log(blog_info_obj)
    })
    
    const blog_info = useMemo(()=>(
        <form className="blog_info" action='javascript:void(0);' onSubmit = {event=>forward_to_editor(event)}>
            <div className="blog_info_child">
            <h1 align = "center">Blog Information </h1>
            <label htmlFor="blog_title" id = "label_title">Title</label>
            <input type="text" placeholder = "Title" autoComplete="off" spellCheck="true" autoCapitalize="words"  id = "blog_title" maxLength={100} ref= {el =>ref.current['blog_title']=el} required />

            <label htmlFor="blog_discription" id = "label_discription">Discription</label>
            <textarea type="text" autoComplete="off" spellCheck="true" autoCapitalize="sentences" id="blog_discription" placeholder="Discription" maxLength={200} ref= {el =>ref.current['blog_discription']=el} />

            <label htmlFor="blog_image" id = "label_image" ><span id = "image_span"></span></label>
            <input type="file" id = "blog_image" onChange={change_image} hidden />

            <input type="submit"  value="Next" id = "submit" />
            </div>

        </form>
    ),[upload_blog_state, change_image,forward_to_editor])

    const [editor_state,set_editor_state] = useState('editor')

    const [comp_state , set_comp_state] = useState('')

    let set_to_editor= e=>{
        set_editor_state(e.target.value)
    }

    const blog_editor = (
        <div className="editor">
            <Editor_tabs change_state = {set_to_editor} />
            {editor_state ==="editor"?<Editing_pane component = {comp_state} />:null}
            {editor_state === "preview"?null:null}
        </div>
    )
    return(
        <div className="blog_upload_page">
            {upload_blog_state == 'blog'? blog_info : null}
            {upload_blog_state == 'blog_editor'?blog_editor:null}

        </div>
    )
}

export default  AppUploadBlog;


var Editor_tabs= props =>{
    return(
        <div className="tabs">
            <input type="radio" name="tabs" id="editer_radio" value={"editor"} onInput= {(e)=>props.change_state(e)} hidden  defaultChecked/>
            <label htmlFor="editer_radio" id = "label_editor" ><img src = {editor_image}  className = "label_ico" />Editor</label>
            <input type="radio" name="tabs" id="preview_radio" value= "preview" onInput= {(e)=>props.change_state(e)} hidden />
            <label htmlFor= "preview_radio" id = "label_preview" ><img src = {preview_image}  className = "label_ico" />Preview</label>
        </div>
        )
}

var Editing_pane = props =>{
    const ref = useRef({})
    const [edit_state , set_edit_state ] = useState(false)
    useEffect(()=>{
        if (props.component === ''){
            set_edit_state(false)
            ref.current['text_input'].style.filter = "greyscale(1)"
            ref.current['comp_tag'].style.display = 'none'
            ref.current['insert_comp'].disabled = true
        }
        else{
             set_edit_state(true)
             ref.current['text_input'].style.filter = "greyscale(0)"
            ref.current['comp_tag'].style.display = 'block'
            ref.current['insert_comp'].disabled = false

            }
    }
    ,[props.component])
    let mq = window.matchMedia("(max-width : 767px)")

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



    return (
        <div className="editing_pane">
            <div className="editing">
                <button className = "addComponents" onClick = {switch_comp} ></button>
                <button className = "upload" >Upload</button>
            </div>
            <div className="components" ref = {el=>ref.current['components']=el}>
                <h6 align = "center" className="heading">Components</h6>
            </div>
            <div id="text_input" ref = {el=>ref.current["text_input"]=el} cols="30" rows="10"  >
                <span ref = {el => ref.current['comp_tag']=el} contentEditable = "false" className="comp_tag">{props.component}</span>
                <div ref = {el => ref.current['maintext']= el} className="maintext"contentEditable = {edit_state}></div>
                <button className="insert_comp" ref = {el => ref.current['insert_comp']=el} disabled></button>
            </div>
        </div>
    )
}