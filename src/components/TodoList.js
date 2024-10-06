// src/components/TodoList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TodoList.css'; // Add your CSS styles

const TodoList = () => {
    const [tasks, setTasks] = useState([]);
    const [taskDescription, setTaskDescription] = useState('');

    // Fetch tasks from the backend
    const fetchTasks = async () => {
        const response = await axios.get('http://localhost:3002/api/tasks'); // Ensure your API endpoint is correct
        setTasks(response.data);
    };

    // Add a new task
    const addTask = async () => {
        if (taskDescription.trim()) {
            const response = await axios.post('http://localhost:3002/api/add', {
                description: taskDescription
            });
            setTasks([...tasks, response.data]);
            setTaskDescription('');
        }
    };

    // Remove a task
    const removeTask = async (id) => {
        await axios.delete(`http://localhost:3002/api/remove/${id}`);
        setTasks(tasks.filter(task => task.id !== id));
    };

    // Mark a task as completed
    const markCompleted = async (id) => {
        await axios.put(`http://localhost:3002/api/complete/${id}`);
        setTasks(tasks.map(task => (task.id === id ? { ...task, is_completed: 1 } : task)));
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="todo-list">
            <h1>To-Do List</h1>
            <input
                type="text"
                placeholder="Add a new task..."
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
            />
            <button onClick={addTask}>Add Task</button>

            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        <span className={task.is_completed ? 'completed' : ''}>{task.description}</span>
                        <button onClick={() => markCompleted(task.id)}>Complete</button>
                        <button onClick={() => removeTask(task.id)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;
