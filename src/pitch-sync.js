import { LitElement, html, css } from "lit";
import { Router } from "@vaadin/router";
import "./pages/home-view.js";
import "./pages/dashboard-view.js";
import { routes as loginRoutes } from "./pages/login/index.js";
import "./components/logout-button.js";
import "./components/login-button.js";
import "./components/register-button.js";
import "./pages/teams-view.js";

class PitchSync extends LitElement {
  static properties = {};

  static styles = css``;

  constructor() {
    super();
  }

  isAuthenticated(context, commands) {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      // Redirect to login page if no token is found
      return commands.redirect("/login");
    }

    // Proceed to the requested route
    return undefined;
  }

  firstUpdated() {
    super.firstUpdated();
    const router = new Router(this.shadowRoot.querySelector("#outlet"));
    router.setRoutes([
      { path: "/", component: "home-view" },
      {
        path: "/dashboard",
        component: "dashboard-view",
        action: this.isAuthenticated,
      },
      { path: "/teams", component: "teams-view", action: this.isAuthenticated },
      {
        path: "/login",
        children: () =>
          import("./pages/login/index.js").then((module) => module.routes),
      },
      { path: "(.*)", redirect: "/" },
    ]);
  }

  render() {
    return html`
      <nav>
        <a href="/">Home</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/teams">Teams</a>
        <logout-button></logout-button>
        <login-button></login-button>
        <register-button></register-button>
      </nav>
      <main>
        <div id="outlet"></div>
      </main>
    `;
  }
}

customElements.define("pitch-sync", PitchSync);
