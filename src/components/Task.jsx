/* eslint-disable react/prop-types */
import { formatDate } from "../helpers/formatDate.js";
import useAdmin from "../hooks/useAdmin.jsx";
import useProjects from "../hooks/useProjects.jsx";

// eslint-disable-next-line react/prop-types
const Task = ({task}) => {

    const {handleModalEditTask,handleModalDeleteTask,completeTask} = useProjects();
    
    const {description, name, priority, deliveryDate,status,_id} = task
    const admin = useAdmin()


    return (
    <div
        className='border-b p-5 flex justify-between items-center'
    >
        <div className='flex flex-col items-start'>
            <p className='text-xl mb-2'>
                {name}
            </p>
            <p className='text-sm text-gray-500 uppercase mb-2'>
                {description}
            </p>
            <p className='text-sm mb-2'>
                {formatDate(deliveryDate)}
            </p>
            <p className='text-gray-600 mb-2'>
                Priority: {priority}
            </p>
            {status && <p
                        className='text-xs bg-green-600 uppercase p-1 rounded-lg text-white'
                        >
                            Completed by: {task.completed.name}
                        </p>}
        </div>

            <div className='flex flex-col lg:flex-row gap-2'>
        {admin && (
                <button
                    className='bg-indigo-600 px-4 py-3 uppercase font-bold text-white text-sm rounded-lg'
                    onClick={()=>handleModalEditTask(task)}

                    >
                    Edit
                </button>
        )}

                <button
                    className={`${status ? 'bg-sky-600':'bg-gray-600'} px-4 py-3 uppercase font-bold text-white text-sm rounded-lg`}
                    onClick={()=> completeTask(_id)}
                >
                    {status ? 'Complete' : 'Incomplete'}
                </button>
            
            {admin && (
                <button
                    className='bg-red-600 px-4 py-3 uppercase font-bold text-white text-sm rounded-lg'
                    onClick={() => handleModalDeleteTask(task)}
                    >
                    Delete
                </button>
        )}
            </div>
    </div>
  )
}

export default Task