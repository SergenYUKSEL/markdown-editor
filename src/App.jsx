import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import FilesView from './features/files/FilesView.jsx'
import BlocksView from './features/blocks/BlocksView.jsx'
import ImagesView from './features/images/ImagesView.jsx'
import CollaborationsView from './features/collaborations/CollaborationsView.jsx'

// Configuration des routes avec createBrowserRouter (approche moderne React Router v6.4+)
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <FilesView />,
      },
      {
        path: 'files',
        element: <FilesView />,
      },
      {
        path: 'blocks',
        element: <BlocksView />,
      },
      {
        path: 'images',
        element: <ImagesView />,
      },
      {
        path: 'collaborations',
        element: <CollaborationsView />,
      },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
