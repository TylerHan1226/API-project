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


//Get the Current User
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  res.status(200)
  return res.json({ 'user': user });
});



// Log In a User
// router.post('/logIn', async (req, res) => {
//   const { credential, password } = req.query;
//   // const hashedPassword = bcrypt.hashSync(password);
//   console.log(credential)
//   console.log(password)
//   // console.log(hashedPassword)
  
//   const userByEmail = await User.findAll({
//     where: {email: credential}
//   })
//   // const userId1 = userByEmail.dataValues.id;
//   console.log(userByEmail)
//   // console.log(userId1)
//   console.log(bcrypt.hashSync('password'))
//   const userByPassword = await User.findAll({
//     where: {hashedPassword: bcrypt.hashSync(password)}
//   })
//   // const userId2 = userByPassword.dataValues.id;
//   console.log(userByPassword)
//   // console.log(userId2)

//   if (userId1 = userId2) {
//     const loggedInUser  = await User.findByPk(userId1);
//     res.status(200)
//     return res.json(loggedInUser )
//   }
// })





module.exports = router;