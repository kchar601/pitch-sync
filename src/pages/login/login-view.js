import { LitElement, html, css } from "lit";

export class LoginView extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }
    `,
  ];

  render() {
    return html`
      <h1>Login</h1>
      <input type="text" placeholder="Username" name="email" />
      <input type="password" placeholder="Password" name="password" />
      <login-button formAttached></login-button>
    `;
  }
}
customElements.define("login-view", LoginView);
