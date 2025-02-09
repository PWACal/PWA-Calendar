// Use the global aws_amplify as Amplify
const Amplify = window.aws_amplify;

// ============================
// AWS Amplify & Cognito Setup
// ============================
// IMPORTANT: Replace the configuration values below with your actual AWS Cognito details.
// You must have already set up a Cognito User Pool and a Cognito App Client.
// Also, configure your Hosted UI (federated sign-in) to use Google.
// For example, in your Cognito console, under "App integration", set the callback and sign-out URLs
// to the URL of your hosted static website (e.g., the Amplify Console URL).

Amplify.configure({
  Auth: {
    // REQUIRED - Amazon Cognito Region (use just the region code)
    region: 'eu-north-1',
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'eu-north-1_uAvvQdahl',
    // OPTIONAL - Amazon Cognito Web Client ID
    userPoolWebClientId: 'eu-north-1:f016bbcd-268f-47cd-ab77-606be7fe40eb',
    // OPTIONAL - Enforce user authentication prior to accessing AWS resources
    mandatorySignIn: false,
    // OPTIONAL - Hosted UI configuration for federated sign-in (Google)
    oauth: {
      domain: 'https://eu-north-1uavvqdahl.auth.eu-north-1.amazoncognito.com',
      scope: ['email', 'profile', 'openid'],
      // Updated redirect URLs to match your new Amplify Console domain
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
  // This opens the Cognito Hosted UI and lets the user sign in via Google.
  Amplify.Auth.federatedSignIn({ provider: 'Google' });
});

// Logout button calls Amplify's signOut method.
logoutBtn.addEventListener('click', () => {
  Amplify.Auth.signOut()
    .then(() => {
      // Reload the page or update UI as needed.
      window.location.reload();
    })
    .catch(err => console.error("Error signing out:", err));
});
  
// ============================
// Check Authentication State
// ============================
Amplify.Auth.currentAuthenticatedUser()
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
    .then(config => {
      renderCalendar(config.events);
    })
    .catch(err => console.error('Error loading config:', err));
}
  
// Render the calendar by listing events.
function renderCalendar(events) {
  // Clear any previous content.
  calendarDiv.innerHTML = '';

  if (!events || events.length === 0) {
    calendarDiv.textContent = "No events to display.";
    return;
  }

  // Sort events by date.
  events.sort((a, b) => new Date(a.date) - new Date(b.date));

  events.forEach(event => {
    const eventDiv = document.createElement('div');
    eventDiv.className = 'day';
    eventDiv.innerHTML = `<strong>${event.date}</strong><br>
                          <span class="event">${event.type}: ${event.name}</span>`;
    calendarDiv.appendChild(eventDiv);
  });
}
