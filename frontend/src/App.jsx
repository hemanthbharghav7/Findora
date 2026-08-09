import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';


function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {/* Your Navbar will eventually go here so it shows on every page */}
      <AppRoutes />
      {/* Your Footer will eventually go here */}
    </BrowserRouter>
  );
}

export default App;