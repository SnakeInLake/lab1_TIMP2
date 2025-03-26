// src/pages/EmployeeAddPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css'; // Подключаем стили

function EmployeeAddPage() {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [details, setDetails] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // Для индикации загрузки
  const navigate = useNavigate();

  const validateForm = () => {
    const validationErrors = {};
    if (!name.trim()) {
      validationErrors.name = 'Имя обязательно для добавления';
    }
    if (!position.trim()) {
      validationErrors.position = 'Должность обязательна для добавления';
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0; // true если нет ошибок
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({}); // Сброс общих ошибок

    try {
      const response = await fetch('http://localhost:5000/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, position, details }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Попытка получить JSON ошибки
        throw new Error(errorData.message || `Failed to add employee. Status: ${response.status}`);
      }
      // const newEmployee = await response.json(); // Можно получить добавленный объект
      navigate('/'); // Перенаправляем на главную после успеха

    } catch (error) {
      console.error('Error adding employee:', error);
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Добавить сотрудника</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="name">Имя:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            style={{ width: '100%' }}
          />
          {errors.name && <div className="error">{errors.name}</div>}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="position">Должность:</label>
          <input
            type="text"
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            disabled={isSubmitting}
             style={{ width: '100%' }}
          />
          {errors.position && <div className="error">{errors.position}</div>}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="details">Детали:</label>
          <textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows="5"
            disabled={isSubmitting}
            style={{ width: '100%', resize: 'vertical' }}
          />
        </div>
        {errors.submit && <div className="error">{errors.submit}</div>}
        <div style={{ marginTop: '20px' }}>
          <button type="submit" className="button button-add" disabled={isSubmitting}>
            {isSubmitting ? 'Добавление...' : 'Добавить'}
          </button>
          <button type="button" className="button button-delete" onClick={() => navigate('/')} disabled={isSubmitting} style={{ marginLeft: '10px' }}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeAddPage;