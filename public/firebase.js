import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

let auth; // Declare auth globally

async function loadFirebaseConfig() {
    try {
        const response = await fetch("config.json");
        const firebaseConfig = await response.json();

        const app = initializeApp(firebaseConfig);
        auth = getAuth(app);

        console.log("Firebase initialized successfully");
    } catch (error) {
        console.error("Error loading Firebase config:", error);
    }
}

// Load Firebase configuration
await loadFirebaseConfig();

export { auth };
