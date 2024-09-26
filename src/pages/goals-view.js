import { LitElement, html, css } from "lit-element";

class GoalsView extends LitElement {
  static get styles() {
    return css``;
  }

  constructor() {
    super();
    this.goals = [];
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

    // Fetch the goals data
    fetch("http://localhost:5000/goals", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        this.goals = data;
        this.requestUpdate(); // Ensure the component re-renders with the updated data
      })
      .catch((error) => console.error("Error fetching goals:", error));
  }

  render() {
    return html`
      <h1>Goals</h1>
      <ul>
        ${this.goals.length > 0
          ? this.goals.map((goal) => html`<li>${goal.title}</li>`)
          : "Loading goals..."}
      </ul>
    `;
  }
}

customElements.define("goals-view", GoalsView);

export default GoalsView;
