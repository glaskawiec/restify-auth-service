const userValidationSchema = require('../../validations/userValidationSchema');
const validateBody = require('../../middlewares/validateBody');
const validateAuth = require('../../middlewares/validateAuth');
const usersController = require('../../controllers/usersController');

const route = 'users';

module.exports = (server, ver) => {
  /**
 * @swagger
 *
 * /users:
 *   get:
 *     description: Get list of all users.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 */
  server.get(
    `/${ver}/${route}`,
    validateAuth({ isAdmin: true }),
    usersController.getUserList,
  );

  /**
 * @swagger
 *
 * /users/:id:
 *   get:
 *     description: Get user with specific id.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 */
  server.get(
    `/${ver}/${route}/:id`,
    validateAuth({ isAdmin: true }),
    usersController.getUserById,
  );

  /**
 * @swagger
 *
 * /users:
 *   post:
 *     description: Add user.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         in: formData
 *         required: true
 *         type: string
 *       - name: displayName
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: OK
 */
  server.post(
    `/${ver}/${route}`,
    validateAuth({ isAdmin: true }),
    validateBody(userValidationSchema),
    usersController.addUser,
  );

  /**
 * @swagger
 *
 * /users/:id:
 *   put:
 *     description: Update user with specific id.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         in: formData
 *         required: true
 *         type: string
 *       - name: displayName
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: OK
 */
  server.put(
    `/${ver}/${route}/:id`,
    validateAuth({ isAdmin: true }),
    validateBody(userValidationSchema),
    usersController.updateUserWithId,
  );

  /**
 * @swagger
 *
 * /users/:id:
 *   delete:
 *     description: Delete user with specific id.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 */
  server.del(
    `/${ver}/${route}/:id`,
    validateAuth({ isAdmin: true }),
    usersController.deleteUser,
  );
};
