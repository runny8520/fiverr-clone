import express from "express";
import {deleteUser,getUser,updateUser} from '../controller/user.controller.js'
import { verifyToken } from "../middelware/jwt.js";

const router =express.Router();
router.delete('/:id',verifyToken,deleteUser);
router.get('/:id',getUser);
router.put('/:id',verifyToken,updateUser);
export default router;