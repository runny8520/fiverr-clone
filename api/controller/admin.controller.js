import User from "../models/user.model.js";
import Gig from "../models/gig.model.js";
import Order from "../models/order.model.js";
import Review from "../models/review.model.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const getAdminStats = async (req, res, next) => {
  try {
    const [users, sellers, gigs, orders, reviews, conversations, messages] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ isSeller: true }),
        Gig.countDocuments(),
        Order.countDocuments(),
        Review.countDocuments(),
        Conversation.countDocuments(),
        Message.countDocuments(),
      ]);

    res.status(200).send({
      users,
      sellers,
      gigs,
      orders,
      reviews,
      conversations,
      messages,
    });
  } catch (err) {
    next(err);
  }
};

export const getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(100);
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};
