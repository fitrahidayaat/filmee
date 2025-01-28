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
    if (await this.authClient.isAuthenticated()) {
      this.principal = this.authClient.getIdentity().getPrincipal();
      this.isAuthenticated = true;
    }
  }

  // Login using Internet Identity
  async register(username) {
    if (!this.authClient) return;
    await this.authClient.login({
      identityProvider: process.env.DFX_NETWORK === "local" ? "https://identity.ic0.app" : "http://localhost:8000?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai",
      onSuccess: async () => {
        this.principal = this.authClient.getIdentity().getPrincipal();
        this.isAuthenticated = true;

        await filmee_backend.authenticateUser(username, this.principal.toText());
        window.location.href = '/';
      },
    });
  }

  async login() {
    if (!this.authClient) return;
    await this.authClient.login({
      identityProvider: process.env.DFX_NETWORK === "local" ? "https://identity.ic0.app" : "http://localhost:8000?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai",
      onSuccess: async () => {
        this.principal = this.authClient.getIdentity().getPrincipal();
        this.isAuthenticated = true;

        window.location.href = '/';
      },
    });
  }

  // Logout
  async logout() {
    if (!this.authClient) return;
    await this.authClient.logout();
    this.principal = null;
    this.isAuthenticated = false;
  }

  // Register a new user
//   async register(username) {
//     if (!this.principal) {
//       throw new Error("Please log in first.");
//     }
//     const result = await Auth.register(username);
//     if ("err" in result) {
//       throw new Error(result.err);
//     }
//   }

//   // Get the current user's info
//   async getCurrentUser() {
//     if (!this.principal) {
//       throw new Error("Please log in first.");
//     }
//     const result = await Auth.getCurrentUser();
//     if ("err" in result) {
//       throw new Error(result.err);
//     }
//     return result.ok;
//   }
}