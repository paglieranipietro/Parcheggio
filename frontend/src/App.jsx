import UserDashboard from './pages/UserDashboard';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <UserDashboard />
    </AuthProvider>
  )
}

export default App
