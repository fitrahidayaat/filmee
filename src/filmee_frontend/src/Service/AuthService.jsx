import { AuthClient } from "@dfinity/auth-client";
import { filmee_backend } from "../../../declarations/filmee_backend";

export class AuthService {
  constructor() {
    this.authClient = null;
    this.principal = null;
    this.isAuthenticated = false;
  }

  // Initialize AuthClient
  async init() {
    this.authClient = await AuthClient.create();
    const isAuth = await this.authClient.isAuthenticated();
    
    if (isAuth) {
      this.principal = this.authClient.getIdentity().getPrincipal();
      this.isAuthenticated = true;
      localStorage.setItem("isAuthenticated", "true"); // Save login status
    } else {
      localStorage.removeItem("isAuthenticated");
    }
  }

  // Login using Internet Identity
  async login() {
    if (!this.authClient) return;
    await this.authClient.login({
      identityProvider:
        process.env.DFX_NETWORK === "local"
          ? "https://identity.ic0.app"
          : "http://localhost:8000?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai",
      onSuccess: async () => {
        this.principal = this.authClient.getIdentity().getPrincipal();
        this.isAuthenticated = true;
        localStorage.setItem("isAuthenticated", "true"); // Save login status
        window.location.href = "/"; // Redirect to homepage
      },
    });
  }

  // Register a new user
  async register(username) {
    if (!this.authClient) return;
    await this.authClient.login({
      identityProvider:
        process.env.DFX_NETWORK === "local"
          ? "https://identity.ic0.app"
          : "http://localhost:8000?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai",
      onSuccess: async () => {
        this.principal = this.authClient.getIdentity().getPrincipal();
        this.isAuthenticated = true;
        localStorage.setItem("isAuthenticated", "true"); // Save login status

        // Register the username with the backend
        try {
          await filmee_backend.authenticateUser(username, this.principal.toText());
          window.location.href = "/login"; // After registration, redirect to login
        } catch (error) {
          console.error("Error during registration:", error);
          alert("Registration failed.");
        }

        window.location.href = '/'; // Redirect after successful registration
      },
    });
  }

  // Logout
  async logout() {
    if (!this.authClient) return;
    await this.authClient.logout();
    this.principal = null;
    this.isAuthenticated = false;
    localStorage.removeItem("isAuthenticated"); // Remove login status
    window.location.href = "/login"; // Redirect to login page
  }
}
