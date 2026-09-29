
import { useState } from "react";
import "./App.css";

export default function App() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Design the dashboard", status: "In Progress" },
    { id: 2, title: "Build the task API", status: "To Do" },
    { id: 3, title: "Set up the project", status: "Done" },
  ]);

  const [newTask, setNewTask] = useState("");

  const completed = tasks.filter(t => t.status === "Done").length;

  function addTask(e) {
    e.preventDefault();
    if (!newTask.trim()) return;

    setTasks([...tasks, {
      id: Date.now(),
      title: newTask.trim(),
      status: "To Do"
    }]);
    setNewTask("");
  }

  function changeStatus(id) {
    const next = {
      "To Do": "In Progress",
      "In Progress": "Done",
      "Done": "To Do"
    };

    setTasks(tasks.map(t =>
      t.id === id ? { ...t, status: next[t.status] } : t
    ));
  }

  function deleteTask(id) {
    setTasks(tasks.filter(t => t.id !== id));
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>◆ DevTrack</h2>
        <p className="active">▦ &nbsp; Overview</p>
        <p>☷ &nbsp; My Tasks</p>
        <p>▣ &nbsp; Projects</p>
        <p>⚙ &nbsp; Settings</p>
        <div className="user">A &nbsp; Abhishek</div>
      </aside>

      <main className="main">
        <header>Workspace / Overview</header>

        <section className="welcome">
          <small>YOUR WORKSPACE</small>
          <h1>Good day, Abhishek 👋</h1>
          <p>Here's what's happening with your work today.</p>
        </section>

        <section className="stats">
          <div className="card">
            <span>Total tasks</span>
            <h2>{tasks.length}</h2>
          </div>
          <div className="card">
            <span>Completed</span>
            <h2>{completed}</h2>
          </div>
          <div className="card">
            <span>Remaining</span>
            <h2>{tasks.length - completed}</h2>
          </div>
          <div className="card">
            <span>Progress</span>
            <h2>
              {tasks.length
                ? Math.round(completed / tasks.length * 100)
                : 0}%
            </h2>
          </div>
        </section>

        <section className="task-panel">
          <div className="task-heading">
            <h2>My tasks</h2>
            <p>Manage and track your work</p>
          </div>

          <form onSubmit={addTask}>
            <input
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              placeholder="Enter a new task..."
              aria-label="New task"
            />
            <button type="submit">+ Add task</button>
          </form>

          {tasks.map(task => (
            <div className="task" key={task.id}>
              <div className="task-title">
                <strong>{task.title}</strong>
                <small>{task.status}</small>
              </div>
              <button
                className="status"
                onClick={() => changeStatus(task.id)}
              >
                Change status
              </button>
              <button
                className="delete"
                onClick={() => deleteTask(task.id)}
                aria-label={`Delete ${task.title}`}
              >
                ×
              </button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
