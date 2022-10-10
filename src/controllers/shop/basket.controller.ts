import {Request, Response} from "express";
import {userDB} from "../../db/shop/UserDB";

export const basketController = {
    //========== GET PRODUCTS FROM BASKET =========
    getProducts: (req: Request, res: Response) => {
        try {
            // @ts-ignore
            const userId = req.userId;
            const user = userDB.findByKeyAndValue("id", userId);
            if (!user) {
                return res.status(401).json({
                    status: 'error',
                    data: {},
                    message: 'Пользователь отсутствует в базе данных'
                });
            }
            res.json({
                status: 'ok',
                data: user.basket,
                message: ''
            });
        } catch (e) {
            res.status(500).json({
                status: 'error',
                data: {},
                message: 'Internal Server Error'
            })
        }
    },
    //========== ADD PRODUCT TO BASKET =========
    addProduct: (req: Request, res: Response) => {
        try {
            const productBasket = req.body.productBasket;
            // @ts-ignore
            const userId = req.userId;

            const user = userDB.findByKeyAndValue("id", userId);

            if (!user) {
                return res.status(401).json({
                    status: 'error',
                    data: {},
                    message: 'Пользователь отсутствует в базе данных'
                });
            }

            const productCandidateIndex = user.basket.findIndex(
                product => product.id === productBasket.id && product.selectedColor === productBasket.selectedColor
            )
            if (productCandidateIndex !== -1) {
                const productCandidate = user.basket[productCandidateIndex];
                if (productCandidate.quantityInBasket + productBasket.quantityInBasket > productCandidate.quantity) {
                    return res.status(400).json({
                        status: 'error',
                        data: {},
                        message: 'Maximum product count',
                        error: {
                            value: 'Maximum product count'
                        }
                    });
                }
            }
            userDB.addProductToBasket(userId, productBasket);

            res.json({
                status: 'ok',
                data: {},
                message: 'Product successfully added to basket'
            });

        } catch (e) {
            res.status(500).json({
                status: 'error',
                data: {},
                message: 'Internal Server Error'
            })
        }
    },
    //========== UPDATE PRODUCT FROM BASKET =========
    updateProduct: (req: Request, res: Response) => {
        try {
            // @ts-ignore
            const userId = req.userId;
            const user = userDB.findByKeyAndValue("id", userId);
            if (!user) {
                return res.status(401).json({
                    status: 'error',
                    data: {},
                    message: 'Пользователь отсутствует в базе данных'
                });
            }
            const {productInBasketId, count} = req.body;

            userDB.updateProductBasketCount(userId, productInBasketId, count);

            res.json({
                status: 'ok',
                data: {},
                message: 'Product successfully updated'
            });

        } catch (e) {
            res.status(500).json({
                status: 'error',
                data: {},
                message: 'Internal Server Error'
            })
        }
    },
    //========== DELETE PRODUCT FROM BASKET =========
    deleteProduct: (req: Request, res: Response) => {
        try {
            // @ts-ignore
            const userId = req.userId;
            const user = userDB.findByKeyAndValue("id", userId);
            if (!user) {
                return res.status(401).json({
                    status: 'error',
                    data: {},
                    message: 'Пользователь отсутствует в базе данных'
                });
            }
            const productInBasketId = req.params.id;

            userDB.deleteProductFromBasket(userId, productInBasketId);

            res.json({
                status: 'ok',
                data: {},
                message: 'Product successfully deleted'
            });

        } catch (e) {
            res.status(500).json({
                status: 'error',
                data: {},
                message: 'Internal Server Error'
            })
        }
    },
};