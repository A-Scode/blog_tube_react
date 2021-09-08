import {useEffect ,useContext} from 'react'
import { Redirect ,useHistory } from 'react-router'
import { Login_context } from '../App'


var AppUploadBlog = props=>{
    var login_context  = useContext(Login_context)
    const history  = useHistory()
    useEffect(()=>{
        if (! login_context){
            history.push('/Login')
            return null
        }        
    },[])
    
    const blog_info = (
        <div className="blog_info">
            <form action="javascript:void(0)"></form>
            <label htmlFor="blog_title">Title</label>
            <input type="text" placeholder = "Title" id = "blog_title" maxLength={100} />

            <label htmlFor="blog_discription">Discription</label>
            <textarea type="text"  id="blog_discription" placeholder="Discription" maxLength={200} />

        </div>
    )

    return(
        <div className="blog_upload_page">
            {blog_info}

        </div>
    )
}

export default  AppUploadBlog;