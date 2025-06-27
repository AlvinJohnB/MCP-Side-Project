
// Show a section and hide others
function showSection(id) {
  document.querySelectorAll('section').forEach(s => s.classList.remove('visible'));
  document.getElementById(id).classList.add('visible');
}
// booking offers

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector('#overnight form');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const destination = document.getElementById('destination').value;
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const guests = document.getElementById('guests').value;

    console.log("Search details:", destination, checkin, checkout, guests);
  });
});
// Update navbar based on user login state
function updateNavbar() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const welcome = document.getElementById('welcomeUser');
  const logoutBtn = document.getElementById('logoutBtn');
  const registerBtn = document.getElementById('registerNav');
  const loginBtn = document.getElementById('loginNav');

  if (currentUser) {
    welcome.textContent = `Welcome, ${currentUser.name}`;
    logoutBtn.classList.remove('d-none');
    registerBtn.classList.add('d-none');
    loginBtn.classList.add('d-none');
  } else {
    welcome.textContent = '';
    logoutBtn.classList.add('d-none');
    registerBtn.classList.remove('d-none');
    loginBtn.classList.remove('d-none');
  }
}

// Register
document.getElementById('registerForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;

  const users = JSON.parse(localStorage.getItem('users') || '[]');

  if (users.find(u => u.email === email)) {
    document.getElementById('registerMsg').textContent = 'Email already registered.';
    return;
  }

  const newUser = { name, email, password };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  document.getElementById('registerMsg').textContent = 'Registration successful!';
  this.reset();
  updateNavbar();
  showSection('offers');
});

// Login
document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    document.getElementById('loginMsg').textContent = '';
    updateNavbar();
    showSection('offers');
  } else {
    document.getElementById('loginMsg').textContent = 'Invalid credentials.';
  }

  this.reset();
});

// Logout
function logout() {
  localStorage.removeItem('currentUser');
  updateNavbar();
  showSection('login');
}

// Initialize app
renderOffers();
updateNavbar();
showSection('offers');