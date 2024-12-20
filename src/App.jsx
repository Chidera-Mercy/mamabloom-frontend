import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChildrenDashboard from './pages/ChildrenDashboard';
import ChildDetail from './pages/ChildDetail';
import Dashboard from './pages/Dashboard';
import Community from './pages/Community';
import NewThread from './pages/NewThread';
import ThreadView from './pages/ThreadView';
import Resources from './pages/Resources';
import ResourceView from './pages/ResourceView';
import CreateResource from './pages/CreateResource';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/children" element={<ChildrenDashboard />} />
          <Route path="/child/:childId" element={<ChildDetail />} />
          <Route path="/dashboard" element={ <Dashboard />} />
          <Route path="/community" element={<Community />} />
          <Route path="/community/new-thread" element={<NewThread />} />
          <Route path="/community/thread/:threadId" element={<ThreadView />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/:resourceId" element={<ResourceView />} />
          <Route path="/resources/create" element={<CreateResource />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;