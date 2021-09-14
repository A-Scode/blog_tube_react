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
            backdropFilter:'blur(3px)'
        })
        let target = $('#label_image')
        target.css({'backgroundImage': `url(${image_url})`,
           'borderRadius':'20px',
           'backgroundSize' :'cover'
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
            <input type="text" placeholder = "Title" autoComplete={false} autoCorrect={true} autoCapitalize={true}  id = "blog_title" maxLength={100} ref= {el =>ref.current['blog_title']=el} required />

            <label htmlFor="blog_discription" id = "label_discription">Discription</label>
            <textarea type="text" autoComplete={false} autoCorrect={true} autoCapitalize={true} id="blog_discription" placeholder="Discription" maxLength={200} ref= {el =>ref.current['blog_discription']=el} />

            <label htmlFor="blog_image" id = "label_image" ><span id = "image_span"></span></label>
            <input type="file" id = "blog_image" onChange={change_image} hidden />

            <input type="submit"  value="Next" id = "submit" />
            </div>

        </form>
    ),[upload_blog_state, change_image,forward_to_editor])

    const blog_editor = useMemo(()=>(
        <div className="editor">
            <Editor_tabs />
        </div>
    ),[upload_blog_state, change_image,forward_to_editor])
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
            <input type="radio" name="tabs" id="editer_radio" value={true} hidden  checked/>
            <label htmlFor="editer_radio" id = "label_editor" ><img src = {editor_image}  className = "label_ico" />Editor</label>
            <input type="radio" name="tabs" id="preview_radio" hidden />
            <label htmlFor= "preview_radio" id = "label_preview" ><img src = {preview_image}  className = "label_ico" />Preview</label>
        </div>
        )
}