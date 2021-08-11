import bcrypt from 'bcrypt';

const bcryptPassword = (password, salt) => {
  return bcrypt.hash(password, salt);
}

const comparePassword = (password, hashPassword) => {
  return bcrypt.compare(password, hashPassword);
}

export {
  bcryptPassword,
  comparePassword
}