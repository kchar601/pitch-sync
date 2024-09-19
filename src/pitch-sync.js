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

  async handleRegister() {
    try {
      const sampleData = {
        email: "sampleuser@example.com",
        password: "password123",
        firstName: "John",
        lastName: "Doe",
        role: "player", // or 'coach'
      };
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sampleData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Registration failed: ${data.message}`);
        return;
      }

      alert(data.message); // "Registration successful. Please log in."
      window.location.href = "/login"; // Redirect to the login page
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An unexpected error occurred.");
    }
  }

  login() {
    fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "sampleuser@example.com",
        password: "password123",
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Login successful:", data);
        // Handle the JWT token here, e.g., store it in localStorage
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
      })
      .catch((error) => console.error("Fetch error:", error.message));
  }

  logout() {
    const refreshToken = localStorage.getItem("refreshToken");

    fetch("http://localhost:5000/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    }).then(() => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      alert("You have been logged out");
      window.location.href = "/login";
    });
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
      <button @click="${this.handleRegister}">Register</button>
      <button @click="${this.login}">Login</button>
      <button @click="${this.logout}">Logout</button>
    `;
  }
}

customElements.define("pitch-sync", PitchSync);
