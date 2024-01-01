// backend/routes/api/users.js
const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

router.use((req, res, next) => {
  console.log('User route hit!');
  next();
});

// router.post('/', async (req, res) => {
//   const { email, password, username } = req.body;
//   const hashedPassword = bcrypt.hashSync(password);
//   const user = await User.create({ email, username, hashedPassword });

//   const safeUser = {
//     id: user.id,
//     email: user.email,
//     username: user.username,
//     // lastName: user.lastName,
//     // firstName: user.firstName
//   };

//   await setTokenCookie(res, safeUser);

//   return res.json({
//     user: safeUser
//   });
// }
// );

// backend/routes/api/users.js
// ...
const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

// Sign up
router.post('/', validateSignup, async (req, res) => {
  const { email, password, username } = req.body;
  const hashedPassword = bcrypt.hashSync(password);
  const user = await User.create({ email, username, hashedPassword });

  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser
  });
}
);


// router.get('/:id', async (req, res) => {
//   // console.log('Fetching user details');
//   const {id} = req.params;
//   const user = await User.findByPk(id, {})

//   res.json(user)
// })

router.get('/:id', async (req, res) => {
  console.log('Fetching user details');
  const { id } = req.params;
  const user = await User.findByPk(id, {});
  // console.log(user); // Add this line to log user details
  res.json({'user': user});
});





module.exports = router;