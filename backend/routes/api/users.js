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
  // console.log('Request Body:', req.body);
  const { firstName, lastName, email, password, username } = req.body;
  
  const hashedPassword = bcrypt.hashSync(password);
  const user = await User.create({ firstName, lastName, email, username, hashedPassword });

  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser
  });
}
);


// //Get the Current User
// router.get('/', requireAuth, (req, res) => {
//   const { user } = req;
//   if (user) {
//     const safeUser = {
//       id: user.id,
//       email: user.email,
//       username: user.username,
//     };
//     res.status(200)
//     return res.json({ user: safeUser });
//   } else {
//     return res.json({ user: null });
//   }
// });
// //Error: Authentication required



// // Log In a User
// router.post('/logIn', async (req, res) => {
//   const { credential, password } = req.query;
//   // const hashedPassword = bcrypt.hashSync(password);
//   console.log(credential)
//   console.log(password)
//   // console.log(hashedPassword)
  
//   //get user by email
//   const userByEmail = await User.findAll({
//     where: {email: credential}
//   })
//   // const userId1 = userByEmail.dataValues.id;
//   console.log(userByEmail)
//   // console.log(userId1)
//   console.log(bcrypt.hashSync('password'))

//   //get user by password?
//   const userByPassword = await User.findAll({
//     where: {hashedPassword: bcrypt.hashSync(password)}
//   })
//   // const userId2 = userByPassword.dataValues.id;
//   console.log(userByPassword)
//   // console.log(userId2)

//   //compare id? How can I compare hashed password?
//   if (userId1 = userId2) {
//     const loggedInUser  = await User.findByPk(userId1);
//     res.status(200)
//     return res.json(loggedInUser )
//   }
// })

// //Not getting the hashed password correctly??




module.exports = router;