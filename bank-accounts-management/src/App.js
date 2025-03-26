// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import EmployeesListPage from './pages/EmployeesListPage';
import EmployeeAddPage from './pages/EmployeeAddPage';
import EmployeeEditPage from './pages/EmployeeEditPage';
import EmployeeDetailPage from './pages/EmployeeDetailPage';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css'; 

function App() {
  return (
    <Router>
      <div style={{ padding: '20px' }}>
        <Routes>
          {/* Страница входа */}
          <Route path="/login" element={<LoginPage />} />

          {/* Защищенные страницы */}
          <Route
            path="/"
            element={<ProtectedRoute><EmployeesListPage /></ProtectedRoute>}
          />
          <Route
            path="/add"
            element={<ProtectedRoute><EmployeeAddPage /></ProtectedRoute>}
          />
          <Route
            path="/edit/:id" // Маршрут для редактирования
            element={<ProtectedRoute><EmployeeEditPage /></ProtectedRoute>}
          />
          <Route
            path="/detail/:id" // Маршрут для деталей
            element={<ProtectedRoute><EmployeeDetailPage /></ProtectedRoute>}
          />

          {/* Страница 404 */}
          <Route path="*" element={
              <div>
                  <h2>404 - Страница не найдена</h2>
                  <Link to="/">На главную</Link>
              </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;