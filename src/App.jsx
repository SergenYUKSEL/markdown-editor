import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import FilesView from './features/files/FilesView.jsx'
import BlocksView from './features/blocks/BlocksView.jsx'
import ImagesView from './features/images/ImagesView.jsx'
import CollaborationsView from './features/collaborations/CollaborationsView.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<FilesView />} />
          <Route path="files" element={<FilesView />} />
          <Route path="blocks" element={<BlocksView />} />
          <Route path="images" element={<ImagesView />} />
          <Route path="collaborations" element={<CollaborationsView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
