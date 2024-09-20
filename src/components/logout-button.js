import { LitElement, html, css } from "lit";

export class LogoutButton extends LitElement {
  static get styles() {
    return css`
      button {
        background-color: #4caf50;
        color: white;
        padding: 10px 20px;
        border: none;
        cursor: pointer;
        font-size: 16px;
      }
      button:hover {
        background-color: #45a049;
      }
    `;
  }

  static get properties() {
    return {
      loggedIn: { type: Boolean },
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

  handleLogout() {
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

      // Dispatch custom event to notify of token change
      window.dispatchEvent(new CustomEvent("token-changed"));

      window.location.href = "/"; // Redirect to sign-in page
    });
  }

  render() {
    // Show the button only if the user is logged in
    return this.loggedIn
      ? html`<button @click="${this.handleLogout}">Logout</button>`
      : null;
  }
}

customElements.define("logout-button", LogoutButton);
