Amplify.configure({
  Auth: {
    // REQUIRED - Amazon Cognito Region
    region: 'eu-north-1', // update with your region
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'eu-north-1_uAvvQdahl', // e.g., us-east-1_ABCdEfGhI
    // OPTIONAL - Amazon Cognito Web Client ID
    userPoolWebClientId: 'eu-north-1:f016bbcd-268f-47cd-ab77-606be7fe40eb', // e.g., 12345abcde12345abcde12345
    // OPTIONAL - Enforce user authentication prior to accessing AWS resources
    mandatorySignIn: false,
    // OPTIONAL - Hosted UI configuration for federated sign-in (Google)
    oauth: {
      domain: 'https://eu-north-1uavvqdahl.auth.eu-north-1.amazoncognito.com', // update with your Cognito domain
      scope: ['email', 'profile', 'openid'],
      redirectSignIn: 'https://d3je0qld5wq8fh.cloudfront.net/', // update with your app's URL
      redirectSignOut: 'https://d3je0qld5wq8fh.cloudfront.net/', // update with your app's URL
      responseType: 'code' // Use "code" for Authorization Code Grant (more secure)
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
  Auth.federatedSignIn({ provider: 'Google' });
});

// Logout button calls Amplify's signOut method.
logoutBtn.addEventListener('click', () => {
  Auth.signOut()
    .then(() => {
      // Reload the page or update UI as needed.
      window.location.reload();
    })
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
