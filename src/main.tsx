import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { store } from './stores/store';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastContainer
      hideProgressBar={true}
      theme={localStorage.getItem("theme")?.toString()}
    />
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
