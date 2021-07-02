import './statics/css/appFooter.css'
import {useRef , useEffect} from 'react'
import github_logo from './statics/images/github.svg'
import facebook_logo from './statics/images/facebook.svg'
import instagram_logo from './statics/images/instagram.svg'



var AppFooter = props=>{

    
    var ref = useRef({})
    
    useEffect(()=>{
        try{
            let el = props.appbody
            el.addEventListener('scroll' , event=>{
                
                let height = el.getBoundingClientRect().height
                if (el.scrollTop+ height === el.scrollHeight){
                    // ref.current['footer'].scrollIntoView({behavior:'smooth', block:'center'})
                    props.appcontainer.scroll(0, props.appcontainer.scrollHeight)
                }else{
                    props.appcontainer.scroll(0,0)
                }
            })
        }catch(err){
            console.log(err)
        }
    },[props.appbody,props.appcontainer])

    


    return (
        <div className="footer" ref = {el=>ref.current['footer']= el } >
            <div className="aboutus">
                <p><strong> Developer </strong><pre>:</pre> <code>Shouryaraj Singh</code></p>
                <p><strong>Contact </strong> <pre>:</pre> <code> 96XXXXXXXX </code></p>
                <p><strong>Email</strong> <pre>:</pre> <code>shouryarajsinghgoud@gmail.com</code></p>
            </div>
            <div className="github">
            <a target="_blank" href = "https://github.com/A-Scode"><img src={github_logo} alt="github"  height = "50" width= "50" /></a>
            </div>
            <div className="facebook">
            <a target="_blank" href = "https://www.facebook.com/shouryarajsingh.goud"><img src={facebook_logo} alt="github"  height = "50" width= "50" /></a>
            </div>
            <div className="insta">
                <a target="_blank" href = "https://www.instagram.com/shouryaraj_singh/"><img src={instagram_logo} alt="github"  height = "50" width= "50" /></a>
            </div>
        </div>
    )
}

export default AppFooter;