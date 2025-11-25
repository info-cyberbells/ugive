import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from "react-redux";
import { ToastProvider } from './context/ToastContext.jsx';
import { store } from "./redux/store.js";
import { BrowserRouter } from "react-router-dom";


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ToastProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ToastProvider>
  </Provider>
)
