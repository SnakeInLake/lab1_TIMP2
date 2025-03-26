// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../index.css'; // Подключаем стили

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Откуда пользователь пришел (если был перенаправлен)
  const from = location.state?.from?.pathname || "/";

  const handleLogin = (event) => {
    event.preventDefault();
    setError(''); // Сброс ошибки

    // Простейшая проверка (замените на вашу логику, если нужно)
    if (username === 'admin' && password === '123') {
      localStorage.setItem('isAuthenticated', 'true'); // Сохраняем статус входа
      navigate(from, { replace: true }); // Перенаправляем на исходную страницу или главную
    } else {
      setError('Неверный логин или пароль');
      localStorage.removeItem('isAuthenticated'); // На всякий случай чистим
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Вход</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Логин:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Пароль:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        {error && <div className="error" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <button type="submit" className="button button-add" style={{ width: '100%', padding: '10px' }}>
          Войти
        </button>
      </form>
    </div>
  );
}

export default LoginPage;