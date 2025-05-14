import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
// Cấu hình react-query
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import './styles/index.css'
// Cấu hình redux
import { Provider } from 'react-redux';
import { store } from './redux/store';

const queryClient = new QueryClient();
createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>

      <StrictMode>
        <App />
      </StrictMode>
    </Provider>
  </QueryClientProvider>,
  
)
