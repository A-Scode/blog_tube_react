import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Blog } from "./appUploadBlog";
import appConfig from './statics/appConfig.json'
import './statics/css/appUploadBlog.css'

const AppBlog  = props=>{
    const url = new URLSearchParams(window.location.search)
    const blog_id = url.get('id')
    console.log(url.get('id'))
    
    const history = useHistory()
    if (blog_id === null){
        history.push('/Error')
    }

    const [blog_data_list , set_blog_data_list] = useState([])

    useEffect(()=>{
    const xhr = new XMLHttpRequest()
    xhr.open('GET' ,appConfig.origin+'backend_api/getBlog?blog_id='+blog_id )
    xhr.onreadystatechange =()=>{
        if (xhr.readyState === 4 && xhr.status === 200){
            let response = JSON.parse(xhr.response)
            switch (response.status) {
                case "success":
                    console.log(response.blog)
                    set_blog_data_list(response.blog)
                    break;
                case "page_not_found":
                    history.push('/Error')
                    break;
                case "fail":
                    history.push('/Error')
                    break;
                default:
                    break;
            }
        }
    }
    xhr.send()
    },[])

    return(<div className = "blog_page">
        <Blog>
            {blog_data_list.map(item=>(<div className = "container_data" dangerouslySetInnerHTML = {{__html:item}}></div>))}
        </Blog>
    </div>)
}

export default AppBlog