import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import store from './Store/store'; // Assuming you have a Redux store
import { AuthProvider } from './routes/AuthContext'; // Importing AuthProvider
import Routes from './routes/Routes'; // Import the Routes
import { Toaster } from 'react-hot-toast';

// Wrap your app with necessary providers
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AuthProvider>  
      <RouterProvider router={Routes} />
      <Toaster /> {/* Place Toaster here */}

    </AuthProvider>
  </Provider>
);