import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Alerts from '../components/Alerts';
import axiosClient from '../config/axiosClient';
import useAuth from '../hooks/useAuth';


const Login = () => {

  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [alert,setAlert] = useState({})

  const {setAuth} = useAuth();

  const navigate = useNavigate()

  const handleSubmit = async (e) =>{
    e.preventDefault();

    if([email, password].includes('')){
      setAlert({
        msg:'All fields are required',
        error:true
      })
      return
    }
    setAlert([])
    try { 
      const {data} = await axiosClient.post('/users/login',{email,password})
      localStorage.setItem('token', data.token)
      setAuth(data)
      navigate('/projects')
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
        Sign In and manage your {''} 
        <span className={'text-slate-700'}>projects</span>
      </h1>
      <form 
        className={'my-10 bg-white shadow rounded-lg p-10'}
        onSubmit={handleSubmit}
      >
        {alert.msg && <Alerts alert={alert}/>}

        <div className={'my-5 '}>
          <label htmlFor="email" className={'uppercase text-gray-600 block text-xl font bold'}>Email:</label>
          <input 
            type="email" 
            placeholder={'Register Email'} 
            className={'w-full mt-3 p-3 border rounded-xl bg-gray-50'}
            id={'email'}
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className={'my-5 '}>
          <label htmlFor="password" className={'uppercase text-gray-600 block text-xl font bold'}>Password:</label>
          <input 
            type="password" 
            placeholder={'Register Password'} 
            className={'w-full mt-3 p-3 border rounded-xl bg-gray-50'}
            id={'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <input 
          type="submit" 
          value={'Sign In'}
          className={'bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors'}
        />
      </form>

      <nav className={'lg:flex lg:justify-between'}>
        <Link
          className={'block text-center m-5 text-slate-500 uppercase text-sm'}
          to={'/register'}
        >
          Don{"'"}t you have an account?{' '}<span className={'underline text-sky-800 font-bold'}>Sing Up</span>
        </Link>
        <Link
          className={'block text-center m-5 text-slate-500 uppercase text-sm'}
          to={'/forgot-password'}
        >
          Forgot Password
        </Link>
      </nav>
    </>
  )
}

export default Login
