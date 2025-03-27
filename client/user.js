document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token || !userData._id) {
    window.location.href = '/';
    return;
  }

  const profileForm = document.getElementById('profileForm');
  const editBtn = document.getElementById('editBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const saveBtn = document.getElementById('saveBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const balanceElement = document.getElementById('balance');
  const profileImage = document.getElementById('profileImage');
  const errorMessage = document.createElement('div');
  const successToast = new bootstrap.Toast(
    document.getElementById('successToast'),
    {
      delay: 3000,
    }
  );

  errorMessage.className = 'error-message d-none';
  profileForm.appendChild(errorMessage);

  // Function to show error message
  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.color = '#e74c3c';
    errorMessage.classList.remove('d-none');
    if (message) {
      setTimeout(() => {
        errorMessage.classList.add('d-none');
        errorMessage.textContent = '';
      }, 3000);
    }
  }

  async function fetchUserProfile() {
    try {
      const response = await fetch('http://localhost:3000/api/users/profile', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch profile');
      }

      const user = await response.json();
      localStorage.setItem('user', JSON.stringify(user));
      populateForm(user);
    } catch (error) {
      showError(error.message || 'Failed to load profile data');
    }
  }

  function populateForm(user = userData) {
    document.getElementById('firstName').value = user.name?.first || '';
    document.getElementById('lastName').value = user.name?.last || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('phone').value = user.phone || '';
    document.getElementById('address').value = user.address || '';
    balanceElement.textContent = user.balance || 'N/A';

    if (user.picture) {
      profileImage.src = user.picture;
      profileImage.alt = `${user.name?.first} ${user.name?.last}'s profile picture`;
    } else {
      profileImage.src = 'https://via.placeholder.com/150';
      profileImage.alt = 'Default profile picture';
    }
  }

  function toggleEditMode(editable) {
    const inputs = profileForm.querySelectorAll('input:not([name="email"])');
    const editBtn = document.getElementById('editBtn');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    // Toggle input readonly state
    inputs.forEach((input) => {
      input.readOnly = !editable;
    });

    // Toggle visibility of buttons
    if (editable) {
      editBtn.classList.add('d-none');
      saveBtn.classList.remove('d-none');
      cancelBtn.classList.remove('d-none');
    } else {
      editBtn.classList.remove('d-none');
      saveBtn.classList.add('d-none');
      cancelBtn.classList.add('d-none');
    }

    errorMessage.classList.add('d-none');
    errorMessage.textContent = '';
  }

  // Event Listeners
  editBtn.addEventListener('click', () => {
    toggleEditMode(true);
  });

  cancelBtn.addEventListener('click', () => {
    toggleEditMode(false);
    populateForm();
  });

  // Handle form submission with save button
  saveBtn.addEventListener('click', async () => {
    const updatedData = {
      name: {
        first: document.getElementById('firstName').value.trim(),
        last: document.getElementById('lastName').value.trim(),
      },
      phone: document.getElementById('phone').value.trim(),
      address: document.getElementById('address').value.trim(),
    };

    try {
      const response = await fetch('http://localhost:3000/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.errors?.[0]?.msg || 'Failed to update profile'
        );
      }

      localStorage.setItem('user', JSON.stringify(data));
      populateForm(data);
      toggleEditMode(false);
      successToast.show();
    } catch (error) {
      showError(error.message || 'Failed to update profile');
    }
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  });

  fetchUserProfile();
});
