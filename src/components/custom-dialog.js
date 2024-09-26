import { LitElement, html, css } from "lit";

class CustomDialog extends LitElement {
  static get styles() {
    return css`
      :host {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        justify-content: center;
        align-items: center;
        z-index: 100;
      }

      .dialog-content {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
        position: relative;
      }

      .close-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
      }

      :host([open]) {
        display: flex;
      }
    `;
  }

  static get properties() {
    return {
      open: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.open = false;
    this._boundHandleOutsideClick = this.handleOutsideClick.bind(this);
  }

  show() {
    this.open = true;
    console.log("Dialog opened");

    // Delay the event listener addition to avoid immediate close from the opening click
    setTimeout(() => {
      console.log("Adding event listener for outside click");
      document.addEventListener("click", this._boundHandleOutsideClick);
    }, 100);
  }

  close() {
    this.open = false;
    console.log("Dialog closed");

    // Remove the event listener when the dialog is closed
    document.removeEventListener("click", this._boundHandleOutsideClick);
  }

  handleOutsideClick(event) {
    const dialogContent = this.shadowRoot.querySelector(".dialog-content");
    const path = event.composedPath(); // Get the full event path including shadow DOM

    console.log("Click detected:", event.target);
    console.log("Event path:", path);

    // Check if the dialogContent is in the event path
    if (!path.includes(dialogContent)) {
      console.log("Click was outside dialog content, closing the dialog");
      this.close();
    } else {
      console.log("Click was inside dialog content, keeping the dialog open");
    }
  }

  render() {
    return html`
      <div class="dialog-content">
        <span class="close-btn" @click="${this.close}">✖</span>
        <slot></slot>
      </div>
    `;
  }
}

customElements.define("custom-dialog", CustomDialog);

export default CustomDialog;
