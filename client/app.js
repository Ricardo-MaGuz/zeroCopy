document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const errorMessage = document.getElementById('errorMessage');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous error messages
    errorMessage.textContent = '';

    // Get form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to user page
      window.location.href = '/user.html';
    } catch (error) {
      errorMessage.textContent =
        error.message || 'An error occurred during login';
    }
  });
});
