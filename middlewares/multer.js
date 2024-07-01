import multer from "multer";
import path from "node:path";



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve("tmp"));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const limits = {
    fileSize: 1 * 1024 * 1024
}

const upload = multer({ storage, limits }).single("avatarURL");

const limitUpload = (req, res, next) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: "Your img is too big! Change size (max 1 MB)" });
        } else if (err) {
            return res.status(500).json({ message: err.message });
        }
        next();
    });
};

export default limitUpload;