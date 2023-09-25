
import PreviewProject from '../components/PreviewProject';
import useProjects from '../hooks/useProjects'
import Alerts from '../components/Alerts';


const Projects = () => {
    
    const {projects,alert} = useProjects();

    const {msg}=alert
    return (
        <>
            <h1 className={'text-4xl font-black'}>Projects</h1>

            {msg && <Alerts alert={alert}/>}

            <div className="bg-white rounded-lg shadow mt-10">
                {projects.length ? 
                projects.map(project =>(
                    <PreviewProject key={project._id} project={project}/>
                ))
                : <p className={' text-center text-gray-600 uppercase p-5'}>There are not projects to show.</p>}
            </div>
        </>
)
}

export default Projects