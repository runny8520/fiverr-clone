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