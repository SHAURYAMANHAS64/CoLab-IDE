import React,{useContext,useEffect,useState} from "react";
import {UserContext} from "../context/user.context";
import { useNavigate } from "react-router-dom";
const UserAuth = ({children}) => {
    const { user, setUser } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    
    
    useEffect(() => {
      if (!token) {
        navigate("/login");
        return;
      }

      if (!user) {
        try {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        } catch (error) {
          // ignore parse errors
        }
      }

      setLoading(false);
    }, [token, navigate, user, setUser])
    if(loading){
        return <div>Loading...</div>
    }
  return (
    <>{children}</>
  )}
 
export default UserAuth;