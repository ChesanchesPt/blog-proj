import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { PostsList } from './pages/PostsList';
// import { PostDetail } from './pages/PostDetail';
import { CreatePost } from './pages/CreatePost';
// import { EditPost } from './pages/EditPost';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <PostsList />
            </ProtectedRoute>
          } />
          {/* <Route path="/posts/:id" element={
            <ProtectedRoute>
              <PostDetail />
            </ProtectedRoute>
          } /> */}
          <Route path="/create" element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          } />
          {/* <Route path="/edit/:id" element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          } /> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;