// src/components/TodoList.js
import React, { useState, useEffect } from 'react';
import './TodoList.css';

const TodoList = () => {
    const [tasks, setTasks] = useState([]);
    const [description, setDescription] = useState('');
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        if (userId) {
            fetchTasks();
        }
    }, [userId]);

    const fetchTasks = async () => {
        const response = await fetch(`http://localhost:3002/api/tasks/${userId}`);
        const data = await response.json();
        setTasks(data);
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:3002/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: userName }),
        });
        const user = await response.json();
        setUserId(user.id);
        setUserName('');
    };

    const addTask = async () => {
        const response = await fetch('http://localhost:3002/api/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description, userId }),
        });
        const newTask = await response.json();
        setTasks([...tasks, newTask]);
        setDescription('');
    };

    const removeTask = async (id) => {
        await fetch(`http://localhost:3002/api/remove/${id}`, { method: 'DELETE' });
        setTasks(tasks.filter(task => task.id !== id));
    };

    const completeTask = async (id) => {
        await fetch(`http://localhost:3002/api/complete/${id}`, { method: 'PUT' });
        setTasks(tasks.map(task => (task.id === id ? { ...task, is_completed: 1 } : task)));
    };

    return (
        <div>
            <h1>To-Do List</h1>
            {userId ? (
                <div>
                    <h2>Welcome, User {userId}</h2>
                    <input
                        type="text"
                        placeholder="Enter task description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <button onClick={addTask}>Add Task</button>

                    <ul>
                        {tasks.map(task => (
                            <li key={task.id} className={task.is_completed ? 'completed' : ''}>
                                <span>{task.id}. {task.description}</span>
                                <button onClick={() => completeTask(task.id)}>Complete</button>
                                <button onClick={() => removeTask(task.id)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <form onSubmit={handleUserSubmit}>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <button type="submit">Submit</button>
                </form>
            )}
        </div>
    );
};

export default TodoList;
