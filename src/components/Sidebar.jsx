import { Link, useLocation } from 'react-router-dom'

function Sidebar() {
    const location = useLocation();

    return (
        <aside style={{ width: '200px', borderRight: '1px solid #ccc', padding: '1rem' }}>
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
                </ul>
            </nav>
        </aside>
    )
}

export default Sidebar;