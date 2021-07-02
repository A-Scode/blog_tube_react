import { useState ,useEffect} from "react";
import  './statics/css/loading.css'
import logo from './statics/images/blogTubeIcon.svg'

const AppBodyLoading = props=>{

    const [state , set_state ] = useState(props.loading)
    useEffect(()=>{
        set_state(props.loading)
    },[props.loading])

    return (
        <div className="loading"  style = {{display : state, pointerEvents:'all'}} >
            <div className="logoanime">
                <img src={logo}  id = 'loadinglogo'   />
                <div className='loadinganime' >
                    <div className ='dots' style = {{"--i" : 1}}></div>
                    <div className ='dots' style = {{"--i" : 2}}></div>
                    <div className ='dots' style = {{"--i" : 3}}></div>
                   
                </div>

            </div>
            
        </div>
    )
}

export default AppBodyLoading;