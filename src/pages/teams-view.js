import { LitElement, html, css } from "lit-element";

export class TeamsView extends LitElement {
  static get styles() {
    return css``;
  }

  constructor() {
    super();
    this.teams = [];
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

    // Fetch the teams data
    fetch("http://localhost:5000/team/teams", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        this.teams = data;
        this.requestUpdate(); // Ensure the component re-renders with the updated data
      })
      .catch((error) => console.error("Error fetching teams:", error));
  }

  changeTeam(teamId) {
    console.log("Team changed to:", teamId);
    window.dispatchEvent(
      new CustomEvent("team-changed", { detail: { teamId: teamId } })
    );
  }

  render() {
    return html`
      <h1>Teams</h1>
      <div>
        ${this.teams.length > 0
          ? this.teams.map(
              (team) =>
                html`<button @click="${() => this.changeTeam(team._id)}">
                  ${team.teamName}
                </button>`
            )
          : "Loading teams..."}
      </div>
    `;
  }
}

customElements.define("teams-view", TeamsView);
