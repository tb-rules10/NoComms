const {register, login, setAvatar, allUsers, logout, home} = require('../controllers/userController.js');
const router = require('express').Router(); 

router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);
router.get("/allUsers/:id", allUsers);
router.get("/logout/:id", logout);
router.get('/', home);

module.exports = router