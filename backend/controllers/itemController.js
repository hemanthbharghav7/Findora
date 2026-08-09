const Item = require('../models/Item');
const Notification = require('../models/Notification');
const fs = require('fs');

// ── Helper: build keyword regex from a string ────────────────
const keywordRegex = (text) => {
  const words = text
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 2)           // ignore tiny words
    .map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')); // escape regex chars
  return words.length ? new RegExp(words.join('|'), 'i') : null;
};

// @desc    Get items — server-side paginated, searched, filtered, sorted
// @route   GET /api/items?page=1&limit=12&type=Lost&category=Electronics&search=laptop&sort=newest
// @access  Public
const getItems = async (req, res) => {
  try {
    const {
      type, category, search,
      page  = 1,
      limit = 12,
      sort  = 'newest',
    } = req.query;

    // ── Build filter ─────────────────────────────────────────
    const filter = {};
    if (type && type !== 'All')                   filter.type     = type;
    if (category && category !== 'All Categories') filter.category = category;
    if (search) {
      filter.$or = [
        { title:       { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location:    { $regex: search, $options: 'i' } },
      ];
    }

    // ── Sort ─────────────────────────────────────────────────
    const sortMap = {
      newest:   { createdAt: -1 },
      oldest:   { createdAt:  1 },
      az:       { title:      1 },
      za:       { title:     -1 },
    };
    const sortQuery = sortMap[sort] || sortMap.newest;

    // ── Pagination ───────────────────────────────────────────
    const pageNum  = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(48, Math.max(1, parseInt(limit, 10)));
    const skip     = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Item.find(filter)
        .populate('owner', 'name email')
        .sort(sortQuery)
        .skip(skip)
        .limit(limitNum),
      Item.countDocuments(filter),
    ]);

    res.json({
      items,
      total,
      page:  pageNum,
      pages: Math.ceil(total / limitNum),
      limit: limitNum,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single item by ID
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('claims.user', 'name email');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Smart matches — find opposing-type items that may relate to this one
// @route   GET /api/items/:id/matches
// @access  Public
const getMatchesForItem = async (req, res) => {
  try {
    const source = await Item.findById(req.params.id);
    if (!source) return res.status(404).json({ message: 'Item not found' });

    const oppositeType = source.type === 'Lost' ? 'Found' : 'Lost';

    // Build a keyword OR filter from the source title + description
    const keywords = `${source.title} ${source.description}`;
    const regex    = keywordRegex(keywords);

    const filter = {
      type: oppositeType,
      _id:  { $ne: source._id },  // exclude self
      $or: [
        { category: source.category }, // same category (most important)
        ...(regex ? [
          { title:       regex },
          { description: regex },
        ] : []),
      ],
    };

    const matches = await Item.find(filter)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    // Score: same-category matches first
    const scored = matches
      .map(m => ({
        ...m.toObject(),
        _score: (m.category === source.category ? 10 : 0)
               + (regex && regex.test(m.title)       ? 5 : 0)
               + (regex && regex.test(m.description) ? 3 : 0)
               + (m.location.toLowerCase().includes(source.location.toLowerCase().split(',')[0]) ? 4 : 0),
      }))
      .sort((a, b) => b._score - a._score);

    res.json(scored);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new item report
// @route   POST /api/items
// @access  Private
const createItem = async (req, res) => {
  try {
    const { title, description, category, type, location, date } = req.body;

    if (!title || !description || !category || !type || !location || !date) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    let image = '';
    if (req.file) {
      try {
        const fileBuffer = fs.readFileSync(req.file.path);
        const base64Data = fileBuffer.toString('base64');
        image = `data:${req.file.mimetype};base64,${base64Data}`;
        // Clean up the local file
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error('Error converting file to base64:', err);
        image = `/uploads/${req.file.filename}`; // Fallback to local path if conversion fails
      }
    }

    const item = await Item.create({
      title, description, category, type, location, date, image,
      owner: req.user._id,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get items reported by the logged-in user
// @route   GET /api/items/mine
// @access  Private
const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Private (owner only)
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }
    await item.deleteOne();
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateItem = async (req, res) => res.status(501).json({ message: 'Not yet implemented' });

// @desc    Submit a claim for an item
// @route   POST /api/items/:id/claims
// @access  Private
const submitClaim = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Ensure item is open
    if (item.status !== 'Open') {
      return res.status(400).json({ message: 'This item is no longer open for claims' });
    }

    // Ensure user is not the owner
    if (item.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot claim your own reported item' });
    }

    // Check if user already submitted a pending claim
    const existingClaim = item.claims.find(c => c.user.toString() === req.user._id.toString());
    if (existingClaim && existingClaim.status === 'Pending') {
      return res.status(400).json({ message: 'You already have a pending claim for this item' });
    }

    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Claim message is required' });

    item.claims.push({
      user: req.user._id,
      message,
      status: 'Pending'
    });

    await item.save();

    // Notify the item owner
    await Notification.create({
      recipient: item.owner,
      message: `Someone has submitted a claim for your ${item.type} item: ${item.title}`,
      link: `/items/${item._id}`,
      type: 'NEW_CLAIM'
    });

    // Populate user info for the newly created claim before returning
    await item.populate('claims.user', 'name email');
    await item.populate('owner', 'name email');
    
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update claim status (Approve/Reject)
// @route   PATCH /api/items/:id/claims/:claimId
// @access  Private (Owner only)
const updateClaimStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to manage claims for this item' });
    }

    const claim = item.claims.id(req.params.claimId);
    if (!claim) return res.status(404).json({ message: 'Claim not found' });

    claim.status = status;

    if (status === 'Approved') {
      item.status = 'Resolved';
      
      // Notify the approved claimant
      await Notification.create({
        recipient: claim.user,
        message: `Your claim for "${item.title}" was approved! Check the case file for the owner's contact info.`,
        link: `/items/${item._id}`,
        type: 'CLAIM_APPROVED'
      });

      // Auto-reject other pending claims
      const rejectedPromises = item.claims.map(async (c) => {
        if (c._id.toString() !== claim._id.toString() && c.status === 'Pending') {
          c.status = 'Rejected';
          // Notify rejected claimant
          await Notification.create({
            recipient: c.user,
            message: `Your claim for "${item.title}" was rejected by the owner.`,
            link: `/items/${item._id}`,
            type: 'CLAIM_REJECTED'
          });
        }
      });
      await Promise.all(rejectedPromises);
    } else if (status === 'Rejected') {
      // Notify the directly rejected claimant
      await Notification.create({
        recipient: claim.user,
        message: `Your claim for "${item.title}" was rejected by the owner.`,
        link: `/items/${item._id}`,
        type: 'CLAIM_REJECTED'
      });
    }

    await item.save();
    await item.populate('claims.user', 'name email');
    await item.populate('owner', 'name email');

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getItems, getItemById, getMatchesForItem,
  createItem, getMyItems,
  updateItem, deleteItem,
  submitClaim, updateClaimStatus,
};
