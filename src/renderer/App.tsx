import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, Login } from './components/index';
import PublicRoute from './routes/publicRouting';
import BookView from './components/BookView/BookView';
import SearchPage from './components/SearchPage/SearchPage';
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
        <Route
          path="/home"
          element={
            <PublicRoute restricted={false}>
              <Home />
            </PublicRoute>
          }
        />
        <Route
          path="/book/:id"
          element={
            <PublicRoute restricted={false}>
              <BookView />
            </PublicRoute>
          }
        />
        <Route
          path="/search/:searchText"
          element={
            <PublicRoute restricted={false}>
              <SearchPage />
            </PublicRoute>
          }
        />
      </Routes>
    </Router>
  );
}
