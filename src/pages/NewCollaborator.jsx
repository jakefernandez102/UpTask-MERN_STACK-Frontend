import { useEffect } from "react";
import FormCollaborator from "../components/FormCollaborator";
import useProjects from "../hooks/useProjects";
import { redirect, useParams } from "react-router-dom";
import Alerts from "../components/Alerts";

const NewCollaborator = () => {

  const {getProject,project,loading,collaborator,addCollaborator,alert}=useProjects()
  const {id} = useParams()

  useEffect(()=>{
    getProject(id)
  },[])


  // if (loading) return 'Loading ...';
  if(!project._id) return <Alerts alert={alert}/>

  return (
    <>
        <h1
            className='text-4xl font-black'
        >
            Add Collaborator to project: {' '} <span className='text-sky-600'>{project.name}</span>
        </h1>

        <div 
          className="mt-10 flex justify-center w-full">
            <FormCollaborator/>
        </div>
        
        {loading ? <p className='text-center'>Loading...</p> : collaborator?._id && (
          <div
            className='flex justify-center mt-10'
          >
            <div
              className='bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow'
            >
              <h2
                className='text-center mb-10 text-2xl font-bold'
              >
                Results
              </h2>

              <div
                className='flex justify-between items-center'
              >
                <p>{collaborator.name}</p>
                <button
                  type='button'
                  className='bg-slate-500 px-5 py-2 rounded-lg uppercase text-white font-bold text-sm'
                  onClick={
                    ()=> {
                      addCollaborator({email: collaborator.email},id)
                      
                    }}
                >
                  Add to the project
                </button>
              </div>

            </div>
          </div>
        ) }
    </>
  )
}

export default NewCollaborator