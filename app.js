// Import Amplify as the default export and Auth as a named export from AWS Amplify.
import Amplify, { Auth } from 'https://cdn.skypack.dev/aws-amplify@4.3.27';

// Log to verify that Amplify is imported correctly.
console.log("Amplify type:", typeof Amplify);  // Expected output: "object"

// ============================
// AWS Amplify & Cognito Setup
// ============================
// Ensure your configuration values exactly match your AWS Cognito setup. 
// The region must be the region code, and for the oauth domain, omit the "https://" prefix.
Amplify.configure({
  Auth: {
    // REQUIRED - Amazon Cognito Region
    region: 'eu-north-1',
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'eu-north-1_uAvvQdahl',
    // OPTIONAL - Amazon Cognito Web Client ID
    userPoolWebClientId: 'eu-north-1:f016bbcd-268f-47cd-ab77-606be7fe40eb',
    // OPTIONAL - Enforce user authentication prior to accessing AWS resources
    mandatorySignIn: false,
    // OPTIONAL - Hosted UI configuration for federated sign-in (Google)
    oauth: {
      // Use the domain without "https://"
      domain: 'eu-north-1uavvqdahl.auth.eu-north-1.amazoncognito.com',
      scope: ['email', 'profile', 'openid'],
      // Updated redirect URLs to match your Amplify Console domain
      redirectSignIn: 'https://main.d6079kprpbdct.amplifyapp.com/',
      redirectSignOut: 'https://main.d6079kprpbdct.amplifyapp.com/',
      responseType: 'code'
    }
  }
});

// ============================
// UI Elements and Event Handlers
// ============================
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const calendarDiv = document.getElementById('calendar');

// Login button triggers the Hosted UI for Google Sign-In.
loginBtn.addEventListener('click', () => {
  // Opens the Cognito Hosted UI for Google sign-in.
  Auth.federatedSignIn({ provider: 'Google' });
});

// Logout button calls Amplify's signOut method.
logoutBtn.addEventListener('click', () => {
  Auth.signOut()
    .then(() => window.location.reload())
    .catch(err => console.error("Error signing out:", err));
});

// ============================
// Check Authentication State
// ============================
Auth.currentAuthenticatedUser()
  .then(user => {
    console.log("User is signed in:", user);
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    loadCalendar(); // Load calendar after sign-in
  })
  .catch(() => {
    console.log("No user is signed in.");
    loginBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
  });

// ============================
// Calendar Functions
// ============================

// Load the config file (config.json) containing calendar events.
function loadCalendar() {
  fetch('config.json')
    .then(response => response.json())
    .then(config => renderCalendar(config.events))
    .catch(err => console.error('Error loading config:', err));
}

// Render the calendar by listing events.
function renderCalendar(events) {
  calendarDiv.innerHTML = '';
  if (!events || events.length === 0) {
    calendarDiv.textContent = "No events to display.";
    return;
  }
  events.sort((a, b) => new Date(a.date) - new Date(b.date));
  events.forEach(event => {
    const eventDiv = document.createElement('div');
    eventDiv.className = 'day';
    eventDiv.innerHTML = `<strong>${event.date}</strong><br>
                          <span class="event">${event.type}: ${event.name}</span>`;
    calendarDiv.appendChild(eventDiv);
  });
}
