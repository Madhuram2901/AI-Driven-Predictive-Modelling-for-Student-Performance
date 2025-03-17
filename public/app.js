import { auth } from './firebase.js';
import { signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logout-btn");
    if (logoutButton) {
        logoutButton.addEventListener("click", async () => {
            console.log("Logging out...");
            await logout();
        });
    }
});

window.login = async function (event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorElement = document.getElementById('login-error');

    try {
        console.log("Logging in...");
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Login successful!");
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error("Login error:", error);
        errorElement.textContent = error.message || "Login failed";
        errorElement.style.display = "block";
    }
};

window.signup = async function (event) {
    event.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const errorElement = document.getElementById('signup-error');

    try {
        console.log("Signing up...");
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("Signup successful!");
        alert('Account created! Please log in.');
        showLogin();
    } catch (error) {
        console.error("Signup error:", error);
        errorElement.textContent = error.message || "Signup failed";
        errorElement.style.display = "block";
    }
};

window.showSignup = function () {
    document.getElementById('login-box').classList.add('hidden');
    document.getElementById('signup-box').classList.remove('hidden');
};

window.showLogin = function () {
    document.getElementById('signup-box').classList.add('hidden');
    document.getElementById('login-box').classList.remove('hidden');
};

window.logout = async function () {
    await signOut(auth);
    window.location.href = 'index.html'; // Redirect to login page
};

onAuthStateChanged(auth, (user) => {
    console.log("Auth status:", user);
    if (user) {
        if (window.location.pathname !== "/dashboard.html") {
            window.location.href = "dashboard.html";
        }
    } else {
        if (window.location.pathname === "/dashboard.html") {
            window.location.href = "index.html";
        }
    }
});