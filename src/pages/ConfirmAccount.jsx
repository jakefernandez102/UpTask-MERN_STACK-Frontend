import { useEffect, useState } from "react";
import {useParams,Link} from 'react-router-dom'
import axiosClient from '../config/axiosClient'
import Alerts from '../components/Alerts'


const ConfirmAccount = () => {
  
  const [alert,setAlert]=useState({})
  const [confirmedAccount,setConfirmedAccount]=useState(false)

  const params = useParams();
  const {id} =params;

  useEffect(()=>{
    const confirmAccount = async ()=>{
      try {
        const url = `/users/verify/${id}`
        const {data}=await axiosClient.get(url)

        setAlert({
          msg:data.msg,
          error:false
        })
        setConfirmedAccount(true)
      } catch (error) {
        setAlert({
          msg:error.response.data.msg,
          error:true
        })
      }
    }
    return () => {confirmAccount()}
  },[])



  return (
    <>
      <h1
        className={'text-sky-600 font-black text-6xl capitalize'}
      >
        Confirm your account and start creating your {''} 
        <span className={'text-slate-700'}>projects</span>
      </h1>

      <div className={'mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white'}>
      {alert.msg && <Alerts alert={alert}/>}

      {confirmedAccount && (
        <Link
        className={'block text-center m-5 text-slate-500 uppercase text-sm'}
        to={'/'}
        >
          Sing In
        </Link>
      )}
      </div>
    </>
  )
}

export default ConfirmAccount