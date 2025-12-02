import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'

function Layout() { 
    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <Sidebar />
            <main style={{ flex: 1, overflow: 'hidden' }}>
                <Outlet />
            </main>
        </div>
    )
}

export default Layout;