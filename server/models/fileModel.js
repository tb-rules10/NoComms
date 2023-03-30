const mongoose = require("mongoose");

const fileSchema = mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true
      },
      uuid :{
        type:String,
        required:true,
        unique: true
      },
      data: {
        type: Buffer,
        required: true,
      },
      file_path: {
        type: String,
        required: true
      },
      file_mimetype: {
        type: String,
        required: true
      }
    },
    {
      timestamps: true
    }
  );
  
  
module.exports = mongoose.model('File', fileSchema);