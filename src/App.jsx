import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus, Check, X, Calendar, Search } from 'lucide-react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskCategory, setNewTaskCategory] = useState('personal');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        title: newTask,
        description: newTaskDescription,
        completed: false,
        priority: newTaskPriority,
        category: newTaskCategory,
        dueDate: newTaskDueDate,
        createdAt: new Date().toISOString()
      };
      setTasks([...tasks, task]);
      setNewTask('');
      setNewTaskDescription('');
      setNewTaskPriority('medium');
      setNewTaskCategory('personal');
      setNewTaskDueDate('');
      setShowAddForm(false);
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEdit = (task) => {
    setEditingTask(task);
  };

  const saveEdit = () => {
    setTasks(tasks.map(task =>
      task.id === editingTask.id ? editingTask : task
    ));
    setEditingTask(null);
  };

  const cancelEdit = () => {
    setEditingTask(null);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'completed' ? task.completed :
      filter === 'active' ? !task.completed :
      filter === task.priority || filter === task.category;
    
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length,
    high: tasks.filter(t => t.priority === 'high' && !t.completed).length
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return darkMode ? 'priority-high-dark' : 'priority-high';
      case 'medium': return darkMode ? 'priority-medium-dark' : 'priority-medium';
      case 'low': return darkMode ? 'priority-low-dark' : 'priority-low';
      default: return '';
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'work': return darkMode ? 'category-work-dark' : 'category-work';
      case 'personal': return darkMode ? 'category-personal-dark' : 'category-personal';
      case 'shopping': return darkMode ? 'category-shopping-dark' : 'category-shopping';
      case 'health': return darkMode ? 'category-health-dark' : 'category-health';
      default: return darkMode ? 'category-default-dark' : 'category-default';
    }
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="header-top">
            <div className="title-section">
              <h1 className="main-title">Task Manager Pro</h1>
              <p className="subtitle">Stay organized and productive</p>
            </div>
            <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle">
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <p className="stat-label">Total Tasks</p>
              <p className="stat-value">{stats.total}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Completed</p>
              <p className="stat-value stat-completed">{stats.completed}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Active</p>
              <p className="stat-value stat-active">{stats.active}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">High Priority</p>
              <p className="stat-value stat-high">{stats.high}</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="search-filter-container">
            <div className="search-box">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-buttons">
              {['all', 'active', 'completed', 'high', 'medium', 'low', 'work', 'personal'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`filter-btn ${filter === f ? 'active' : ''}`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Add Task Button */}
        {!showAddForm && (
          <button onClick={() => setShowAddForm(true)} className="add-task-btn">
            <Plus size={20} />
            <span>Add New Task</span>
          </button>
        )}

        {/* Add Task Form */}
        {showAddForm && (
          <div className="task-form">
            <h3 className="form-title">Create New Task</h3>
            <div className="form-content">
              <input
                type="text"
                placeholder="Task title *"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                className="form-input"
              />
              <textarea
                placeholder="Description (optional)"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                className="form-textarea"
                rows="3"
              />
              <div className="form-grid">
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value)}
                  className="form-select"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value)}
                  className="form-select"
                >
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="shopping">Shopping</option>
                  <option value="health">Health</option>
                </select>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-actions">
                <button onClick={addTask} disabled={!newTask.trim()} className="btn-primary">
                  Add Task
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewTask('');
                    setNewTaskDescription('');
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tasks List */}
        <div className="tasks-list">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <p>{searchTerm || filter !== 'all' ? 'No tasks found' : 'No tasks yet. Create your first task!'}</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                {editingTask && editingTask.id === task.id ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      value={editingTask.title}
                      onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                      className="form-input"
                    />
                    <textarea
                      value={editingTask.description}
                      onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                      className="form-textarea"
                      rows="2"
                    />
                    <div className="edit-actions">
                      <button onClick={saveEdit} className="btn-save">
                        <Check size={16} /> Save
                      </button>
                      <button onClick={cancelEdit} className="btn-cancel">
                        <X size={16} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="task-content">
                    <button onClick={() => toggleComplete(task.id)} className="checkbox">
                      {task.completed && <Check size={16} className="check-icon" />}
                    </button>
                    
                    <div className="task-info">
                      <div className="task-header">
                        <h3 className="task-title">{task.title}</h3>
                        <span className={`badge ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className={`badge ${getCategoryColor(task.category)}`}>
                          {task.category}
                        </span>
                      </div>
                      {task.description && (
                        <p className="task-description">{task.description}</p>
                      )}
                      {task.dueDate && (
                        <div className="task-date">
                          <Calendar size={14} />
                          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="task-actions">
                      <button onClick={() => startEdit(task)} className="action-btn edit-btn">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => deleteTask(task.id)} className="action-btn delete-btn">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;