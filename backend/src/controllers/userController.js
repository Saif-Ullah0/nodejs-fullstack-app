// const {
//   getAllUsers,
//   addUser,
//   updateUser,
//   deleteUser,
//   getUserByEmail,
//   getUserById
// } = require('../models/User');


const bcrypt = require('bcrypt');
const {
  createUser,
  getAllUsers,
  getUserByEmail,
  getUserById,
  updateUser,
  deleteUser,
} = require('../services/userService');
const { createManyUsers } = require('../services/userService');

async function getUserController(req, res) {
  try {
    const users = await getAllUsers();
    res.json(users);
  }
  catch (error) {
    console.error('Error in getUserController:', error.message);  
    res.status(500).json({ error: 'Failed to fetch users' });
  }   
};

async function createUserController(req, res) {
  try {
    const { name, email, password, phone, city, age, bio, role } = req.body;
    console.log('Registering new user:', req.body);
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({
      name,
      email,
      password: hashedPassword,
      phone,
      city,
      age: age ? parseInt(age) : null,
      bio,
      role : role || 'user', 
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error in createUserController:', error.message);
    res.status(500).json({ error: 'Failed to create user' });
  }
};


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
};

const updateUserController = async (req, res) => {
  try { 
    const {_id, ...data}= req.body; 
    console.log('Updating user ID:', req.params.id);
    const updated = await updateUser(req.params.id, data);
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(updated);
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
};

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
};

async function createManyUsersController(req, res) {
  try {
    console.log('Bulk registering users...');
    const users = req.body;
    const result = await createManyUsers(users);
    res.status(201).json({ success: true, count: result.count });
  } catch (error) {
    console.error('Bulk user creation failed:', error.message);
    res.status(500).json({ error: 'Bulk creation failed' });
  }
};

module.exports = {
  getUserController,
  createUserController,
  updateUserController,
  deleteUserController,
  loginUserController,
  getUserByIdController,
  createManyUsersController,
};



// async function getUserController(req, res) {
//   try {
//     console.log('Received request to GET all users');
//     const users = await getAllUsers();
//     res.json(users);
//   } catch (error) {
//     console.error('Error in getUserController:', error.message);
//     res.status(500).json({ error: 'Failed to fetch users' });
//   }
// }

// async function createUserController(req, res) {
//   try {
//     console.log('Registering new user:', req.body);
//     const newUser = await addUser(req.body);
//     res.status(201).json(newUser);
//   } catch (error) {
//     console.error('Error in createUserController:', error.message);
//     res.status(400).json({ error: 'Failed to add user' });
//   }
// }

// const updateUserController = async (req, res) => {
//   try {
//     const { _id, ...safeUpdateData } = req.body; // Remove _id

//     console.log('Updating user ID:', req.params.id);
//     const updated = await updateUser(req.params.id, safeUpdateData);

//     if (!updated) {
//       return res.status(404).json({ error: `User with ID ${req.params.id} not found` });
//     }

//     res.json({ success: true, data: updated });
//   } catch (error) {
//     console.error('Error updating user:', error.message);
//     res.status(500).json({ error: 'Failed to update user' });
//   }
// };

// async function deleteUserController(req, res) {
//   try {
//     console.log('Deleting user with ID:', req.params.id);
//     const result = await deleteUser(req.params.id);
//     res.json({ success: true, message: result.message });
//   } catch (error) {
//     console.error('Error deleting user:', error.message);
//     res.status(500).json({ error: 'Failed to delete user' });
//   }
// }

// async function getUserByIdController(req, res) {
//   try {
//     const user = await getUserById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const { password, ...userWithoutPassword } = user;
//     res.status(200).json(userWithoutPassword);
//   } catch (error) {
//     console.error('Error fetching user by ID:', error.message);
//     res.status(404).json({ error: 'Failed to fetch user' });
//   }
// }

// async function loginUserController(req, res) {
//   try {
//     const { email, password } = req.body;
//     console.log('Login attempt:', email);

//     if (!email || !password) {
//       return res.status(400).json({ error: 'Email and password are required' });
//     }

//     const user = await getUserByEmail(email);
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     const { password: _, ...userWithoutPassword } = user;
//     res.status(200).json(userWithoutPassword);
//   } catch (error) {
//     console.error('Login failed:', error.message);
//     res.status(500).json({ error: 'Login failed' });
//   }
// }

// module.exports = {
//   getUserController,
//   createUserController,
//   updateUserController,
//   deleteUserController,
//   loginUserController,
//   getUserByIdController
// };
