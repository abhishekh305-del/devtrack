import { useEffect, useState } from "react";
import "./App.css";

const defaultTasks = [
  {
    id: 1,
    title: "Design the dashboard",
    status: "In Progress",
  },
  {
    id: 2,
    title: "Build the task API",
    status: "To Do",
  },
  {
    id: 3,
    title: "Set up the project",
    status: "Done",
  },
];

function App() {
  // Load saved tasks when the application starts
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem("devtrack-tasks");

      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);

        if (Array.isArray(parsedTasks)) {
          return parsedTasks;
        }
      }
    } catch (error) {
      console.error("Could not load saved tasks:", error);
    }

    return defaultTasks;
  });

  const [newTask, setNewTask] = useState("");

  // Save tasks whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("devtrack-tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Could not save tasks:", error);
    }
  }, [tasks]);

  const completed = tasks.filter(
    (task) => task.status === "Done"
  ).length;

  const remaining = tasks.length - completed;

  const progress =
    tasks.length > 0
      ? Math.round((completed / tasks.length) * 100)
      : 0;

  function addTask(event) {
    event.preventDefault();

    const trimmedTask = newTask.trim();

    if (!trimmedTask) {
      return;
    }

    const task = {
      id: Date.now(),
      title: trimmedTask,
      status: "To Do",
    };

    setTasks((currentTasks) => [...currentTasks, task]);
    setNewTask("");
  }

  function changeStatus(id) {
    const nextStatus = {
      "To Do": "In Progress",
      "In Progress": "Done",
      Done: "To Do",
    };

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: nextStatus[task.status],
            }
          : task
      )
    );
  }

  function deleteTask(id) {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    );
  }

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div>
          <h2 className="logo">◆ DevTrack</h2>

          <nav>
            <p className="nav-item active">▦ &nbsp; Overview</p>
            <p className="nav-item">☷ &nbsp; My Tasks</p>
            <p className="nav-item">▣ &nbsp; Projects</p>
            <p className="nav-item">⚙ &nbsp; Settings</p>
          </nav>
        </div>

        <div className="user">
          <div className="avatar">A</div>
          <div>
            <strong>Abhishek</strong>
            <small>Developer</small>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="main">
        <header className="topbar">
          <span>Workspace / Overview</span>
          <span className="status-text">● Personal workspace</span>
        </header>

        {/* Welcome section */}
        <section className="welcome">
          <small>YOUR WORKSPACE</small>

          <h1>Good day, Abhishek 👋</h1>

          <p>
            Here's what's happening with your work today.
          </p>
        </section>

        {/* Statistics */}
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
            <h2>{remaining}</h2>
          </div>

          <div className="card">
            <span>Progress</span>
            <h2>{progress}%</h2>

            <div className="progress-track">
              <div
                className="progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </section>

        {/* Task section */}
        <section className="task-panel">
          <div className="task-heading">
            <h2>My tasks</h2>

            <p>Manage and track your work</p>
          </div>

          {/* Add task form */}
          <form onSubmit={addTask} className="task-form">
            <input
              type="text"
              value={newTask}
              onChange={(event) =>
                setNewTask(event.target.value)
              }
              placeholder="Enter a new task..."
              aria-label="Enter a new task"
            />

            <button type="submit">+ Add task</button>
          </form>

          {/* Task list */}
          <div className="task-list">
            {tasks.length === 0 ? (
              <div className="empty-state">
                <h3>No tasks yet</h3>
                <p>
                  Add your first task using the box above.
                </p>
              </div>
            ) : (
              tasks.map((task) => (
                <div className="task" key={task.id}>
                  <div className="task-title">
                    <strong>{task.title}</strong>

                    <small>{task.status}</small>
                  </div>

                  <button
                    type="button"
                    className={`status-button ${task.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                    onClick={() => changeStatus(task.id)}
                  >
                    Change status
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => deleteTask(task.id)}
                    aria-label={`Delete ${task.title}`}
                    title="Delete task"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="task-tip">
            <span>
              💡 Click “Change status” to move a task through
              To Do → In Progress → Done.
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;