// backend/routes/api/index.js
const router = require('express').Router();
// GET /api/set-token-cookie
const { setTokenCookie } = require('../../utils/auth.js');
const { User } = require('../../db/models');

const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const groupRouter = require('./group.js')
const venueRouter = require('./venue.js')
const eventRouter = require('./event.js')
const membershipRouter = require('./membership.js')
const attendanceRouter = require('./attendance.js')
const imageRouter = require('./image.js')
const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);
router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/groups', groupRouter);
router.use('/', venueRouter)
router.use('/', eventRouter)
router.use('/', membershipRouter)
router.use('/', attendanceRouter)
router.use('/', imageRouter)

router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
  });


router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: 'User1'
    }
  });
  setTokenCookie(res, user);
  return res.json({ user: user });
});

// backend/routes/api/index.js
// ...
router.get('/restore-user', (req, res) => {
    return res.json(req.user);
  }
);

// ...

module.exports = router;