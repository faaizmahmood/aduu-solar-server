const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure "uploads" folder exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage engine for multer (if needed for middleware usage)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Store files in the "uploads" folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

// File filter to accept only images and PDFs
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPG, PNG, and PDF are allowed."), false);
    }
};

// Initialize Multer (if you need to use it as middleware)
const upload = multer({ storage, fileFilter });

/**
 * Utility function to handle file uploads.
 * Expects a file object that contains a buffer.
 * If file.originalname is missing, attempts to use file.filename or no extension.
 *
 * @param {Object} file - The file object to be uploaded.
 * @returns {Promise<String>} - Resolves with the uploaded file URL.
 */
const uploadFiles = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            return reject(new Error("No file provided"));
        }

        // Determine extension: use originalname if available; otherwise, use file.filename; or fallback to empty string.
        let ext = "";
        if (file.originalname && typeof file.originalname === "string") {
            ext = path.extname(file.originalname);
        } else if (file.filename && typeof file.filename === "string") {
            ext = path.extname(file.filename);
        } else {
            ext = "";
        }

        const filename = Date.now() + ext;
        const filePath = path.join(uploadDir, filename);

        // Ensure file.buffer exists
        if (!file.buffer) {
            return reject(new Error("File buffer is not provided"));
        }

        fs.writeFile(filePath, file.buffer, (err) => {
            if (err) {
                return reject(err);
            } else {
                resolve(`/uploads/${filename}`);
            }
        });
    });
};

module.exports = { upload, uploadFiles };
