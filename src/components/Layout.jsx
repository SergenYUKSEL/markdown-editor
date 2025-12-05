import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Sidebar from './Sidebar.jsx'
import MusicPlayer from './MusicPlayer.jsx'
import '../styles/strangerThings.css'

function Layout() {
    const theme = useSelector((state) => state.ui.theme);
    const isStrangerThings = theme === "strangerThings";

    useEffect(() => {
        if (isStrangerThings) {
            document.body.classList.add('stranger-things-theme');
        } else {
            document.body.classList.remove('stranger-things-theme');
        }
    }, [isStrangerThings]);
    
    return (
        <div 
            className={isStrangerThings ? "stranger-things-layout" : ""}
            style={{ 
                display: 'flex', 
                height: '100vh',
                backgroundColor: isStrangerThings ? '#0a0a0a' : 'transparent'
            }}
        >
            <MusicPlayer />
            <Sidebar />
            <main style={{ flex: 1, overflow: 'hidden' }}>
                <Outlet />
            </main>
        </div>
    )
}

export default Layout;