import { useEffect, useState } from "react";
import {Link,useParams} from 'react-router-dom'
import axiosClient from '../config/axiosClient'
import Alerts from "../components/Alerts";

const NewPassword = () => {

  const [password,setPassword] =useState('')
  const [modifiedPassword,setModifiedPassword] =useState(false)
  const [validToken,setValidToken] =useState(false)
  const [alert,setAlert] =useState({})
  
  const params = useParams();
  const{token} = params;
  
  useEffect(()=>{
    async function verifyToken(){
      try {
        await axiosClient.get(`/users/reset-password/${token}`)
        setValidToken(true);

      } catch (error) {
        setAlert({
          msg:error.response.data.msg,
          error:true
        })
      }
    }
    verifyToken()
  },[])

  async function handleSumbit(e) {
    e.preventDefault();

    if(password.length < 6){
      setAlert({
        msg:'Password must be a minimum 6 characters word',
        error:true
      })
    }

    try {
      const url = `/users/reset-password/${token}`
      const {data} = await axiosClient.post(url,{password})
      setAlert({
        msg:data.msg,
        error:false
      })
      setModifiedPassword(true)
    } catch (error) {
      setAlert({
        msg:error.response.data.msg,
        error:true
      })
    }
  }

  return (
    <>
      <h1
        className={'text-sky-600 font-black text-6xl capitalize'}
      >
        Restore your password and do not loose access to your {''} 
        <span className={'text-slate-700'}>projects</span>
      </h1>

      {
      validToken ? (
        <>
          <form 
          className={'my-10 bg-white shadow rounded-lg p-10'}
          onSubmit={handleSumbit}
          >
            {alert.msg && <Alerts alert={alert}/>}
            <div className={'my-5 '}>
              <label htmlFor="password" className={'uppercase text-gray-600 block text-xl font bold'}>New Password:</label>
              <input 
                type="password" 
                placeholder={'New Password'} 
                className={'w-full mt-3 p-3 border rounded-xl bg-gray-50'}
                id={'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                />
            </div>
            <input 
              type="submit" 
              value={'Save new Password'}
              className={'bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors'}
              />
          </form>
          {modifiedPassword && (
            <Link
            className={'block text-center m-5 text-slate-500 uppercase text-sm'}
            to={'/'}
          >
            <span className={'underline text-sky-800 font-bold'}>Sing In</span>
          </Link>
          )}
        </>
      
      ) : <Alerts alert={alert}/>}
    </>
  )
}

export default NewPassword
