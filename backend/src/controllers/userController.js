const {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  getUserById
} = require('../models/User');

const bcrypt = require('bcrypt');

async function getUserController(req, res) {
  try {
    console.log('Received request to GET all users');
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error in getUserController:', error.message);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

async function createUserController(req, res) {
  try {
    console.log('Registering new user:', req.body);
    const newUser = await addUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error in createUserController:', error.message);
    res.status(400).json({ error: 'Failed to add user' });
  }
}

const updateUserController = async (req, res) => {
  try {
    const { _id, ...safeUpdateData } = req.body; // Remove _id

    console.log('Updating user ID:', req.params.id);
    const updated = await updateUser(req.params.id, safeUpdateData);

    if (!updated) {
      return res.status(404).json({ error: `User with ID ${req.params.id} not found` });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

async function deleteUserController(req, res) {
  try {
    console.log('Deleting user with ID:', req.params.id);
    const result = await deleteUser(req.params.id);
    res.json({ success: true, message: result.message });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ error: 'Failed to delete user' });
  }
}

async function getUserByIdController(req, res) {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Error fetching user by ID:', error.message);
    res.status(404).json({ error: 'Failed to fetch user' });
  }
}

async function loginUserController(req, res) {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', email);

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Login failed:', error.message);
    res.status(500).json({ error: 'Login failed' });
  }
}

module.exports = {
  getUserController,
  createUserController,
  updateUserController,
  deleteUserController,
  loginUserController,
  getUserByIdController
};
