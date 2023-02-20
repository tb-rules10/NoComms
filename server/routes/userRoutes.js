const {register, login, setAvatar, allUsers, logout} = require('../controllers/userController.js');
const router = require('express').Router(); 

router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);
router.get("/allUsers/:id", allUsers);
router.get("/logout/:id", logout);

module.exports = router