const express = require("express");
const multer = require("multer");
const path = require("path");

const UPLOADS_FOLDER = "./uploads/";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_FOLDER);
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const filename = file.originalname
            .replace(fileExt, "")
            .toLowerCase()
            .split(" ")
            .join("-") + "-" + Date.now();
        cb(null, filename + fileExt);
    }
});

//multer function call korle ja ja lagbe ta jeno deya jay
var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000, // 1 MB
    },
    fileFilter: (req, file, cb) => {

        if (file.fieldname === "avatar") {
            if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
                cb(null, true);
            }
            else {
                cb(new Error('Only jpg, jpeg, or png file format are allowed'));
            }
        }
        else if (file.fieldname == "doc") {
            if (file.mimetype === 'application/pdf') {
                cb(null, true);
            } else {
                cb(new Error('Only pdf format is allowed'));
            }
        }
        else {
            cb(new Error('There was an unknown error'))
        }
    }
})

const app = express();


//for single file upload
app.post('/', upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'doc', maxCount: 1 }
]), (req, res) => {
    console.log(req.files);
    res.send('Post router');
});



// default error handler

app.use((err, req, res, next) => {
    if (err) {
        //find out only multer error
        if (err instanceof multer.MulterError) {
            res.status(500).send('There was an upload error');
        } else {
            res.status(500).send(err.message);
        }
    } else {
        res.send("success");
    }
});


// fot multiple file upload
// app.post('/', upload.array("avatar", 2), (req, res) => {
//     res.send('Post router');
// });



// for multiple fields
// app.post('/', upload.fields([
//     { name: "avatar", maxCount: 2 },
//     { name: "gallery", maxCount: 4 }
// ]), (req, res) => {
//     res.send('Post router');
// });



// for only data uploads
// app.post('/', upload.none(), (req, res) => {
//     res.send('Post router');
// });


app.listen(3000, () => {
    console.log('listening on port 3000')
})