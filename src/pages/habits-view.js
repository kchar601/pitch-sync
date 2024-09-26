import { LitElement, html, css } from "lit-element";

class HabitsView extends LitElement {
  static get styles() {
    return css``;
  }

  constructor() {
    super();
    this.habits = [];
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

    // Fetch the habits data
    fetch("http://localhost:5000/habits", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        this.habits = data;
        this.requestUpdate(); // Ensure the component re-renders with the updated data
      })
      .catch((error) => console.error("Error fetching habits:", error));
  }

  render() {
    return html`
      <h1>Habits</h1>
      <ul>
        ${this.habits.length > 0
          ? this.habits.map((habit) => html`<li>${habit.title}</li>`)
          : "Loading habits..."}
      </ul>
    `;
  }
}

customElements.define("habits-view", HabitsView);

export default HabitsView;
