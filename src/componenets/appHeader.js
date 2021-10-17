import './statics/css/appHeader.css'
import blogTubeIcon1 from './statics/images/blogTubeIcon.svg'

import menuIcon from './statics/images/menu_icon.svg'
import menuIcon3 from './statics/images/menu_icon3.svg'
import searchIcon from './statics/images/search_icon.svg'
import search_logo from './statics/images/search_icon.svg'
import { useHistory,useLocation, useRouteMatch } from 'react-router'
import { useState, useRef ,useEffect, useCallback, useContext} from 'react'
import { Link } from 'react-router-dom'

import Menu from './Menu'
import { Theme_context } from '../App'

const AppHeader = props => {
    
    var root = document.documentElement
    root.style.setProperty('--search_icon_url' , `url(${search_logo})`)

    var [img_state, set_img_state] = useState(menuIcon)

    var menuIcon_elem = useRef({})
    var location = useLocation()
    const history = useHistory()
    
    useEffect(()=>{
        return history.listen((new_loc) =>{
            if (new_loc.pathname.split("/")[1]==="Blog"){
            window.location.reload()}
        })
    },[location.pathname])

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
            
            if (event.target.id === "searchInputResponsive"){
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

    },[state_blog_list,menuIcon_elem])
    
    let [menu_state , set_menu_state] = useState(false)
    const ref = useRef({})
    var theme_context = useContext(Theme_context)
    useEffect(()=>{
        if (theme_context === "Dark"){
            ref.current.header.style.backgroundColor = "#353535"
            ref.current.header.style.color = "white"
            menuIcon_elem.current['searchIconResponsive']?menuIcon_elem.current['searchIconResponsive'].style.color="white":console.log("no")
            try{
                menuIcon_elem.current['searchIcon']?menuIcon_elem.current['searchIcon'].style.color="white":console.log("no")
                menuIcon_elem.current['searchIconResponsive']?menuIcon_elem.current['searchIconResponsive'].style.color ="white":console.log("no")
                ref.current.no_blogs?ref.current.no_blogs.style.backgroundColor = "#353535":console.log()
            ref.current.no_blogs?ref.current.no_blogs.style.color = "white":console.log()
        }catch{}
        }
        else{
            ref.current.header.style.backgroundColor = "white"
            ref.current.header.style.color = "black"
            menuIcon_elem.current['searchIconResponsive']?menuIcon_elem.current['searchIconResponsive'].style.color="black":console.log("no")
            try{
                menuIcon_elem.current['searchIcon']?menuIcon_elem.current['searchIcon'].style.color="black":console.log("no")
                menuIcon_elem.current['searchIconResponsive']?menuIcon_elem.current['searchIconResponsive'].style.color ="black":console.log("no")
                ref.current.no_blogs?ref.current.no_blogs.style.backgroundColor = "white":console.log()
            ref.current.no_blogs?ref.current.no_blogs.style.color = "black":console.log()
        }catch{}
        }
    },[theme_context,ref, state_blog_list])

    return (
        <div className="header" ref = {el=>ref.current.header=el}>
            <Menu open = {menu_state} login_state = {props.login_state}
            change_theme = {props.change_theme}
            onClick = {()=>menu_click()} /> 
            <div className="menuicon"  >
                <img src={img_state} id='menuIcon' ref={el => menuIcon_elem.current['menuIcon'] = el} onClick={()=>menu_click()} alt="menuIcon" />

            </div>
            <h1 id='blog_tube' > <img src={blogTubeIcon1} id='logo' /> Blog Tube</h1>

            {responsive ? <img src={searchIcon} id='searchIcon' ref={el => menuIcon_elem.current['searchIcon'] = el}  onClick = {()=>{
                responsiveSearch('flex')
                set_menu_state(false)

                }} />
                :<input ref={el => menuIcon_elem.current['searchIcon'] = el} key={0} placeholder='Search Blogs' onInput = {sorting_list} onFocus = {sorting_list} id='searchInput'  onFocus={()=>showHideSearch('block')} type='text' />
            }
            <div id="blogList" ref={el => menuIcon_elem.current['blogList'] = el}>
                {state_blog_list.length !== 0 ? state_blog_list.map((e, i) =>( <BlogSearchElem e = {e} key={i} style = {{backgroundColor:theme_context==="Dark"?"#353535":"white"}} />))
                    : <div className='blog_elems'> No Blogs Found</div>}
            </div>
            {responsive ?
                <div id="search" style = {state_search_style}  >
                    {responsive ?
                        <><input ref={el => menuIcon_elem.current['searchIconResponsive'] = el} placeholder='Search Blogs' onInput= {sorting_list} id='searchInputResponsive' type='text' autoFocus= {true} />    </> : null}
                    <div id="blogListContainer" >
                        {state_blog_list.length !== 0 ? state_blog_list.map((e, i) => (<BlogSearchElem e = {e} key={i} style = {{backgroundColor:theme_context==="Dark"?"#353535":"white"}} />))
                            : <div className='blog_elems'  ref = {el=>ref.current.no_blogs=el}> No Blogs Found</div>}
                    </div>
                </div> : null
            }
        </div>
    )
}
export default AppHeader

var BlogSearchElem = props=>{
    return(
        <Link   to ={`/Blog/${props.e.blog_details.title}?id=${props.e.blog_details.blog_id}`} >
            <div className='blog_elems' style = {props.style}>
                {props.e.blog_details.title}
            </div>
        </Link>
    )
}

