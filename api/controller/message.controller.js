import createError from '../utils/createError.js';
import Message from '../models/message.model.js';
import Conversation from '../models/conversation.model.js'
export const createMessage = async(req, res, next) => {
    const conversationId = String(req.body.conversationId || "");
    if (!/^[a-f0-9]{48}$/i.test(conversationId)) {
        return next(createError(400, "Invalid conversation id"));
    }

    const conversation = await Conversation.findOne({ id: conversationId });
    if (!conversation) return next(createError(404, "Conversation not found"));
    if (
        conversation.sellerId !== req.userId &&
        conversation.buyerId !== req.userId &&
        !req.isAdmin
    ) {
        return next(createError(403, "Not authorized for this conversation"));
    }

    const newMessage = new Message({
        conversationId,
        userId: req.userId,
        desc: req.body.desc
    });
    try {
        const savedMessage=await newMessage.save();
        await Conversation.findOneAndUpdate({id:conversationId},{
            $set:{
                readBySeller: conversation.sellerId === req.userId,
                readByBuyer: conversation.buyerId === req.userId,
                lastMessage:req.body.desc,
            }
        },
        {new:true});res.status(201).send(savedMessage);
    } catch (err) {
        next(err)
    }
}
export const getMessages = async (req, res, next) => {

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
        const messages = await Message.find({
            conversationId: req.params.id
        });
        res.status(200).send(messages);
    } catch (err) {
        next(err)
    }
}