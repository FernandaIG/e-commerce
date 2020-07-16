'use strict'
import express from 'express';
import { create, categoryById, read, update, remove, list } from '../controllers/category';
import { userById } from '../controllers/user';
import { requireSignin, isAuth, isAdmin } from '../controllers/auth';

const router = express.Router();

router.get('/category/:categoryId', read);
router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, create);
router.put('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, update);
router.delete('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, remove);
router.get('/categories', list);

router.param("categoryId", categoryById);
router.param("userId", userById);

module.exports = router;