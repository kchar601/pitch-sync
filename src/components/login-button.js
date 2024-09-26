import { LitElement, html, css } from "lit";

export class LoginButton extends LitElement {
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
      loggedIn: { type: Boolean },
      formAttached: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.loggedIn = false;
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

  async handleLogin() {
    if (!this.formAttached) {
      window.location.href = "/login";
      return;
    }

    this.email = this.parentNode.querySelector("input[name=email]").value;
    this.password = this.parentNode.querySelector("input[name=password]").value;

    console.log("Logging in with:", this.email, this.password);

    await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: this.email,
        password: this.password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(async (data) => {
        console.log("Login successful:", data);

        // Store JWT tokens in localStorage
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        // Dispatch a custom event to notify that the tokens have been updated
        await window.dispatchEvent(new CustomEvent("token-changed"));
        window.location.href = "/teams";
      })
      .catch((error) => console.error("Fetch error:", error.message));
  }

  render() {
    // Show the button only if the user is not logged in
    return !this.loggedIn
      ? html`<button @click="${this.handleLogin}">Login</button>`
      : null;
  }
}

customElements.define("login-button", LoginButton);
