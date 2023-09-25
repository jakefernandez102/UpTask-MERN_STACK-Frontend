
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Alerts from '../components/Alerts'; 
import axiosClient  from '../config/axiosClient'
const ForgotPassword = () => {

  const [email, setEmail] = useState('')
  const [alert, setAlert] = useState({})
  const emailExpression = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
  async function handleSubmit(e){
    e.preventDefault();
    if(email === '' || email.length < 6){
      setAlert({
        msg:'Email field is required',
        error:true
      })
      if(emailExpression.test(email)){
        setAlert({
          msg:'Email has an invalid format',
          error:true
        })
      }
      return
    }
    
    try {
      const {data} = await axiosClient.post(`/users/forgot-password`, {email})
      console.log(data)
      setAlert({
        msg:data.msg,
        error:false
      })
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
        Restore your access to keep your projects {''} 
        <span className={'text-slate-700'}>active</span>
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
        <input 
          type="submit" 
          value={'Send Instructions'}
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

      </nav>
    </>
  )
}

export default ForgotPassword