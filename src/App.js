import React, { useState, useEffect } from 'react';
import './App.css';


const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskCounter, setTaskCounter] = useState(0);
  const [taskInput, setTaskInput] = useState('');
  const [editingTask, setEditingTask] = useState(null);

   useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
      setTasks(storedTasks);
      setTaskCounter(storedTasks.length);
    }
  }, []);

    useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addOrUpdateTask = () => {
    if (taskInput.trim() !== '') {
      const taskArray = taskInput.split(' ');
      let taskName = '';
      let taskQuantity = 1;

      if (!isNaN(taskArray[taskArray.length - 1])) {
        taskQuantity = parseInt(taskArray.pop(), 10);
      }

      taskName = taskArray.join(' ');

      if (editingTask !== null) {
        
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === editingTask
              ? {
                  ...task,
                  name: taskName,
                  quantity: taskQuantity,
                  updates: task.updates + 1,
                }
              : task
          )
        );
        setEditingTask(null);
      } else {

        const newTasks = Array.from(
          { length: taskQuantity },
          (_, index) => ({
            id: taskCounter + index,
            name: taskName,
            quantity: taskQuantity,
            updates: 1,
          })
        );

        setTasks((prevTasks) => [...prevTasks, ...newTasks]);
        setTaskCounter((prevCounter) => prevCounter + taskQuantity);
      }

      setTaskInput('');
    }
  };

  const deleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    setTaskCounter((prevCounter) => prevCounter + 1);
    setEditingTask(null);
  };

  const startEditingTask = (taskId) => {
    setEditingTask(taskId);
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setTaskInput(`${taskToEdit.name} ${taskToEdit.quantity}`);
  };

  return (    
    <div className='bg-container'>
    <div className="todo-container">
      <h1 className="heading">Day Goals!</h1>
      <div className="input-container">
        <input
        className='todo-input'
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Add a Todo"
        />
        <button onClick={addOrUpdateTask} className='add-button'>
          {editingTask !== null ? 'Update' : 'Add Todo'}
        </button>
      </div>
      <div id="todo-list">
        {tasks.map((task) => (
          <div className="todo-item" key={task.id}>
            <span onClick={() => startEditingTask(task.id)}>
              {task.name}  (Updated {task.updates} times)
            </span>
            <div>
            <span className="edit-icon" onClick={() => startEditingTask(task.id)}>
            <span role="img" aria-label="edit" style={{ color: 'white' }}>
              ✏️
            </span>
            </span>
            <span className="delete-icon" onClick={() => deleteTask(task.id)}>
              <span role="img" aria-label="delete" style={{ color: 'red', margin: '0' }}>
                ❌
              </span>
            </span>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
  
}

export default App;