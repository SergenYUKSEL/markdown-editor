import { StrictMode } from 'react'
import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider, useDispatch } from 'react-redux'
import { store } from './store/store.js'
import { loadPersistedData } from './store/persistence.js'
import './index.css'
import App from './App.jsx'

// Composant pour charger les données au démarrage
function AppWithPersistence() {
  const dispatch = useDispatch();

  useEffect(() => {
    loadPersistedData(dispatch);
  }, [dispatch]);

  return <App />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AppWithPersistence />
    </Provider>
  </StrictMode>,
)
