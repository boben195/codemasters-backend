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

export default multer({ storage, limits });