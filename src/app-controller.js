import { LitElement, html, css } from "lit";
import { Router } from "@vaadin/router";
// app-controller.js
import {
  HomeView,
  DashboardView,
  loginRoutes,
  HabitsView,
  GoalsView,
  TasksView,
  StreakView,
} from "./pages/index.js";

class AppController extends LitElement {
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
      {
        path: "/",
        action: (context, commands) => {
          const accessToken = localStorage.getItem("accessToken");

          // If the user is logged in, redirect to dashboard
          if (accessToken) {
            return commands.redirect("/dashboard");
          }

          // Allow access to the home view (marketing page) if not authenticated
          return commands.component("home-view");
        },
      },
      {
        path: "/dashboard",
        component: "dashboard-view",
        action: this.isAuthenticated,
      },
      {
        path: "/habits",
        component: "habits-view",
        action: this.isAuthenticated,
      },
      {
        path: "/goals",
        component: "goals-view",
        action: this.isAuthenticated,
      },
      {
        path: "/tasks",
        component: "tasks-view",
        action: this.isAuthenticated,
      },
      {
        path: "/streak",
        component: "streak-view",
        action: this.isAuthenticated,
      },
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
      <auth-check-nav></auth-check-nav>
      <main id="outlet"></main>
    `;
  }
}

customElements.define("app-controller", AppController);
