import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usercontext } from "../../App";

const SubscribedUserPost = () => {
    const [data, setData] = useState([]);
    const { state, dispatch } = useContext(usercontext);
  
    useEffect(() => {
      fetch("/getsubpost", {
        method: "get",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
        .then((res) => res.json())
        .then((result) => {
          setData(result.posts);
        });
    }, []);
  
    const likePost = (id) => {
      fetch("/like", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({ postId: id }),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          const newData = data.map((item) => {
            if (item._id == result._id) {
              return result;
            } else {
              return item;
            }
          });
          setData(newData);
        })
        .catch((err) => {
          console.log(err);
        });
    };
  
    const unlikePost = (id) => {
      fetch("/unlike", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          postId: id,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          //   console.log(result)
          const newData = data.map((item) => {
            if (item._id == result._id) {
              return result;
            } else {
              return item;
            }
          });
          setData(newData);
        })
        .catch((err) => {
          console.log(err);
        });
    };
  
    const makeComment = (text, postId) => {
      fetch("/comment", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          postId,
          text,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          const newData = data.map((item) => {
            if (item._id == result._id) {
              return result;
            } else {
              return item;
            }
          });
          setData(newData);
        })
        .catch((err) => {
          console.log(err);
        });
    };
  
    const deleteComment = (postId,commentId)=>{
      fetch(`/deletecomment/${postId}/${commentId}`,{
        method:"delete",
        headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer "+localStorage.getItem("jwt")
        }
      }).then(res=>res.json())
      .then(result=>{
        const newData = data.map(item=>{
          if(item._id===result._id){
            result.postedBy=item.postedBy;
            return result
          }
          else{
            return item
          }
      })
      setData(newData);
    })
    }
  
  
    const deletePost = (postid) => {
      fetch(`/deletepost/${postid}`, {
        method: "delete",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
        .then((res) => res.json())
        .then((result) => {
          // console.log(result);
          const newData = data.filter((item) => {
            return item._id !== result._id;
          });
          setData(newData);
        });
    };
  
    return (
      <div className="home">
        {data.map((item) => {
          return (
            <div className="card home-card" key={item._id}>
              {/* <img src="" alt="img" /> */}
              <h5 style={{ padding: "5px" ,paddingBottom: "0px" ,marginBottom: "0px"}}>
            <img src={item.postedBy.pic} alt="img" style={{borderRadius:"50%" , width:"25px" ,margin: "5px"} } />
            <Link style={{ verticalAlign : "top" }} to={item.postedBy._id == state._id ? "/profile" : `/profile/${item.postedBy._id}` }>  
            {item.postedBy.name}
            </Link>
            {" "}
              {item.postedBy._id == state._id && (
                  <i
                    className="material-icons"
                    style={{
                      float: "right",
                    }}
                    onClick={() => deletePost(item._id)}
                  >
                    delete
                  </i>
                )}
                </h5>
              <div className="card-image">
                <img src={item.photo} alt="img" />
                <div className="card-content">
                  {item.likes.includes(state._id) ? (
                    <i
                      className="material-icons"
                      style={{ color: "red" }}
                      onClick={() => unlikePost(item._id)}
                    >
                      favorite{" "}
                    </i>
                  ) : (
                    <i
                      className="material-icons"
                      onClick={() => likePost(item._id)}
                    >
                      {" "}
                      favorite
                    </i>
                  )}
  
                  <h6> {item.likes.length} likes</h6>
                  <h6> {item.title}</h6>
                  <p> {item.body}</p>
                  {item.comments.map((record) => {
                    return (
                      <div key={record._id}>
                        <h6>
                          <span style={{ fontWeight: "500" }}>
                            {record.postedBy.name}
                          </span>{" "}
                          {record.text}
                          {record.postedBy._id == state._id &&(
                            <i className="material-icons" style={{ float: "right",}}
                              onClick={() => deleteComment(item._id,record._id)}
                            >
                             delete
                           </i>
                          )}
                        
                        
                        </h6>
                      </div>
                    );
                  })}
  
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      makeComment(e.target[0].value, item._id);
                      
                    }}
                  >
                    <input type="text" placeholder="comment" />
                  </form>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

export default SubscribedUserPost