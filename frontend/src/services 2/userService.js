// src/services/userService.js

import axios from 'axios';

/**
 * Updates user information.
 * @param {Object} userData - The data to update the user with.
 * @returns {Promise<Object>} The updated user data.
 */
export const updateUser = async (userData) => {
  try {
    const response = await axios.put('/api/users/update', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};
