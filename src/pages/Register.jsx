
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Alerts from '../components/Alerts';
import axiosClient from '../config/axiosClient'
const Register = () => {

  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [repeatPassword,setRepeatPassword] = useState('');
  const [alert,setAlert] = useState({
    msg:'',
    error:false
  });

  async function handleSubmit(e){
    e.preventDefault();

    if([name,email,password,repeatPassword].includes('')){
      setAlert({
        msg:'All fields are required.',
        error:true
      })
      return;
    }
    
    if(password !== repeatPassword){
      setAlert({
        msg:'Passwords do not match.',
        error:true
      })
      return;
    }
    
    if(password.length < 6 ){
      setAlert({
        msg:'Password has to be longer than 6 characters.',
        error:true
      })
      return;
    }

    setAlert({})

    //crear usuario en la API
    try {
      const {data} = await axiosClient.post(`/users`, {name,password,email})
      setAlert({
        msg:data.msg,
        error:false
      })
      setName('')
      setEmail('')
      setPassword('')
      setRepeatPassword('')
  
      setTimeout(() => {
        setAlert({})
      }, 3000);
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
        Create you account and manage your {''} 
        <span className={'text-slate-700'}>projects</span>
      </h1>
      <form 
        className={'my-10 bg-white shadow rounded-lg p-10'}
        onSubmit={handleSubmit}
      >
        {alert.msg && <Alerts alert={alert}/>}
        <div className={'my-5 '}>
          <label htmlFor="name" className={'uppercase text-gray-600 block text-xl font bold'}>name:</label>
          <input 
            type="text" 
            placeholder={'Register Name'} 
            className={'w-full mt-3 p-3 border rounded-xl bg-gray-50'}
            id={'name'}
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
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
        <div className={'my-5 '}>
          <label htmlFor="repeat-password" className={'uppercase text-gray-600 block text-xl font bold'}>Repeat Password:</label>
          <input 
            type="password" 
            placeholder={'Repeat Password'} 
            className={'w-full mt-3 p-3 border rounded-xl bg-gray-50'}
            id={'repeat-password'}
            value={repeatPassword}
            onChange={e => setRepeatPassword(e.target.value)}
          />
        </div>
        <input 
          type="submit" 
          value={'Create Account'}
          className={'bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors'}
        />
      </form>

      <nav className={'lg:flex lg:justify-between'}>
        <Link
          className={'block text-center m-5 text-slate-500 uppercase text-sm'}
          to={'/'}
        >
          Do you have an account?{' '}<span className={'underline text-sky-800 font-bold'}>Sing In</span>
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

export default Register
