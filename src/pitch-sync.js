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

  sendFetch() {
    // works!
    fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "user@example.com",
        password: "password123",
        firstName: "John",
        lastName: "Doe",
        role: "player", // or 'coach'
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Registration successful:", data);
        // Handle the JWT token here, e.g., store it in localStorage
        localStorage.setItem("token", data.token);
      })
      .catch((error) => console.error("Fetch error:", error.message));

    localStorage.setItem("token", data.token);
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
      <button @click="${this.sendFetch}">Click me</button>
    `;
  }
}

customElements.define("pitch-sync", PitchSync);
