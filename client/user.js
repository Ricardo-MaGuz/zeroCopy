document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in
  const token = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token || !userData._id) {
    window.location.href = '/';
    return;
  }

  // DOM Elements
  const profileForm = document.getElementById('profileForm');
  const editBtn = document.getElementById('editBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const balanceElement = document.getElementById('balance');
  const profileImage = document.getElementById('profileImage');

  // Populate form with user data
  function populateForm() {
    document.getElementById('firstName').value = userData.name?.first || '';
    document.getElementById('lastName').value = userData.name?.last || '';
    document.getElementById('email').value = userData.email || '';
    document.getElementById('phone').value = userData.phone || '';
    document.getElementById('address').value = userData.address || '';
    balanceElement.textContent = userData.balance || 'N/A';

    // Set profile picture
    if (userData.picture) {
      profileImage.src = userData.picture;
      profileImage.alt = `${userData.name?.first} ${userData.name?.last}'s profile picture`;
    } else {
      profileImage.src = 'https://via.placeholder.com/150';
      profileImage.alt = 'Default profile picture';
    }
  }

  // Toggle form edit mode
  function toggleEditMode(editable) {
    const inputs = profileForm.querySelectorAll('input');
    inputs.forEach((input) => {
      input.readOnly = !editable;
    });
    document.querySelector('.form-actions').style.display = editable
      ? 'flex'
      : 'none';
    editBtn.style.display = editable ? 'none' : 'block';
  }

  // Event Listeners
  editBtn.addEventListener('click', () => toggleEditMode(true));
  cancelBtn.addEventListener('click', () => {
    toggleEditMode(false);
    populateForm(); // Reset form to original values
  });

  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const updatedData = {
      name: {
        first: document.getElementById('firstName').value,
        last: document.getElementById('lastName').value,
      },
      phone: document.getElementById('phone').value,
      address: document.getElementById('address').value,
    };

    try {
      const response = await fetch('http://localhost:3000/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toggleEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile: ' + error.message);
    }
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  });

  // Initial form population
  populateForm();
});
