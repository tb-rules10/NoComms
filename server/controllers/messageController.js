const Messages = require("../models/messageModel");
const File = require("../models/fileModel");
const fs = require('fs');
const short = require('short-uuid');

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.uploadFile = async (req, res, next) => {
  try {
    const { title } = req.body;
    const { path, mimetype } = req.file;
    console.log(path);
    const fileData = fs.readFileSync(path);
    var id = short.generate()
    const file = await File.create({
      title: title,
      uuid: id,
      data: fileData,
      file_path: path,
      file_mimetype: mimetype
    });
    res.send({ id:  id });
  } catch (error) {
    res.status(400).send('Error while uploading file. Try again later.');
  }
};

module.exports.downloadFile = async (req, res, next) => {
  const file = await File.findOne( { uuid : req.params.id } );
  // console.log(file);

  res.send("Hello")
};
