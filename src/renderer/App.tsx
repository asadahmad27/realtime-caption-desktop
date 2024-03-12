import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, Login } from './components/index';
import PublicRoute from './routes/publicRouting';
import './App.css';
import BookView from './components/BookView/BookView';

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
        <Route
          path="/home"
          element={
            <PublicRoute restricted={false}>
              <Home />
            </PublicRoute>
          }
        />
      </Routes>
    </Router>
  );
}
