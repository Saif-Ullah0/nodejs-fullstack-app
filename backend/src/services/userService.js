//const User = require('../models/User');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('../generated/prisma');
const { parse } = require('dotenv');
const prisma = new PrismaClient();

const createUser = async (data) => {
  return await prisma.user.create({
    data,
    });
};

const getAllUsers = async () => {
  return await prisma.user.findMany();

};

const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id: parseInt(id) },
  });
};

const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

const updateUser = async (id, data) => {
  return await prisma.user.update({
    where :{id:parseInt(id)},
    data,
  });

};

const deleteUser = async (id) => {
  return await prisma.user.delete({
    where: { id: parseInt(id) },
  }); 
};
async function createManyUsers(usersArray) {
  return await prisma.user.createMany({
    data: usersArray,
    skipDuplicates: true 
  });
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
  createManyUsers,
};




// async function getAllUsers() {
//   return await User.find();
// }

// async function getUserById(id) {
//   return await User.findById(id).select('-password');
// }

// async function getUserByEmail(email) {
//   return await User.findOne({ email });
// }

// async function createUser(userData) {
//   const hashedPassword = await bcrypt.hash(userData.password, 10);
//   const newUser = new User({
//     ...userData,
//     password: hashedPassword,
//   });
//   return await newUser.save();
// }

// async function updateUser(id, updateData) {
//   // Important: prevent updating _id
//   delete updateData._id;

//   return await User.findByIdAndUpdate(id, updateData, {
//     new: true,
//   });
// }

// async function deleteUser(id) {
//   return await User.findByIdAndDelete(id);
// }

// module.exports = {
//   getAllUsers,
//   getUserById,
//   getUserByEmail,
//   createUser,
//   updateUser,
//   deleteUser,
// };
