// src/pages/EmployeesListPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../index.css'; // Подключаем стили

function EmployeesListPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    let url = 'http://localhost:5000/employees'; // URL для json-server

    if (sortBy) {
      url += `?_sort=${sortBy}&_order=${sortOrder}`; // Параметры сортировки для json-server
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  }, [sortBy, sortOrder]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]); // Зависимость от fetchEmployees (которая зависит от sortBy, sortOrder)

  const handleSort = (columnName) => {
    if (sortBy === columnName) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnName);
      setSortOrder('asc');
    }
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm("Вы уверены, что хотите удалить данного сотрудника?")) {
      try {
        const response = await fetch(`http://localhost:5000/employees/${employeeId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // Обновляем список после успешного удаления, перезапросив данные
        fetchEmployees();
      } catch (error) {
        console.error("Error deleting employee:", error);
        setError('Не удалось удалить сотрудника. ' + error.message);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  if (loading) {
    return <div>Loading employees...</div>; 
  }

  if (error) {
    return <div className="error">Error: {error}</div>; 
  }

  return (
    <div>
      <h2>Список сотрудников "Крутой Банк"</h2>
      <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
        <Link to="/add" className="button button-add">Добавить сотрудника</Link>
        <button onClick={handleLogout} className="button button-delete">Выйти</button>
      </div>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
              ID {sortBy === 'id' && (sortOrder === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
              Имя {sortBy === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('position')} style={{ cursor: 'pointer' }}>
              Должность {sortBy === 'position' && (sortOrder === 'asc' ? '▲' : '▼')}
            </th>
            <th>Действие</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.position}</td>
              <td>
                <Link to={`/detail/${employee.id}`} className="button button-details" style={{ marginRight: '5px' }}>
                  Детали
                </Link>
                <Link to={`/edit/${employee.id}`} className="button button-edit" style={{ marginRight: '5px' }}>
                  Изменить
                </Link>
                <button className="button button-delete" onClick={() => handleDelete(employee.id)}>
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeesListPage;