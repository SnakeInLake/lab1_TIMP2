// src/pages/EmployeeEditPage.js
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';
import '../index.css'; // Подключаем стили

function EmployeeEditPage() {
  const { id } = useParams(); // Получаем ID из URL
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [details, setDetails] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Функция загрузки данных сотрудника
  const fetchEmployeeData = useCallback(async () => {
      setLoading(true);
      setErrors({});
      try {
          const response = await fetch(`http://localhost:5000/employees/${id}`);
          if (!response.ok) {
              if (response.status === 404) throw new Error('Сотрудник не найден');
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const employee = await response.json();
          setName(employee.name);
          setPosition(employee.position);
          setDetails(employee.details || ''); // Убедимся, что details не undefined
      } catch (error) {
          console.error("Error fetching employee data:", error);
          setErrors({ load: error.message });
      } finally {
          setLoading(false);
      }
  }, [id]);

  // Загружаем данные при монтировании или изменении ID
  useEffect(() => {
      fetchEmployeeData();
  }, [fetchEmployeeData]);

  const validateForm = () => {
    const validationErrors = {};
    if (!name.trim()) validationErrors.name = 'Имя обязательно';
    if (!position.trim()) validationErrors.position = 'Должность обязательна';
    setErrors(prev => ({ ...prev, ...validationErrors })); // Добавляем ошибки валидации, не стирая ошибки загрузки
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors(prev => ({ load: prev.load })); // Очищаем ошибки отправки/валидации, сохраняем ошибки загрузки

    try {
      const response = await fetch(`http://localhost:5000/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, position, details }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update employee. Status: ${response.status}`);
      }
      // const updatedEmployee = await response.json();
      navigate(`/detail/${id}`); // Переход на страницу деталей после успеха
      // Или на главную: navigate('/');
    } catch (error) {
      console.error('Error updating employee:', error);
      setErrors(prev => ({ ...prev, submit: error.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div>Загрузка данных сотрудника...</div>;
  }

  if (errors.load) {
      return <div className="error">Ошибка загрузки: {errors.load} <Link to="/">На главную</Link></div>;
  }

  return (
    <div>
      <h2>Изменить сотрудника (ID: {id})</h2>
      <form onSubmit={handleSubmit}>
        {/* Поля формы аналогичны EmployeeAddPage */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="name">Имя:</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={isSubmitting} style={{ width: '100%' }} />
          {errors.name && <div className="error">{errors.name}</div>}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="position">Должность:</label>
          <input type="text" id="position" value={position} onChange={(e) => setPosition(e.target.value)} disabled={isSubmitting} style={{ width: '100%' }} />
          {errors.position && <div className="error">{errors.position}</div>}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="details">Детали:</label>
          <textarea id="details" value={details} onChange={(e) => setDetails(e.target.value)} rows="5" disabled={isSubmitting} style={{ width: '100%', resize: 'vertical' }} />
        </div>

        {errors.submit && <div className="error">{errors.submit}</div>}
        <div style={{ marginTop: '20px' }}>
          <button type="submit" className="button button-edit" disabled={isSubmitting}>
            {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
          {/* Кнопка отмены ведет на страницу деталей или на главную */}
          <button type="button" className="button button-delete" onClick={() => navigate(`/detail/${id}`)} disabled={isSubmitting} style={{ marginLeft: '10px' }}>
            Отмена
          </button>
           {/* Или кнопка "Назад" */}
           {/* <button type='button' onClick={() => navigate(-1)} className="button" style={{ marginLeft: '10px' }}>Назад</button> */}
        </div>
      </form>
    </div>
  );
}

export default EmployeeEditPage;