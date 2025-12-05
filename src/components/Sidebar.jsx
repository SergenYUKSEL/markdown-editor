import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import '../styles/strangerThings.css'

function Sidebar() {
    const location = useLocation();
    const theme = useSelector((state) => state.ui.theme);
    const isStrangerThings = theme === "strangerThings";

    return (
        <aside 
            className={isStrangerThings ? "stranger-things-sidebar" : ""}
            style={{ 
                width: '200px', 
                borderRight: isStrangerThings ? '2px solid #e50914' : '1px solid #ccc', 
                padding: '1rem',
                backgroundColor: isStrangerThings ? '#1a0000' : 'transparent'
            }}
        >
            <nav>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li>
                        <Link to="/files" style={{ fontWeight: location.pathname === '/files' ? 'bold' : 'normal' }}>
                            Fichiers
                        </Link>
                    </li>
                    <li>
                        <Link to="/blocks" style={{ fontWeight: location.pathname === '/blocks' ? 'bold' : 'normal' }}>
                            Blocs
                        </Link>
                    </li>
                    <li>
                        <Link to="/images" style={{ fontWeight: location.pathname === '/images' ? 'bold' : 'normal' }}>
                            Images
                        </Link>
                    </li>
                    <li>
                        <Link to="/collaborations" style={{ fontWeight: location.pathname === '/collaborations' ? 'bold' : 'normal' }}>
                            Collaborations
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    )
}

export default Sidebar;