import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usercontext } from "../App";
import M from "materialize-css"

const Navbar = () => {
  
  const {state , dispatch} = useContext(usercontext);
  const navigate = useNavigate()
  const searchModal  = useRef(null)
  const[search , setSearch] = useState('')
  const [userDetails,setUserDetails] = useState([])
 
  useEffect(()=>{
    M.Modal.init(searchModal.current)
  },[])

  const fetchUsers =(query)=>{
     setSearch(query)
     fetch("/search-users",{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({query})
     }).then(res=> res.json())
     .then(result=>{
      setUserDetails(result.user)
     })
  }



  return (
    <div>
      <nav>
      <div className="nav-wrapper white">
          <Link to={state?"/":"/signin"} className="brand-logo left">Instagram</Link>
          <ul id="nav-mobile" className="right">
            { state 
            ? <>
            <li ><i  data-target="modal1" className="large material-icons modal-trigger" style={{color:"black"}}>search</i></li>
            <li ><Link to="/myfollowingpost">My following Posts</Link></li>
            <li ><Link to="/profile">Profile</Link></li>
            <li ><Link to="/create">Create Post</Link></li>
            <li >
             <button className="btn #c62828 red darken-3"
                onClick={()=>{
                  localStorage.clear()
                  dispatch({type:"CLEAR"})
                  navigate('/signin')
               }}
            >
                Logout
             </button>
            </li>
            </> 
            : <>
            <li  ><Link to="/signin">Signin</Link></li>
            <li  ><Link to="/signup">Signup</Link></li>
            </>}
            
  
          </ul>
        </div>
       
  <div id="modal1" className="modal" ref={searchModal} style={{color:"black"}}>
    <div className="modal-content">
    <input
            type="text"
            placeholder="search users"
            value={search}
            onChange={(e)=>fetchUsers(e.target.value)}
         
     />
      <ul className="collection">
      {userDetails.map(item=>{
                 return <Link to={item._id !== state._id ? "/profile/"+item._id:'/profile'} onClick={()=>{
                   M.Modal.getInstance(searchModal.current).close()
                   setSearch('')
                 }}><li className="collection-item">{item.email}</li></Link> 
               })}
        </ul>
    </div>
    <div className="modal-footer">
      <button  className="modal-close waves-effect waves-green btn-flat">Agree</button>
    </div>
  </div>
      </nav>
    </div>
  );
};

export default Navbar;
