import { useEffect, useState } from "react";
import useProjects from "../hooks/useProjects";
import Alerts from "./Alerts";
import { useParams } from "react-router-dom";


const FormProject = () => {

    const [ id, setId] = useState(null)
    const [ name, setName] = useState('')
    const [ description, setDescription] = useState('')
    const [ deliveryDate, setDeliveryDate] = useState('')
    const [ customer, setCustomer] = useState('')

    const {project, alert, showAlert, submitProject} = useProjects()

    const params = useParams();
    useEffect(()=>{
        if(params.id ){
            setId(project._id)
            setName(project.name)
            setDescription(project.description)
            setDeliveryDate(project.deliveryDate?.split('T')[0])
            setCustomer(project.customer)
    }
},[params])

    const handleSubmit = async (e) =>{
        e.preventDefault();

        if([name, description, deliveryDate,customer].includes('')){
            showAlert({
                msg:'All fields are required.',
                error:true
            })
            return;
        }

        //pasar datos a provider
        await submitProject({id, name, description, deliveryDate,customer})

        setId(null)
        setName('')
        setDescription('')
        setDeliveryDate('')
        setCustomer('')
        
    }
    const {msg} = alert;
  return (
    <form 
        className={'bg-white py-10 px-5 md:w1/2 rounded-lg '}
        onSubmit={handleSubmit}
    >
        {msg && <Alerts alert={alert}/>}
        <div>
            <label 
                htmlFor="name"
                className={'text-gray-700 uppercase font-bold text-sm'}
            >
                Project Name:
            </label>
            <input 
                id={'name'}
                type="text"
                className={'border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'} 
                placeholder={'Project Name...'}
                value={name}
                onChange={e => setName(e.target.value)}
            />
        </div>
        
        <div>
            <label 
                htmlFor="description"
                className={'text-gray-700 uppercase font-bold text-sm'}
            >
                Project Description:
            </label>
            <textarea 
                id={'description'}
                type="text"
                className={'border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'} 
                placeholder={'Project Description...'}
                value={description}
                onChange={e => setDescription(e.target.value)}
            />
        </div>
        
        <div>
            <label 
                htmlFor="delivery-date"
                className={'text-gray-700 uppercase font-bold text-sm'}
            >
                Delivery Date:
            </label>
            <input 
                id={'delivery-date'}
                type="date"
                className={'border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'} 
                value={deliveryDate}
                onChange={e => setDeliveryDate(e.target.value)}
            />
        </div>
        
        <div>
            <label 
                htmlFor="customer"
                className={'text-gray-700 uppercase font-bold text-sm'}
            >
                Customer:
            </label>
            <input 
                id={'customer'}
                type="text"
                className={'border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'} 
                placeholder={'Customer...'}
                value={customer}
                onChange={e => setCustomer(e.target.value)}
            />
        </div>

        <input 
            type="submit" 
            value={id ? 'Update Project' : 'Create Project'}
            className={'bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer mt-5 hover:bg-sky-700 transition-colors duration-300 ease-linear'}
        />
    </form>
  )
}

export default FormProject