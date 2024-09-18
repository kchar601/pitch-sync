import { LitElement, html, css } from "lit";

export class BlogsView extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }
    `,
  ];

  render() {
    return html` <h1>Blogs</h1>
      <p>This is the blogs page.</p>`;
  }
}
customElements.define("blogs-view", BlogsView);
