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
    return html` <h1>Register</h1>
      <p>This is the register page.</p>`;
  }
}
customElements.define("register-view", RegisterView);
