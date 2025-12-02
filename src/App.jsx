import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import FilesView from './views/FilesView.jsx'
import BlocksView from './views/BlocksView.jsx'
import ImagesView from './views/ImagesView.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<FilesView />} />
          <Route path="files" element={<FilesView />} />
          <Route path="blocks" element={<BlocksView />} />
          <Route path="images" element={<ImagesView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
