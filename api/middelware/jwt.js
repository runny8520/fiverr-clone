import Jwt from 'jsonwebtoken';
import createError from '../utils/createError.js';
export const verifyToken=async(req,res,next)=>{
    
    const token = req.cookies.accessToken;
    if (!token) return next(createError(401,'you are not authcaticated'));
    
    Jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
        if (err) return next(createError(403,'token is not valid'));
        req.userId=payload.id;
        req.isSeller=payload.isSeller;
        req.isAdmin=payload.isAdmin;
        next()//go to deleteUser
    })
}

export const verifyAdmin = (req, res, next) => {
    if (!req.isAdmin) return next(createError(403, "Admin access required"));
    next();
}