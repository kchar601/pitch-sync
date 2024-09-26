import { LitElement, html, css } from "lit-element";
import "./login-button.js";
import "./register-button.js";
import "./logout-button.js";

class AuthCheckNav extends LitElement {
  static get styles() {
    return css``;
  }

  static get properties() {
    return {};
  }

  render() {
    return html`
      <nav>
        <ul>
          ${localStorage.getItem("accessToken")
            ? html`
                <li><a href="/dashboard">Dashboard</a></li>
                <li><a href="/habits">Habits</a></li>
                <li><a href="/goals">Goals</a></li>
                <li><a href="/tasks">Tasks</a></li>
                <li><logout-button /></li>
              `
            : html`
                <li><a href="/">Home</a></li>
                <li><login-button /></li>
                <li><register-button /></li>
              `}
        </ul>
      </nav>
    `;
  }
}
customElements.define("auth-check-nav", AuthCheckNav);
