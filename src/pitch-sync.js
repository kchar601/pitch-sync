import { LitElement, html, css } from "lit";
import { Router } from "@vaadin/router";
import "./pages/home-view.js";
import "./pages/about-view.js";
// import { routes as blogsRoutes } from "./pages/blogs/index.js";

class PitchSync extends LitElement {
  static properties = {};

  static styles = css``;

  constructor() {
    super();
  }

  firstUpdated() {
    super.firstUpdated();
    const router = new Router(this.shadowRoot.querySelector("#outlet"));
    router.setRoutes([
      { path: "/", component: "home-view" },
      { path: "/about", component: "about-view" },
      {
        path: "/blogs",
        children: () =>
          import("./pages/blogs/index.js").then((module) => module.routes),
      },
      { path: "(.*)", redirect: "/" },
    ]);
  }

  render() {
    return html`
      <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/blogs">Blog</a>
      </nav>
      <main>
        <div id="outlet"></div>
      </main>
    `;
  }
}

customElements.define("pitch-sync", PitchSync);
