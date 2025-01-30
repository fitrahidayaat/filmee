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
      localStorage.setItem("isAuthenticated", "true"); // Simpan status login
    } else {
      localStorage.removeItem("isAuthenticated");
    }
  }

  // Login using Internet Identity
<<<<<<< HEAD
<<<<<<< HEAD
  async login() {
=======
  async register(username) {
>>>>>>> 14a3929a952e8bbfd175cc6d3d95bac0870ca9b1
=======
  async register(username) {
=======
  async login() {
>>>>>>> adff03b (feat: added design ui)
>>>>>>> 46dd3dd (fix: package.json typo)
    if (!this.authClient) return;
    await this.authClient.login({
      identityProvider:
        process.env.DFX_NETWORK === "local"
          ? "https://identity.ic0.app"
          : "http://localhost:8000?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai",
      onSuccess: async () => {
        this.principal = this.authClient.getIdentity().getPrincipal();
        this.isAuthenticated = true;
        localStorage.setItem("isAuthenticated", "true"); // Simpan status login
        window.location.href = "/";
      },
    });
  }

<<<<<<< HEAD
<<<<<<< HEAD
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
        localStorage.setItem("isAuthenticated", "true"); // Simpan status login

        // Register the username with the backend
        try {
          await filmee_backend.authenticateUser(username, this.principal.toText());
          window.location.href = "/login"; // Setelah registrasi, redirect ke login
        } catch (error) {
          console.error("Error during registration:", error);
          alert("Registration failed.");
        }
=======
=======
>>>>>>> 46dd3dd (fix: package.json typo)
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
<<<<<<< HEAD
>>>>>>> 14a3929a952e8bbfd175cc6d3d95bac0870ca9b1
=======
=======
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
        localStorage.setItem("isAuthenticated", "true"); // Simpan status login

        // Register the username with the backend
        try {
          await filmee_backend.authenticateUser(username, this.principal.toText());
          window.location.href = "/login"; // Setelah registrasi, redirect ke login
        } catch (error) {
          console.error("Error during registration:", error);
          alert("Registration failed.");
        }
>>>>>>> adff03b (feat: added design ui)
>>>>>>> 46dd3dd (fix: package.json typo)
      },
    });
  }

  // Logout
  async logout() {
    if (!this.authClient) return;
    await this.authClient.logout();
    this.principal = null;
    this.isAuthenticated = false;
    localStorage.removeItem("isAuthenticated"); // Hapus status login
    window.location.href = "/login"; // Redirect ke login
  }
}
