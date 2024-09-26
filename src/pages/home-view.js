import { LitElement, html, css } from "lit";
import "../components/auth-check-nav.js";

class HomeView extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }
    `,
  ];

  render() {
    return html` <h1>Home</h1>
      <p>This is the home page.</p>`;
  }
}
customElements.define("home-view", HomeView);

export default HomeView;
