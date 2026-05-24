import express from "express";
import {createGig,deleteGig,updateGig,getGig,getGigs} from '../controller/gig.controller.js';
import {verifyToken} from '../middelware/jwt.js'
const router =express.Router();
router.post('/',verifyToken,createGig);
router.delete('/:id',verifyToken,deleteGig);
router.put('/:id',verifyToken,updateGig);
router.get('/single/:id',getGig);
router.get('/',getGigs);
export default router;