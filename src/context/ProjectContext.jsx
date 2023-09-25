/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import axiosClient from '../config/axiosClient';
import {  useNavigate } from "react-router-dom";
import io from 'socket.io-client'
import useAuth from "../hooks/useAuth";
let socket;

const ProjectContext = createContext();
const ProjectProvider = ({children}) => {
    
    const [projects, setProjects] = useState([]);
    const [alert, setAlert] = useState({});
    const [project, setProject] = useState({});
    const [loading, setLoading] = useState(false);
    const [modalFormTask, setModalFormTask] = useState(false)
    const [task,setTask] =useState({})
    const [modalDeleteTask,setModalDeleteTask] =useState(false)
    const [collaborator,setCollaborator] =useState({})
    const [modalDeleteCollaborator,setModalDeleteCollaborator] =useState(false)
    const [searcher,setSearcher] =useState(false)

    const navigate = useNavigate()
    const{auth} = useAuth()

    
    useEffect(()=>{
        const getProjects = async () =>{
            try {
                            const token = localStorage.getItem('token')
            if(!token) return;

            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data}=await axiosClient('/projects',config)
            setProjects(data)
            } catch (error) {
                console.log(error)
            }
        }
        getProjects();
    },[auth])

    useEffect(()=>{
        socket = io(import.meta.env.VITE_BACKEND_URL)
    },[])

    const showAlert =(alert)=>{
        setAlert(alert)

        setTimeout(() => {
            setAlert({})
        }, 3000);
    }

    const submitProject = async (project) =>{
        if(project.id){
            await editProject(project)
        }else{
            await createProject(project)
        }
       
    }

    const editProject = async (project)=>{
        try {
            const token = localStorage.getItem('token')
            if(!token){
                return
            }

            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} =await axiosClient.put(`/projects/${project.id}`,project,config)
            
            //sincronizar state
            const projectsUpdated = projects.map(projectState => projectState._id === data._id ? data : projectState)
            setProjects(projectsUpdated)

            //mostrar la alerta
            setAlert({
                msg:'Project Updated successfully',
                error:false
            })

            //Redireccionar
            setTimeout(() => {
                setAlert({})
                navigate('/projects')
            }, 3000);
        } catch (error) {
            console.log(error)
        }
    }
    const createProject = async (project)=>{
        try {
            const token = localStorage.getItem('token')
            if(!token){
                return
            }

            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} =await axiosClient.post('/projects', project, config)
            setProjects([...projects,data])
            setAlert({
                msg:'Project created successfully',
                error:false
            })

            setTimeout(() => {
                setAlert({})
                navigate('/projects')
            }, 3000);
        } catch (error) {
            console.log(error)
        }
    }

    const getProject = async (id)=>{
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            if(!token){
                return
            }

            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await axiosClient(`/projects/${id}`,config)
            setProject(data)
        } catch (error) {
            navigate('/projects')
            setAlert({
                msg:error.response.data.msg,
                error:true
            })
            setTimeout(() => {
                setAlert({})
            }, 3000);
        }finally{
            setLoading(false)
        }
        
    }

    const deleteProject = async (id) =>{
        try {
            const token = localStorage.getItem('token')
            if(!token){
                return
            }

            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await axiosClient.delete(`/projects/${id}`,config)

            const projectsUpdated = projects.filter(projectState => projectState._id !== id)
            setProjects(projectsUpdated)

            setAlert({
                msg:data.msg,
                error:false
            })

            setTimeout(() => {
                setAlert({})
                navigate('/projects')
            }, 3000);
        } catch (error) {
            console.log(error)
        }
    }

    const handleModalTask = () =>{
        setModalFormTask(!modalFormTask);
        setTask({})
    }

    const submitTask = async (task) =>{

        if(task?.id){
            await editTask(task)
        }else{
            await createTask(task)
        }

        
    }

    const createTask = async (task)=>{
        try {
            const token = localStorage.getItem('token')
            if(!token){
                return
            }

            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await axiosClient.post('/tasks', task, config)
            
            setAlert({})
            setModalFormTask(false)

            //SOCKET IO
            socket.emit('new task',data)
        } catch (error) {
            console.log(error)
        }
    }

    const editTask = async (task)=>{
        try {
            const token = localStorage.getItem('token')
            if(!token){
                return
            }

            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await axiosClient.put(`/tasks/${task.id}`, task, config) 

            setAlert({})
            setModalFormTask(false)

            //SOCKET
            socket.emit('update task',data)

        } catch (error) {
            console.log(error)
        }
    }

    const handleModalEditTask = (task)=>{
        setTask(task)
        setModalFormTask(true)
        
    }

    const handleModalDeleteTask = (task)=>{
        setTask(task)
        setModalDeleteTask(!modalDeleteTask)
    }

    const deleteTask = async ()=>{
        try {
            const token = localStorage.getItem('token')
            if(!token){
                return
            }

            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await axiosClient.delete(`/tasks/${task._id}`, config) 
            //*Actualizar el DOM

            setAlert({
                msg:data.msg,
                error:false
            })
            setModalDeleteTask(false)

            //socket
            socket.emit("delete task",task)
            
            setTask({})
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

    const submitCollaborator = async (email)=>{
        
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            if(!token){
                return
            }

            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data} = await axiosClient.post('/projects/collaborators', email,config)
            setCollaborator(data)
            setAlert({})
        } catch (error) {
            setAlert({
                msg:error.response.data.msg,
                error:true
            })
            setTimeout(() => {
                setAlert({})
            }, 3000);
        } finally{
            setLoading(false)
        }
    }

    const addCollaborator = async (email,id) =>{
        try {
            const token = localStorage.getItem('token')
            if(!token){
                return
            }

            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data} = await axiosClient.post(`/projects/collaborators/${project._id}`, email,config)
            setAlert({
                msg:data.msg,
                error:false
            })
            setCollaborator({})
            setTimeout(() => {
                setAlert({})
                navigate(`/projects/${id}`);
            }, 3000);

        } catch (error) {
            setAlert({
                msg:error.response.data.msg,
                error:true
            })
            setTimeout(() => {
                setAlert({})
            }, 3000);
        }
    }

    const handleModalDeleteCollaborator = (collaborator)=>{
        setModalDeleteCollaborator(!modalDeleteCollaborator)
        setCollaborator(collaborator)
    }

    const deleteCollaborator = async ()=>{
        try {
 const token = localStorage.getItem('token')
 if(!token){
     return
            }
            
            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            
            const { data} = await axiosClient.post(`/projects/delete-collaborator/${project._id}`, {id: collaborator._id},config)
            
            const updatedProject = {...project}
            updatedProject.colaborators = updatedProject.colaborators.filter(collaboratorState => collaboratorState._id !== collaborator._id)
            setProject(updatedProject)
            
            setAlert({
                msg:data.msg,
                error:false
            })
            setCollaborator({})
            setModalDeleteCollaborator(false)
            setTimeout(() => {
                setAlert({})
            }, 3000);
        } catch (error) {
            console.log(error.response)
        }
    }

    const completeTask = async (id)=>{
        try {
            const token = localStorage.getItem('token')
            if(!token){
                return
            }

            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await axiosClient.post(`/tasks/status/${id}`,{},config)

            setTask({})
            setAlert({})

            //SOCKET
            socket.emit('change status',data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSearcher = () =>{
        setSearcher(!searcher)
    }

    //SOCKET IO 
    const submitTaskProject =async (task,project)=>{
        //Agregar la tarea al state
        const updatedProject = await {...project}
        
        updatedProject.tasks = [...updatedProject.tasks, task]
        setProject(updatedProject)
    }
    const deleteTaskProject = async (task)=>{

        const updatedProject = {...project}
        updatedProject.tasks = await updatedProject?.tasks?.filter(taskState => taskState?._id !== task?._id)
        setProject(updatedProject)
    }
    const updateTaskProject = async (task)=>{

        const updatedProject = {...project}
        updatedProject.tasks = await updatedProject?.tasks?.map(taskState => taskState?._id === task?._id ? task : taskState)
        setProject(updatedProject)
    }
    const changeStatusTask = async (task)=>{

        const updatedProject = {...project}
        updatedProject.tasks = await updatedProject?.tasks?.map(taskState => taskState?._id === task?._id ? task : taskState)
        setProject(updatedProject)
    }

    const closeSessionProjects = ()=>{
        setProjects([])
        setProject({})
        setAlert({})
    }

    return (
        <ProjectContext.Provider
            value={{
                projects,
                setProjects,
                alert,
                showAlert,
                submitProject,
                getProject,
                project,
                loading,
                deleteProject,
                modalFormTask,
                handleModalTask,
                submitTask,
                task,
                handleModalEditTask,
                modalDeleteTask,
                handleModalDeleteTask,
                deleteTask,
                submitCollaborator,
                collaborator,
                addCollaborator,
                modalDeleteCollaborator,
                handleModalDeleteCollaborator,
                deleteCollaborator,
                completeTask,
                searcher,
                handleSearcher,
                submitTaskProject,
                deleteTaskProject,
                updateTaskProject,
                changeStatusTask,
                closeSessionProjects
            }}
        >
            {children}
        </ProjectContext.Provider>
    )
}

export {
    ProjectProvider
}

export default ProjectContext;