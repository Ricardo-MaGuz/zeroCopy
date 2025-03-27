document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const errorToast = new bootstrap.Toast(
    document.getElementById('errorToast'),
    {
      delay: 5000,
      animation: true,
    }
  );
  const toastMessage = document.getElementById('toastMessage');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: 'Failed to parse error response' }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to user page
      window.location.href = '/user.html';
    } catch (error) {
      // Show error toast
      toastMessage.textContent =
        error.message || 'An error occurred during login';
      errorToast.show();

      // Clear password field for security
      document.getElementById('password').value = '';
    }
  });
});
