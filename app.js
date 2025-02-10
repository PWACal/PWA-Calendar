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
    region: 'eu-north-1',
    userPoolId: 'eu-north-1_uAvvQdahl',
    userPoolWebClientId: 'eu-north-1:f016bbcd-268f-47cd-ab77-606be7fe40eb',
    mandatorySignIn: false,
    oauth: {
      domain: 'eu-north-1uavvqdahl.auth.eu-north-1.amazoncognito.com',
      scope: ['email', 'profile', 'openid'],
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

loginBtn.addEventListener('click', () => {
  Amplify.Auth.federatedSignIn({ provider: 'Google' });
});

logoutBtn.addEventListener('click', () => {
  Amplify.Auth.signOut()
    .then(() => window.location.reload())
    .catch(err => console.error("Error signing out:", err));
});
  
Amplify.Auth.currentAuthenticatedUser()
  .then(user => {
    console.log("User is signed in:", user);
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    loadCalendar();
  })
  .catch(() => {
    console.log("No user is signed in.");
    loginBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
  });
  
function loadCalendar() {
  fetch('config.json')
    .then(response => response.json())
    .then(config => renderCalendar(config.events))
    .catch(err => console.error('Error loading config:', err));
}
  
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
