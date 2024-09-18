import { LitElement, html, css } from "lit";

export class SignInView extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }
    `,
  ];

  render() {
    return html` <h1>Sign In</h1>
      <p>This is the sign in page.</p>`;
  }
}
customElements.define("sign-in-view", SignInView);
