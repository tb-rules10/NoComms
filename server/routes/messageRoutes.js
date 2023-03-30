const router = require("express").Router();
const multer = require('multer');
const { addMessage, getMessages, uploadFile, downloadFile } = require("../controllers/messageController");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  limits: { fileSize: 10 * 1024 * 1024 },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({ storage: storage });


router.post("/addmsg/", addMessage);

router.post("/getmsg/", getMessages);

router.post("/upload", upload.single('file'), uploadFile);

router.get("/download/:id", downloadFile);

module.exports = router;