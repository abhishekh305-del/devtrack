import { useEffect, useState } from "react";
import "./App.css";

const API_URL =
  "https://bookish-goggles-r4j4gv6r54jp3xqgj-8080.app.github.dev/api/tasks";

const defaultTasks = [
  { id: 1, title: "Design the dashboard", status: "In Progress" },
  { id: 2, title: "Build the task API", status: "To Do" },
  { id: 3, title: "Set up the project", status: "Done" },
];

function App() {
  const [tasks, setTasks] = useState(defaultTasks);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load tasks");
        }
        return response.json();
      })
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const completed = tasks.filter((task) => task.status === "Done").length;
  const remaining = tasks.length - completed;
  const progress =
    tasks.length > 0
      ? Math.round((completed / tasks.length) * 100)
      : 0;

  async function addTask(event) {
    event.preventDefault();

    const title = newTask.trim();

    if (!title) return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          status: "To Do",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      const createdTask = await response.json();

      setTasks((currentTasks) => [
        ...currentTasks,
        createdTask,
      ]);

      setNewTask("");
    } catch (error) {
      console.error(error);
      alert("Could not add task");
    }
  }

  async function changeStatus(task) {
    const nextStatus = {
      "To Do": "In Progress",
      "In Progress": "Done",
      Done: "To Do",
    };

    try {
      const response = await fetch(
        `${API_URL}/${task.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: task.title,
            status: nextStatus[task.status],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const updatedTask = await response.json();

      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item.id === updatedTask.id
            ? updatedTask
            : item
        )
      );
    } catch (error) {
      console.error(error);
      alert("Could not update task");
    }
  }

  async function deleteTask(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Could not delete task");
    }
  }

  return (
    <div className="app">
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

      <main className="main">
        <header className="topbar">
          <span>Workspace / Overview</span>
          <span className="status-text">
            ● Backend connected
          </span>
        </header>

        <section className="welcome">
          <small>YOUR WORKSPACE</small>

          <h1>Good day, Abhishek 👋</h1>

          <p>
            Here's what's happening with your work today.
          </p>
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

        <section className="task-panel">
          <div className="task-heading">
            <h2>My tasks</h2>
            <p>Manage and track your work</p>
          </div>

          <form onSubmit={addTask} className="task-form">
            <input
              type="text"
              value={newTask}
              onChange={(event) =>
                setNewTask(event.target.value)
              }
              placeholder="Enter a new task..."
            />

            <button type="submit">
              + Add task
            </button>
          </form>

          {loading ? (
            <p className="empty-state">
              Loading tasks...
            </p>
          ) : tasks.length === 0 ? (
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
                  className="status-button"
                  onClick={() => changeStatus(task)}
                >
                  Change status
                </button>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => deleteTask(task.id)}
                  title="Delete task"
                >
                  ×
                </button>
              </div>
            ))
          )}

          <div className="task-tip">
            💡 Tasks are stored in the Spring Boot database.
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;