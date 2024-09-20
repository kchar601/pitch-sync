import { LitElement, html, css } from "lit";

export class RegisterButton extends LitElement {
  static get styles() {
    return css`
      button {
        background-color: #007bff;
        color: white;
        padding: 10px 20px;
        border: none;
        cursor: pointer;
        font-size: 16px;
      }
      button:hover {
        background-color: #0069d9;
      }
    `;
  }

  static get properties() {
    return {
      formAttached: { type: Boolean },
      loggedIn: { type: Boolean },
      email: { type: String },
      password: { type: String },
      firstName: { type: String },
      lastName: { type: String },
      role: { type: String },
    };
  }

  constructor() {
    super();
    this.loggedIn = false;
    this.formAttached = false;
  }

  connectedCallback() {
    super.connectedCallback();
    // Listen for custom login/logout events
    window.addEventListener("token-changed", this.updateLoginState.bind(this));
    this.updateLoginState(); // Check current token on load
  }

  disconnectedCallback() {
    // Remove the listener when the element is removed
    window.removeEventListener(
      "token-changed",
      this.updateLoginState.bind(this)
    );
    super.disconnectedCallback();
  }

  updateLoginState() {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    // Update the loggedIn state based on the presence of tokens
    this.loggedIn = !!accessToken && !!refreshToken;
    this.requestUpdate(); // Request Lit to re-render the component
  }

  async handleRegister() {
    if (!this.formAttached) {
      window.location.href = "/login/register";
      return;
    }
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

  render() {
    // Show the button only if the user is not logged in
    return !this.loggedIn
      ? html`<button @click="${this.handleRegister}">Register</button>`
      : null;
  }
}

customElements.define("register-button", RegisterButton);
