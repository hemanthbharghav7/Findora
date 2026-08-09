const express  = require('express');
const router   = express.Router();
const {
  getItems, getItemById, getMatchesForItem,
  createItem, getMyItems,
  updateItem, deleteItem,
  submitClaim, updateClaimStatus,
} = require('../controllers/itemController');
const protect = require('../middleware/authMiddleware');
const upload  = require('../utils/upload');

// Private: logged-in user's own items (must be before /:id)
router.get('/mine', protect, getMyItems);

// Public: paginated list + Private: create with optional image
router.route('/')
  .get(getItems)
  .post(protect, upload.single('image'), createItem);

// Public: smart matches for an item
router.get('/:id/matches', getMatchesForItem);

// Public: single item detail / Private: update or delete
router.route('/:id')
  .get(getItemById)
  .put(protect, updateItem)
  .delete(protect, deleteItem);

// Claims
router.post('/:id/claims', protect, submitClaim);
router.patch('/:id/claims/:claimId', protect, updateClaimStatus);

module.exports = router;
