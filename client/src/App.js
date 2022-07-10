import "./App.css";
import { createContext, useContext, useEffect, useReducer } from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route, useNavigate , useLocation } from "react-router-dom";
import Home from "./components/screens/Home";
import Signin from "./components/screens/Signin";
import Signup from "./components/screens/Signup";
import Profile from "./components/screens/Profile";
import CreatePost from "./components/screens/CreatePost";
import { initialState, reducer } from "./reducers/userReducer";
import UserProfile from "./components/screens/UserProfile";
import SubscribedUserPost from "./components/screens/SubscribedUserPost";

  

export const usercontext = createContext()

  const Routing = ()=>{

  // const location = useLocation()
  const navigate = useNavigate()
  const {state,dispatch} = useContext(usercontext) 

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})   ///////if user comeback and has already logged in earlier , we upsate the state whenuser come back
    }else{
      // if(!location.pathname.startsWith('/reset'))
           navigate('/signin')
    }
  },[])
  
  return(
    <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/profile/:userid" element={<UserProfile/>} />
        <Route path="/myfollowingpost" element={<SubscribedUserPost/>} />
        {/* <Route path="/reset/:token" element={<NewPassword />} /> */}
        
    </Routes>
  )
}


function App() {

  const [state , dispatch] = useReducer(reducer ,initialState)

  return (

    <usercontext.Provider value={{state ,dispatch}}>
    <BrowserRouter>
      <Navbar />
       <Routing/>
    </BrowserRouter>
    </usercontext.Provider>
  );
}

export default App;
