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
  const logoutBtn = document.getElementById('logoutBtn');
  const balanceElement = document.getElementById('balance');
  const profileImage = document.getElementById('profileImage');
  const errorMessage = document.createElement('div');
  errorMessage.className = 'error-message';
  profileForm.appendChild(errorMessage);

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
      errorMessage.textContent = error.message || 'Failed to load profile data';
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
    inputs.forEach((input) => {
      input.readOnly = !editable;
    });
    document.querySelector('.form-actions').style.display = editable
      ? 'flex'
      : 'none';
    editBtn.style.display = editable ? 'none' : 'block';
    errorMessage.textContent = '';
  }

  editBtn.addEventListener('click', () => toggleEditMode(true));

  cancelBtn.addEventListener('click', () => {
    toggleEditMode(false);
    populateForm();
  });

  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.textContent = '';

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

      errorMessage.style.color = '#2ecc71';
      errorMessage.textContent = 'Profile updated successfully!';
      setTimeout(() => {
        errorMessage.textContent = '';
      }, 3000);
    } catch (error) {
      errorMessage.style.color = '#e74c3c';
      errorMessage.textContent = error.message || 'Failed to update profile';
    }
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  });

  fetchUserProfile();
});
