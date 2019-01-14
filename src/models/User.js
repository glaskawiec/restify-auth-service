const mongoose = require('mongoose');
const mongooseTimestamp = require('mongoose-timestamp');
const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema({
  displayName: String,
  email: {
    type: String,
    trim: true,
  },
  password: String,
  isVerified: { type: Boolean, default: false },
  isAdmin: String,
  facebookId: String,
  googleId: String,
  githubId: String,
  githubLink: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});


userSchema.pre('save', function (next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});


userSchema.plugin(mongooseTimestamp);

module.exports = mongoose.model('User', userSchema);
