const nodemailer = require('nodemailer');
const config = require('config');

const smtpConfig = {
  host: config.get('smtp.host'),
  port: config.get('smtp.port'),
  secure: true, // use SSL
  auth: {
    user: config.get('smtp.user'),
    pass: config.get('smtp.pass'),
  },
};

const smtpTransport = nodemailer.createTransport(smtpConfig);


exports.sendVerificationTokenEmail = async (email, token) => {
  const mailOptions = {
    from: config.get('smtp.user'),
    to: email,
    subject: 'Account Verification Token',
    text: `${'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + 'localhost:8000' + '\/app\/verify-email\/'}${token}\n`,
  };

  await smtpTransport.sendMail(mailOptions);
};


exports.sendResetPasswordTokenEmail = async (email, token) => {
  const mailOptions = {
    from: config.get('smtp.user'),
    to: email,
    subject: 'Password help has arrived!',
    text: `${config.get('resetPasswordUrl')}/${token}`,
  };

  smtpTransport.sendMail(mailOptions);
};

// module.exports = smtpTransport;
