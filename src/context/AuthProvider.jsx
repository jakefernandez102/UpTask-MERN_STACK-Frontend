/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import axiosClient from '../config/axiosClient'
const AuthContext = createContext();

const AuthProvider = ({children})=>{

    const [auth, setAuth] = useState({});
    const [loading, setLoading] = useState(true);


    useEffect(()=>{
        const authUser = async () =>{
            const token = localStorage.getItem('token')
            if(!token){
                setLoading(false)
                return
            }
            const config = {
                headers:{
                    "Conten-Type":"applicacion/json",
                    Authorization:`Bearer ${token}`
                }
            }
            try {
                const {data} =await axiosClient('/users/profile', config)
                setAuth(data)
            } catch (error) {
                setAuth({})
                console.log(error)
            }finally
            {
                setLoading(false)
            }
        }
        
        authUser();
    },[])

    const closeSessionAuth = ()=>{
        setAuth({})
    }

    return (
        <AuthContext.Provider
                value={{
                    auth,
                    setAuth,
                    loading,
                    closeSessionAuth
                }}
            >
                {children}
        </AuthContext.Provider>
    )
}

export{
    AuthProvider
}
export default AuthContext;