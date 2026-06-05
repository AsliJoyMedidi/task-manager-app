import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {

  const [tasks, setTasks] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  // GET TASKS
  const fetchTasks = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await API.get("/tasks", {
        headers: {
          authorization: token,
        },
      });

      setTasks(response.data);

    } catch (error) {

      console.log(error);

    }
  };

  // CREATE TASK
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      await API.post(
        "/tasks",
        formData,
        {
          headers: {
            authorization: token,
          },
        }
      );

      setFormData({
        title: "",
        description: "",
      });

      fetchTasks();

    } catch (error) {

      console.log(error);

    }
  };

  // DELETE TASK
  const deleteTask = async (id) => {

    try {

      const token = localStorage.getItem("token");

      await API.delete(`/tasks/${id}`, {
        headers: {
          authorization: token,
        },
      });

      fetchTasks();

    } catch (error) {

      console.log(error);

    }
  };

  // EDIT TASK
  const editTask = async (task) => {

    const newTitle = prompt("Enter new title", task.title);
    const newDescription = prompt("Enter new description", task.description);

    if (!newTitle || !newDescription) return;

    try {

      const token = localStorage.getItem("token");

      await API.put(
        `/tasks/${task._id}`,
        {
          title: newTitle,
          description: newDescription,
        },
        {
          headers: {
            authorization: token,
          },
        }
      );

      fetchTasks();

    } catch (error) {

      console.log(error);

    }
  };

  // TOGGLE COMPLETE
  const toggleComplete = async (task) => {

    try {

      const token = localStorage.getItem("token");

      await API.put(
        `/tasks/${task._id}`,
        {
          completed: !task.completed,
        },
        {
          headers: {
            authorization: token,
          },
        }
      );

      fetchTasks();

    } catch (error) {

      console.log(error);

    }
  };

  // LOGOUT
  const logout = () => {

    localStorage.removeItem("token");
    window.location.href = "/";

  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <h1 className="text-4xl font-bold text-blue-600">
            Task Dashboard
          </h1>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow mb-6"
        >

          <input
            type="text"
            placeholder="Task Title"
            value={formData.title}
            className="w-full border p-3 rounded mb-4"
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Task Description"
            value={formData.description}
            className="w-full border p-3 rounded mb-4"
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded w-full"
          >
            Add Task
          </button>

        </form>

        {/* TASK LIST */}
        <div className="space-y-4">

          {tasks.map((task) => (

            <div
              key={task._id}
              className="bg-white p-5 rounded shadow flex justify-between items-center"
            >

              {/* LEFT SIDE */}
              <div>

                <h3 className={`text-xl font-semibold ${task.completed ? "line-through text-gray-400" : ""}`}>
                  {task.title}
                </h3>

                <p className="text-gray-600">
                  {task.description}
                </p>

              </div>

              {/* RIGHT SIDE */}
              <div className="flex gap-2 items-center">

                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task)}
                />

                <button
                  onClick={() => editTask(task)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteTask(task._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;