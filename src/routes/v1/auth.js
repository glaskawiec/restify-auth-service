const passport = require('passport');
const registerController = require('../../controllers/registerController');
const loginController = require('../../controllers/loginController');
const validateBody = require('../../middlewares/validateBody');
const validateAuth = require('../../middlewares/validateAuth');
const meController = require('../../controllers/meController');
const forgotPasswordController = require('../../controllers/forgotPasswordController');
const resetPasswordValidationSchema = require('../../validations/resetPasswordValidationSchema');
const resetPasswordController = require('../../controllers/resetPasswordController');
const facebookCallbackController = require('../../controllers/facebookCallbackController');
const googleCallbackController = require('../../controllers/googleCallbackController');
const githubCallbackController = require('../../controllers/githubCallbackController');
const verifyController = require('../../controllers/verifyController');
const resendTokenController = require('../../controllers/resendTokenController');
const loginValidationSchema = require('../../validations/loginValidationSchema');
const forgotPasswordValidationSchema = require('../../validations/forgotPasswordValidationSchema');
const confirmationValidationSchema = require('../../validations/confirmationValidationSchema');
const resendTokenValidationSchema = require('../../validations/resendTokenValidationSchema');


const route = 'auth';


module.exports = (server, ver) => {
  /**
   * @swagger
   *
   * /auth/login:
   *   post:
   *     description: Login to the application
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: email
   *         description: Email to use for login.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: password
   *         description: User's password.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: OK
   *       401:
   *         description: Unauthorized
   */
  server.post(
    `/${ver}/${route}/login`,
    validateBody(loginValidationSchema),
    loginController,
  );

  /**
 * @swagger
 *
 * /auth/register:
 *   post:
 *     description: Register to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: Email to use for register.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: Password to use for register.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: displayName
 *         description: User's display name.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: Created
 */
  server.post(
    `/${ver}/${route}/register`,
    registerController,
  );

  server.post(
    `/${ver}/${route}/verify`,
    validateBody(confirmationValidationSchema),
    verifyController,
  );

  server.post(
    `/${ver}/${route}/resend`,
    validateBody(resendTokenValidationSchema),
    resendTokenController,
  );

  /**
 * @swagger
 *
 * /auth/me:
 *   get:
 *     description: Get information's about user.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 */
  server.get(
    `/${ver}/${route}/me`,
    validateAuth({ isAdmin: false }),
    meController,
  );

  /**
 * @swagger
 *
 * /auth/forgot-password:
 *   post:
 *     description: Send password reset request.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: Email to use for password reset.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: OK
 */
  server.post(
    `/${ver}/${route}/forgot-password`,
    validateBody(forgotPasswordValidationSchema),
    forgotPasswordController,
  );

  /**
 * @swagger
 *
 * /auth/reset-password:
 *   post:
 *     description: Password reset.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: newPassword
 *         description: New password to use for password reset.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: verifyPassword
 *         description: Verify password to use for password reset.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: token
 *         description: Token to use for password reset.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: OK
 */
  server.post(
    `/${ver}/${route}/reset-password`,
    validateBody(resetPasswordValidationSchema),
    resetPasswordController,
  );

  /**
 * @swagger
 *
 * /auth/facebook:
 *   get:
 *     description: Request Facebook oAuth server.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 */
  server.get(
    `/${ver}/${route}/facebook`,
    passport.authenticate('facebook', { session: false }),
  );

  /**
 * @swagger
 *
 * /auth/facebook/callback:
 *   get:
 *     description: Handle Facebook oAuth server callback.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 */
  server.get(
    `/${ver}/${route}/facebook/callback`,
    passport.authenticate('facebook', { session: false }),
    facebookCallbackController,
  );


  /**
 * @swagger
 *
 * /auth/google:
 *   get:
 *     description: Request Google oAuth server.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 */
  server.get(
    `/${ver}/${route}/google`,
    passport.authenticate('google', {
      session: false,
      scope: ['profile'],
    }),
  );

  /**
 * @swagger
 *
 * /auth/google/callback:
 *   get:
 *     description: Handle Google oAuth server callback.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 */
  server.get(
    `/${ver}/${route}/google/callback`,
    passport.authenticate('google', {
      session: false,
      failureRedirect: '/',
    }),
    googleCallbackController,
  );

  /**
 * @swagger
 *
 * /auth/github:
 *   get:
 *     description: Request Github oAuth server.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 */
  server.get(
    `/${ver}/${route}/github`,
    passport.authenticate('github', {
      session: false,
    }),
  );

  /**
 * @swagger
 *
 * /auth/github/callback:
 *   get:
 *     description: Handle Github oAuth server callback.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 */
  server.get(
    `/${ver}/${route}/github/callback`,
    passport.authenticate('github', {
      failureRedirect: '/login',
      session: false,
    }),
    githubCallbackController,
  );
};
