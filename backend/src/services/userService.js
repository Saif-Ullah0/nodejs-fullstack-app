const User = require('../models/User');
const bcrypt = require('bcrypt');

async function getAllUsers() {
  return await User.find();
}

async function getUserById(id) {
  return await User.findById(id).select('-password');
}

async function getUserByEmail(email) {
  return await User.findOne({ email });
}

async function createUser(userData) {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = new User({
    ...userData,
    password: hashedPassword,
  });
  return await newUser.save();
}

async function updateUser(id, updateData) {
  // Important: prevent updating _id
  delete updateData._id;

  return await User.findByIdAndUpdate(id, updateData, {
    new: true,
  });
}

async function deleteUser(id) {
  return await User.findByIdAndDelete(id);
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
};
