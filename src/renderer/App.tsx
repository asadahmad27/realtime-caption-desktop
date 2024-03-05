import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './views/Login';
import PublicRoute from './routes/publicRouting';
import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute restricted={false}>
              <Login />
            </PublicRoute>
          }
        />
      </Routes>
    </Router>
  );
}
