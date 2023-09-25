import { Link, useParams } from "react-router-dom";
import useProjects from '../hooks/useProjects';
import { useEffect } from "react";
import ModalFormTaks from "../components/ModalFormTaks";
import Task from "../components/Task";
import ModalDeleteTask from "../components/ModalDeleteTask";
import Collaborator from "../components/Collaborator";
import ModalDeleteCollaborator from "../components/ModalDeleteCollaborator";
import useAdmin from "../hooks/useAdmin";
import io from 'socket.io-client'

let socket;

const Project = () => {
    const {id} = useParams()

    const {
        getProject,
        project,
        loading, 
        handleModalTask,
        submitTaskProject,
        deleteTaskProject,
        updateTaskProject
    } = useProjects()

    const admin = useAdmin()

    useEffect(()=>{
        getProject(id)
    },[])

    useEffect(()=>{
        socket = io(import.meta.env.VITE_BACKEND_URL)
        socket.emit('open project', id)
    },[])
    useEffect(()=>{
        socket.on('added task',(newTask)=>{
            if(newTask.project === project._id){
                submitTaskProject(newTask,project)
            }
        })
        socket.on('deleted task',(deletedTask)=>{
            console.log(deletedTask)
            if(deletedTask.project === project._id){
                deleteTaskProject(deletedTask)
            }
        })
        socket.on('updated task',(updatedTask)=>{
            
            if(updatedTask.project._id === project._id){
                updateTaskProject(updatedTask)
            }
        })
        socket.on('new status',(newStatusTask)=>{
            
            if(newStatusTask.project._id === project._id){
                updateTaskProject(newStatusTask)
            }
        })
    })

    const {name } = project

  return (
    loading ? 'Loading...' : (

            <>
                <div className={'flex justify-between'}>
                    <h1 className={'font-black text-4xl'}>{name}</h1>



                    {admin &&(
                        <div className={'flex items-center gap-2 text-gray-400 hover:text-black'}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                            </svg>
                            <Link
                                to={`/projects/edit/${id}`}
                                className={'uppercase font-bold'}
                                >
                                Edit
                            </Link>
                        </div>
                    )}
                </div>
                {admin && (
                    <button
                        onClick={handleModalTask}
                        type='button'
                        className='text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center mt-2 flex gap-2'
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>

                        New Task
                    </button>
                )}
                <p
                    className='font-bold text-xl mt-10'
                >
                    Tasks of Project
                </p>

                <div 
                    className="bg-white shadow mt-10 rounded-lg"
                >
                    {
                        project?.tasks?.length 
                        ? 
                            project?.tasks?.map((task)=>(
                                <Task 
                                    key={task._id} 
                                    task={task} 
                                />
                            ))
                        : 
                            <p
                                className='text-center my-5 p-10 '
                            >
                                There are no tasks on this project
                            </p>
                    }
                </div>
                
                {admin && (
                    <>
                        <div className="flex items-center justify-between mt-10">
                            <p
                                className='font-bold text-xl mt-10'
                                >
                                Colaborators
                            </p>

                            <Link
                                to={`/projects/new-collaborator/${project._id}`}
                                className='text-gray-400 uppercase font-bold hover:text-black bg-gray-300 px-3 py-2 rounded-lg'
                                >
                                Add
                            </Link>
                        </div>

                        <div 
                            className="bg-white shadow mt-10 rounded-lg"
                        >
                        {
                            project?.colaborators?.length 
                            ? 
                            project?.colaborators?.map((collaborator)=>(
                                    <Collaborator key={collaborator._id} collaborator={collaborator}/>
                                ))
                                : 
                                <p
                                className='text-center my-5 p-10 '
                                >
                                    There are no collaborators on this project
                                </p>
                        }
                        </div>
                    </>
                 )}

                <ModalFormTaks />
                <ModalDeleteTask/>

                <ModalDeleteCollaborator/>
            </>
        
    )
  )
}

export default Project