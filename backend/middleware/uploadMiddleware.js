/**
 * middleware/uploadMiddleware.js
 * ------------------------------
 * Multer configuration for handling image uploads in Findora.
 *
 * Future responsibilities:
 *  - Configure multer disk storage:
 *      destination → save files to backend/uploads/
 *      filename    → generate unique names using Date.now() + original extension
 *  - Apply file type filter: accept only image/jpeg, image/png, image/webp
 *  - Set file size limit (e.g. 5 MB per file)
 *  - Export an upload middleware instance for use in itemRoutes
 *
 * Usage in routes:
 *   const { upload } = require('../middleware/uploadMiddleware');
 *   router.post('/', protect, upload.array('images', 5), createItem);
 */

const multer = require('multer');
const path   = require('path');

// TODO: Configure disk storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
//   filename:    (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
// });

// TODO: Configure file filter
// const fileFilter = (req, file, cb) => {
//   const allowed = ['image/jpeg', 'image/png', 'image/webp'];
//   cb(null, allowed.includes(file.mimetype));
// };

// Placeholder: use memory storage until disk storage is configured
const upload = multer({ storage: multer.memoryStorage() });

module.exports = { upload };
