import Conversation from '../models/conversation.model.js'
import createError from '../utils/createError.js';
export const createConversation = async (req, res, next) => {
    if (!req.body.to) return next(createError(400, "Receiver id is required"));
    if (req.body.to === req.userId) return next(createError(400, "Invalid receiver"));

    const conversationId = req.isSeller ? req.userId + req.body.to : req.body.to + req.userId;
    const existingConversation = await Conversation.findOne({ id: conversationId });
    if (existingConversation) return res.status(200).send(existingConversation);

    const newconversation = new Conversation({
        id: conversationId,
        sellerId: req.isSeller ? req.userId : req.body.to,
        buyerId: req.isSeller ? req.body.to : req.userId,
        readBySeller: req.isSeller,
        readByBuyer: !req.isSeller,
    });
    try {
        const savedConversation = await newconversation.save();
        res.status(201).send(savedConversation);
    } catch (err) {
        next(err)
    }
}
export const updateConversation = async (req, res, next) => {
    
    try {
        const conversation = await Conversation.findOne({ id: req.params.id });
        if (!conversation) return next(createError(404, "Conversation not found"));
        if (
            conversation.sellerId !== req.userId &&
            conversation.buyerId !== req.userId &&
            !req.isAdmin
        ) {
            return next(createError(403, "Not authorized for this conversation"));
        }

        const updatedConversation = await Conversation.findOneAndUpdate(
          { id: req.params.id },
          {
            $set: {
            //   readBySeller: false,
            //   readByBuyer: true,
             ...(req.isSeller ? { readBySeller: true } : { readByBuyer: true }),
             
            },
          },
          { new: true }
        );
    
        res.status(200).send(updatedConversation);
      } catch (err) {
        next(err);
      }
}
export const getSingleConversation = async (req, res, next) => {
    try {
        const conversation = await Conversation.findOne({ id: req.params.id });
       if (!conversation) {
        return next(createError(404,"not found"));
       }
       if (
        conversation.sellerId !== req.userId &&
        conversation.buyerId !== req.userId &&
        !req.isAdmin
       ) {
        return next(createError(403, "Not authorized for this conversation"));
       }
        res.status(200).send(conversation);
    } catch (err) {
        next(err)
    }
}
export const getConversations = async (req, res, next) => {

    try {
        const conversations = await Conversation.find(
            req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }
        ).sort({updatedAt:-1});
        res.status(200).send(conversations);
    } catch (err) {
        next(err)
    }
}
