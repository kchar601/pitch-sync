import { LitElement, html, css } from "lit";
import "../components/custom-dialog.js";

class TasksView extends LitElement {
  static get styles() {
    return css`
      #addTaskForm {
        display: flex;
        flex-direction: column;
        width: 300px;
      }
      #addTaskForm > * {
        margin-bottom: 10px;
      }
    `;
  }

  constructor() {
    super();
    this.tasks = [];
  }

  static get properties() {
    return {};
  }

  firstUpdated() {
    super.firstUpdated();
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      window.location.href = "/login";
    }

    // Fetch the tasks data
    fetch("http://localhost:5000/tasks", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        this.tasks = data;
        this.requestUpdate(); // Ensure the component re-renders with the updated data
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }

  handleAddTask() {
    this.shadowRoot.querySelector("custom-dialog").show();
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log("Submitting form...");
    const form = event.target;
    const formData = new FormData(form);
    const title = formData.get("title");
    const description = formData.get("description");
    const dueDate = formData.get("dueDate");
    const priority = formData.get("priority");
    const status = formData.get("status");

    const accessToken = localStorage.getItem("accessToken");
    fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ title, description, dueDate, priority, status }),
    })
      .then((res) => {
        if (res.status === 201) {
          console.log("Task created successfully.");
          this.shadowRoot.querySelector("custom-dialog").close();
          this.tasks.push({ title, description, dueDate, priority, status });
          this.requestUpdate(); // Ensure the component re-renders with the updated data
        } else {
          console.error("Error creating task:", res.statusText);
        }
      })
      .catch((error) => console.error("Error creating task:", error));
  }

  handleEditTask(task) {
    const dialog = this.shadowRoot.querySelector("custom-dialog");
    dialog.querySelector("h2").textContent = "Edit Task";
    dialog.querySelector("input[name=taskId]").value = task.id;
    dialog.querySelector("input[name=title]").value = task.title;
    dialog.querySelector("input[name=description]").value = task.description;
    dialog.querySelector("input[name=dueDate]").value = task.dueDate;
    dialog.querySelector("select[name=priority]").value = task.priority;
    dialog.querySelector("select[name=status]").value = task.status;
    dialog.show();
  }

  render() {
    return html`
      <h1>Tasks</h1>
      <ul>
        ${this.tasks.length > 0
          ? this.tasks.map(
              (task) =>
                html`<li>
                  <div>
                    <input
                      type="checkbox"
                      id="${task.id}"
                      name="${task.title}"
                      .checked="${task.status === "completed"}"
                    />
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                    <p>Due Date: ${task.dueDate}</p>
                    <p>Priority: ${task.priority}</p>
                    <p>Status: ${task.status}</p>
                    <button @click="${() => this.handleEditTask(task)}">
                      Edit
                    </button>
                    <button>Delete</button>
                  </div>
                </li>`
            )
          : "Loading tasks..."}
      </ul>
      <button id="addTaskBtn" @click="${this.handleAddTask}">Add Task</button>

      <custom-dialog>
        <form id="addTaskForm" @submit="${this.handleSubmit}">
          <h2>Add Task</h2>
          <input type="hidden" name="taskId" value="" />
          <label for="title">Title:</label>
          <input type="text" name="title" required />
          <label name="description">Description:</label>
          <input type="text" name="description" required />
          <label name="dueDate">Due Date:</label>
          <input type="date" name="dueDate" required />
          <label name="priority">Priority:</label>
          <select name="priority">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <label name="status">Status:</label>
          <select name="status">
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button type="submit">Add Task</button>
        </form>
      </custom-dialog>
    `;
  }
}

customElements.define("tasks-view", TasksView);

export default TasksView;
