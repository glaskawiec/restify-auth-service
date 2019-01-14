const restifyErrors = require('restify-errors');
const User = require('../models/User');

module.exports = {
  getUserList: async (req, res, next) => {
    try {
      const users = await User.find({});
      res.send(users);
      return next();
    } catch (err) {
      return next(new restifyErrors.InvalidContentError(err));
    }
  },

  getUserById: async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      res.send(user);
      return next();
    } catch (err) {
      return next(new restifyErrors.ResourceNotFoundError(`There is no user with id of ${req.params.id}`));
    }
  },

  updateUserWithId: async (req, res, next) => {
    try {
      await User.findOneAndUpdate({ _id: req.params.id }, req.body);
      res.send(204);
      return next();
    } catch (err) {
      return next(new restifyErrors.ResourceNotFoundError(`There is no user with id of ${req.params.id}`));
    }
  },

  addUser: async (req, res, next) => {
    const { password, email, isAdmin } = req.body;

    // check is user already exists
    const userCountWithEmail = await User.count({ email });

    if (userCountWithEmail > 0) {
      return next(new restifyErrors.ConflictError('User Already Exists'));
    }

    const newUser = new User({
      email,
      password,
      isAdmin,
    });

    await newUser.save();
    res.send(201);

    return next();
  },

  deleteUser: async (req, res, next) => {
    try {
      await User.findByIdAndRemove({ _id: req.params.id });
      res.send(204);
      return next();
    } catch (err) {
      return next(new restifyErrors.ResourceNotFoundError(`There is no user with id of ${req.params.id}`));
    }
  },
};
