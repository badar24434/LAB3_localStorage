document.addEventListener('DOMContentLoaded', function() {
  // Show messages to user
  function showMessage(container, message, type) {
    container.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
  }

  // Check if user exists by email
  function userExists(email) {
    return localStorage.getItem(email) !== null;
  }

  // Get user by email
  function getUserByEmail(email) {
    const userData = localStorage.getItem(email);
    return userData ? JSON.parse(userData) : null;
  }

  // Registration form handling
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form inputs
      const name = document.getElementById('register-name').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      const messageContainer = document.getElementById('message-container');

      // Basic validation
      if (!name || !email || !password || !confirmPassword) {
        showMessage(messageContainer, 'All fields are required', 'danger');
        return;
      }

      if (password !== confirmPassword) {
        document.getElementById('confirm-password').classList.add('is-invalid');
        showMessage(messageContainer, 'Passwords do not match', 'danger');
        return;
      }

      // Check if user already exists
      if (userExists(email)) {
        document.getElementById('register-email').classList.add('is-invalid');
        showMessage(messageContainer, '⚠️ User already exists', 'warning');
        return;
      }

      // Store user in localStorage using email as key
      const user = { name, email, password };
      localStorage.setItem(email, JSON.stringify(user));

      showMessage(messageContainer, 'Registration successful!', 'success');
      setTimeout(() => {
        registerForm.reset();
        window.location.href = 'index.html';
      }, 2000);
    });

    // Reset validation states on input
    document.getElementById('register-email').addEventListener('input', function() {
      this.classList.remove('is-invalid');
    });

    document.getElementById('confirm-password').addEventListener('input', function() {
      this.classList.remove('is-invalid');
    });
  }

  // Login form handling
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      const messageContainer = document.getElementById('message-container');

      // Get user from localStorage
      const user = getUserByEmail(email);

      // Check credentials
      if (user && user.password === password) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        showMessage(messageContainer, 'Login successful!', 'success');

        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1000);
      } else {
        showMessage(messageContainer, 'Invalid email or password', 'danger');
      }
    });
  }

  // Dashboard handling
  if (window.location.pathname.includes('dashboard.html')) {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
      window.location.href = 'index.html';
      return;
    }

    document.getElementById('user-name').textContent = `Welcome, ${currentUser.name}`;
    document.getElementById('welcome-message').textContent = `Welcome to your Dashboard, ${currentUser.name}!`;
    document.getElementById('user-email').textContent = `Email: ${currentUser.email}`;

    document.querySelectorAll('#logout-btn, #logout-button').forEach(button => {
      button.addEventListener('click', function() {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
      });
    });
  }
});
