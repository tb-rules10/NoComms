const Messages = require("../models/messageModel");
const File = require("../models/fileModel");
const short = require('short-uuid');
const fs = require('fs');

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
        isFile: msg.message.text.includes("/api/messages/download/") ? true : false ,
        title: msg.message.title,
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
    const { from, to, message, title } = req.body;
    const data = await Messages.create({
      message: { 
        text: message,
        title: title,
       },
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
    console.log(error);
    res.status(400).send('Error while uploading file. Try again later.');
  }
};

module.exports.downloadFile = async (req, res, next) => {
  const file = await File.findOne( { uuid : req.params.id } );
  var path = file.file_path;
  // console.log(path);
  res.download(path);
};
