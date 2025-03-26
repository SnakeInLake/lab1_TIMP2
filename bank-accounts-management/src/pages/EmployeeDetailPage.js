// src/pages/EmployeeDetailPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../index.css'; // Подключаем стили

function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmployee = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
          const response = await fetch(`http://localhost:5000/employees/${id}`);
          if (!response.ok) {
               if (response.status === 404) throw new Error('Сотрудник не найден');
               throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setEmployee(data);
      } catch (error) {
          setError(error.message);
          console.error("Error fetching employee:", error);
      } finally {
          setLoading(false);
      }
  }, [id]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  const handleDelete = async () => {
      if (window.confirm("Вы уверены, что хотите удалить данного сотрудника?")) {
          try {
              const response = await fetch(`http://localhost:5000/employees/${id}`, {
                  method: 'DELETE',
              });
              if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
              navigate('/'); // Переход на главную после удаления
          } catch (err) {
              console.error("Error deleting employee:", err);
              setError('Не удалось удалить сотрудника. ' + err.message);
          }
      }
  };


  if (loading) {
    return <div>Загрузка деталей сотрудника...</div>;
  }

  // Если была ошибка или сотрудник не найден после загрузки
  if (error || !employee) {
    return (
        <div>
            <p className="error">Ошибка: {error || 'Сотрудник не найден.'}</p>
            <Link to="/" className="button">На главную</Link>
        </div>
    );
  }

  // Отображение деталей, если все хорошо
  return (
    <div>
      <h2>Детали сотрудника</h2>
      <p><strong>ID:</strong> {employee.id}</p>
      <p><strong>Имя:</strong> {employee.name}</p>
      <p><strong>Должность:</strong> {employee.position}</p>
      <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', marginTop: '10px', marginBottom: '15px' }}>
        <p><strong>Детали:</strong> <br /><span style={{ whiteSpace: 'pre-line' }}>{employee.details || 'Нет деталей'}</span></p>
      </div>
       {/* Показываем ошибку удаления, если она есть */}
       {error && !loading && <div className="error" style={{marginBottom: '10px'}}>{error}</div>}
      <div>
        <Link to={`/edit/${employee.id}`} className="button button-edit" style={{ marginRight: '10px' }}>
          Редактировать
        </Link>
         <button onClick={handleDelete} className="button button-delete" style={{ marginRight: '10px' }}>
              Удалить
          </button>
          <Link to="/" className="button" style={{ color: '#333', textDecoration: 'none' }} // кто вообще придумал такие сложности для раскраски текста кнопки?
          >
          К списку
        </Link>
      </div>
    </div>
  );
}

export default EmployeeDetailPage;