import { Link, useNavigate } from "react-router-dom";
import useProjects from "../hooks/useProjects";
import Searcher from "./Searcher";
import useAuth from "../hooks/useAuth";

const Header = () => {
    const navigate = useNavigate()
    
    
    const {handleSearcher,closeSessionProjects} = useProjects()
    const {closeSessionAuth} = useAuth()
    
    function handleCloseSession(){
        closeSessionAuth()
        closeSessionProjects()
        localStorage.clear()
        return navigate('/')
    }

  return (
    <header className={'px-4 py-5 bg-white border-b'}>
        <div className="md:flex md:justify-between">
            <h2 className={'text-4xl text-sky-600 font-black text-center mb-5 md:mb-0'}>
                UpTask
            </h2>

            <div className={'flex flex-col md:flex-row items-center gap-4'}>
            <button
                type='button'
                className='font-bold uppercase'
                onClick={handleSearcher}
            >
                Search Project
            </button>
                <Link
                    to={'/projects'}
                    className={'font-bold uppercase'}
                >
                    Projects
                </Link>
                <button 
                    type={'button'}
                    className={'uppercase text-white text-sm bg-sky-600 p-3 rounded-md font-bold'}
                    onClick={handleCloseSession}
                >
                    Sign Out
                </button>
                <Searcher/>
            </div>
        </div>
    </header>
  )
}

export default Header