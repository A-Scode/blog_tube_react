import './statics/css/appHeader.css'
import blogTubeIcon1 from './statics/images/blogTubeIcon.svg'

import menuIcon from './statics/images/menu_icon.svg'
import menuIcon3 from './statics/images/menu_icon3.svg'
import searchIcon from './statics/images/search_icon.svg'
import appConfig from './statics/appConfig.json'
import search_logo from './statics/images/search_icon.svg'

import { useState, useRef ,useEffect, useCallback} from 'react'
import { Link } from 'react-router-dom'

import Menu from './Menu'

var change_menu_state;

const AppHeader = props => {
    
    var root = document.documentElement
    root.style.setProperty('--search_icon_url' , `url(${search_logo})`)

    var [img_state, set_img_state] = useState(menuIcon)

    var menuIcon_elem = useRef({})


    const [state_blog_list , set_state_blog_list] = useState(props.bloglist)
    useEffect(()=>{
        set_state_blog_list([...props.bloglist])
    },[props.bloglist])



    var mq = window.matchMedia('(max-width: 768px)')
    mq.onchange = () => {
        set_responsive(mq.matches)

    }
    var [responsive, set_responsive] = useState(mq.matches)

    let search_style = {
        display: "none",
    position:"fixed",
    width:"100vw",
    height:"100vh",
    top:0,bottom:0,left:0,right:0,
    justifyContent: "center",
    pointerEvents: "auto ",
    zIndex: 6,
    backdropFilter: "blur(2px)",
    }

    var [state_search_style , set_state_search_style] = useState(search_style)


    let menu_click = () => {
        if (img_state === menuIcon) {
            set_img_state(menuIcon3)
            set_menu_state(true)
            console.log('menuImage is equal to menuIcon')
        } else {
            set_img_state(menuIcon)
            set_menu_state(false)
            console.log('menuImage !!!! equal to menuIcon')
        }

    }

    
    var responsiveSearch = (type) => {
        try{
            menuIcon_elem.current['searchIconResponsive'].style.backgroundImage= `url(${search_logo})`
            set_state_search_style({...search_style , display : type})
            menuIcon_elem.current['searchIconResponsive'].focus()
            document.addEventListener('click' ,doc_click , true )
            setTimeout(()=>menuIcon_elem.current['searchIconResponsive'].focus() , 500)
    }catch(err){}
    }

    let showHideSearch=(type)=>{
       try{
        menuIcon_elem.current['blogList'].style.display = type
       }catch(err){}
        
    }

    let doc_click = event=>{
        if (event.target != menuIcon_elem.current['searchIcon'] && event.target != menuIcon_elem.current['searchIconResponsive']){
            mq.matches?
            responsiveSearch("none")
            :showHideSearch('none')
            document.removeEventListener('click' ,doc_click ,true )
        }

    }

    window.addEventListener('resize' , ()=>{
        if (mq.matches  && menuIcon_elem.current['blogList']) showHideSearch('none')
    })

    function responsive_search_option(event){
        if (!mq.matches) {
        if ( event.target != menuIcon_elem.current['searchIcon'] && event.target != menuIcon_elem.current['blogList'] ){
            setTimeout(()=>showHideSearch('none'),200)}}
        

        else if (mq.matches){
            
            if (event.target.id == "searchInputResponsive"){
                set_state_search_style({...search_style , display : 'flex'})
                
            }

            else if (event.target != menuIcon_elem.current["searchIconResponsive"] && event.target != menuIcon_elem.current['searchIcon'] ){
                
                set_state_search_style({...search_style , display : 'none'})
            }
            window.removeEventListener('click'  , responsive_search_option, true)
        }
    }
    
if(!mq.matches){
    window.addEventListener('click' , responsive_search_option  , true)}
   


    const sorting_list= useCallback(()=>{
        try{
        let elem =  menuIcon_elem.current['searchIcon']
        let value = elem.value.toLowerCase() 
        let copy = props.bloglist
        let const_obj = {}
        let final_arr = []

        for (let blog of copy){
            let index = blog.toLowerCase().search(value)
            if (index > -1){
                const_obj[copy.indexOf(blog)] = index
            }
        }
        for (let index of Object.keys(const_obj).sort()){
            final_arr.push(copy[index])
        }
        
        set_state_blog_list([...final_arr])
    }catch(err){}

    })
    
    let [menu_state , set_menu_state] = useState(false)



    return (
        <div className="header" >
            <Menu open = {menu_state} login_state = {props.login_state}  onClick = {()=>menu_click()} /> 
            <div className="menuicon"  >
                <img src={img_state} id='menuIcon' ref={el => menuIcon_elem.current['menuIcon'] = el} onClick={()=>menu_click()} alt="menuIcon" />

            </div>
            <h1 id='blog_tube' > <img src={blogTubeIcon1} id='logo' />

                Blog Tube</h1>

            {responsive ? <img src={searchIcon} id='searchIcon' ref={el => menuIcon_elem.current['searchIcon'] = el}  onClick = {()=>{
                responsiveSearch('flex')
                set_menu_state(false)

                }} />
                : <><input ref={el => menuIcon_elem.current['searchIcon'] = el} placeholder='Search Blogs' onInput = {sorting_list} onFocus = {sorting_list} id='searchInput'  onFocus={()=>showHideSearch('block')} type='text' />            </>
            }
            <div id="blogList" ref={el => menuIcon_elem.current['blogList'] = el}>
                {state_blog_list.length !== 0 ? state_blog_list.map((e, i) =>( <Link to ={`/Blog/${e.blog_details.title}?id=${e.blog_details.blog_id}`} ><div key={i} className='blog_elems' >{e.blog_details.title}</div></Link>))
                    : <div className='blog_elems'> No Blogs Found</div>}
            </div>
            {responsive ?
                <div id="search" style = {state_search_style}  >
                    {responsive ?
                        <><input ref={el => menuIcon_elem.current['searchIconResponsive'] = el} placeholder='Search Blogs' onInput= {sorting_list} id='searchInputResponsive' type='text' autoFocus= {true} />    </> : null}
                    <div id="blogListContainer" >
                        {state_blog_list.length !== 0 ? state_blog_list.map((e, i) => ( <Link to ={`/Blog/${e.blog_details.title}?id=${e.blog_details.blog_id}`} ><div key={i} className='blog_elems' >{e.blog_details.title}</div></Link>))
                            : <div className='blog_elems'> No Blogs Found</div>}
                    </div>
                </div> : null
            }
        </div>
    )
}

export default AppHeader

