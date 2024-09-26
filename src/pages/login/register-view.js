import { LitElement, html, css } from "lit";

export class RegisterView extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }
    `,
  ];

  render() {
    return html`
      <h1>Register</h1>
      <p>This is the register page.</p>
      <form>
        <input type="text" placeholder="First Name" name="firstName" />
        <input type="text" placeholder="Last Name" name="lastName" />
        <input type="text" placeholder="Email" name="email" />
        <input type="password" placeholder="Password" name="password" />
        <register-button formAttached></register-button>
      </form>
    `;
  }
}
customElements.define("register-view", RegisterView);
