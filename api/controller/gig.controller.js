import Gig from '../models/gig.model.js';
import createError from '../utils/createError.js';
export const createGig = async (req, res, next) => {
  if (req.isSeller === false) { return next(createError(403, 'Only Seller Create a Gig')); }

  const newGig = new Gig({
    userId: req.userId,
    ...req.body
  })
  try {
    const savedGig = await newGig.save();
    res.status(201).json(savedGig);
  } catch (error) {
    next(error);
  }
};

export const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return next(createError(404, "Gig not found"));
    if (gig.userId !== req.userId && !req.isAdmin) return next(createError(403, 'you can delete your gig'));
    await Gig.findByIdAndDelete(req.params.id);
    res.status(200).send('gig has been deleted');
  } catch (err) {
    next(err);
  }
};

export const updateGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return next(createError(404, "Gig not found"));
    if (gig.userId !== req.userId && !req.isAdmin) return next(createError(403, 'you can update only your gig'));
    const updatedGig = await Gig.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedGig);
  } catch (err) {
    next(err);
  }
};

export const getGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return next(createError(404, 'Gig not found'));
    res.status(200).send(gig);
  } catch (err) {
    next(err);
  }
};

export const getGigs = async (req, res, next) => {
  const q = req.query;
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.cat && { cat: q.cat }),
    ...((q.min || q.max) && {
      price: {
        ...(q.min && { $gte: q.min }),
        ...(q.max && { $lte: q.max }),
      },
    }),
    ...(q.search && { title: { $regex: escapeRegex(q.search), $options: "i" } }),
  };
  try {
    const page = parseInt(q.page) || 1;
    const limit = parseInt(q.limit) || 20;
    const skip = (page - 1) * limit;

    const [gigs, total] = await Promise.all([
      Gig.find(filters).sort({ [q.sort || 'sales']: -1 }).skip(skip).limit(limit),
      Gig.countDocuments(filters),
    ]);
    res.status(200).json({ gigs, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};
