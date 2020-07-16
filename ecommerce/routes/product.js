'use strict'
import express from 'express';
import {
    create,
    productById,
    read,
    remove,
    update,
    list,
    listRelated,
    listCategories,
    listBySearch,
    photo
} from '../controllers/product';
import { userById } from '../controllers/user';
import { requireSignin, isAuth, isAdmin } from '../controllers/auth';

const router = express.Router();

router.get('/product/:productId', read);
router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create);
router.delete('/product/:productId/:userId', requireSignin, isAuth, isAdmin, remove);
router.put('/product/:productId/:userId', requireSignin, isAuth, isAdmin, update);
router.get('/products/related/:productId', listRelated);
router.get('/products/categories', listCategories);
router.post('/products/by/search', listBySearch);
router.get('/product/photo/:productId', photo);
router.get('/products', list);


// parameters of the routes
router.param("userId", userById);
router.param("productId", productById);

module.exports = router;