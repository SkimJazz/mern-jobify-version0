import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        // Keep the original file name
        const fileName = file.originalname;
        cb(null, fileName);
    },
});
const upload = multer({ storage });
export default upload;