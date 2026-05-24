import User from '../models/user.model.js';
import createError from '../utils/createError.js';

export const deleteUser = async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user) return next(createError(404, "User not found"));
    if (req.userId !== user._id.toString() && !req.isAdmin) {
        return next(createError(403, 'you can delete only your account'));
    }
    await User.findByIdAndDelete(req.params.id)
    res.status(200).send('deleted');
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return next(createError(404, "User not found"));
        res.status(200).send(user);
    } catch (error) {
        next(error);
    }
}

export const updateUser = async (req, res, next) => {
    try {
        if (req.userId !== req.params.id && !req.isAdmin) {
            return next(createError(403, 'you can update only your account'));
        }
        const { username, country, phone, img, desc } = req.body;
        const updates = {};
        if (username !== undefined) updates.username = username;
        if (country  !== undefined) updates.country  = country;
        if (phone    !== undefined) updates.phone     = phone;
        if (img      !== undefined) updates.img       = img;
        if (desc     !== undefined) updates.desc      = desc;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true }
        ).select("-password");
        if (!updatedUser) return next(createError(404, "User not found"));
        res.status(200).send(updatedUser);
    } catch (error) {
        next(error);
    }
}