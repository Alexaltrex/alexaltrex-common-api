import {Request, Response} from "express";
import {productDB} from "../../db/shop/ProductDB";
import {arraysIsIntersected, elementsPerPage} from "../../helpers/helpers";
import {IGetProductsQuery} from "../../interfaces/shop-interfaces";
import {categoryDB} from "../../db/shop/CategoryDB";
import {userDB} from "../../db/shop/UserDB";

export const productController = {
    //========== GET PRODUCTS =========
    getProducts: (req: Request<any, any, any, IGetProductsQuery>, res: Response) => {
        try {
            const {sort, query, categoryId, available, brands, page, colors, priceMin, priceMax} = req.query;
            const products = productDB.getAll();

            let filteredProducts = products.filter(product => {
                const boolQuery = query ? (new RegExp(query)).test(product.title) : true;
                const boolCategory = categoryId ? product.category.id === categoryId : true;
                const boolAvailable = available && available !== 'all' ? product.available === (available === 'true') : true;
                const boolBrands = brands ? brands.split(',').includes(product.brand) : true;
                const boolColors = colors ? arraysIsIntersected(colors.split(',').map(c => '#' + c), product.colors) : true;
                const boolPrice = (priceMin && priceMax) ? (product.price >= Number(priceMin) && product.price <= Number(priceMax)) : true;
                return boolCategory && boolAvailable && boolBrands && boolColors && boolPrice && boolQuery;
            });

            if (sort === 'priceUp' || sort === 'priceDown' ) {
                const compareFactor = sort === 'priceUp' ? 1 : -1;
                filteredProducts = filteredProducts.sort((productA, productB) => {
                    if (productA.price < productB.price) { return -1 * compareFactor }
                    if (productA.price > productB.price) { return 1 * compareFactor }
                    return 0
                })
            }

            if (sort === 'ratingUp' || sort === 'ratingDown' ) {
                const compareFactor = sort === 'ratingUp' ? 1 : -1;
                filteredProducts = filteredProducts.sort((productA, productB) => {
                    if (Number(productA.rate) < Number(productB.rate)) { return -1 * compareFactor }
                    if (Number(productA.rate) > Number(productB.rate)) { return 1 * compareFactor }
                    return 0
                })
            }

            const pageFinal = page ? Number(page) : 1;
            const pageCount = Math.ceil(filteredProducts.length / elementsPerPage);
            const productPart = filteredProducts.slice((pageFinal - 1) * elementsPerPage).slice(0, elementsPerPage);

            res.json({
                status: 'ok',
                data: {
                    pageCount,
                    products: productPart
                },
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
    //========== GET BY CATEGORY ID =========
    getByCategoryId: (req: Request, res: Response) => {
        try {
            const categoryId = req.params.id;
            const category = categoryDB.getById(categoryId);
            const productsIdArray = category.products;
            const products = productsIdArray.map(productId => productDB.getById(productId));

            res.json({
                status: 'ok',
                data: products,
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
    //========== UPDATE =========
    update: (req: Request, res: Response) => {
       try {
           const {id , update} = req.body;
           productDB.update(id , update);
           res.json({
               status: 'ok',
               data: null,
               message: 'Product update'
           });
       } catch (e) {
           res.status(500).json({
               status: 'error',
               data: {},
               message: 'Internal Server Error'
           })
       }
    },
    //========== CREATE =========
    create: (req: Request, res: Response) => {
        try {
            const {categoryId, update} = req.body;
            // проверка на уникальность title
            const candidateByTitle = productDB.findByTitle(update.title)

            if (candidateByTitle) {
                return res.status(401).json({
                    status: 'error',
                    data: {},
                    message: 'Product with this title already exists',
                    error: {
                        field: 'title',
                        value: 'Product with this title already exists'
                    }
                });
            }

            productDB.add(categoryId, update);

            res.json({
                status: 'ok',
                data: null,
                message: 'Product create'
            });
        } catch (e) {
            res.status(500).json({
                status: 'error',
                data: {},
                message: 'Internal Server Error'
            })
        }
    },
    //============== DELETE ===============
    delete: (req: Request, res: Response) => {
        try {
            const id = req.params.id;

            // проверка на существование
            const productById = productDB.getById(id);
            if (!productById) {
                return res.status(401).json({
                    status: 'error',
                    data: {},
                    message: 'Product does not exist',
                    error: {
                        value: 'Product does not exist'
                    }
                });
            }

            // удаление продукта
            productDB.delete(id);

            // удаление ид продукта из массива category.products
            categoryDB.removeProductFromCategory(productById.category.id, id);

            res.json({
                status: 'ok',
                data: null,
                message: 'Product delete'
            });

        } catch (e) {
            res.status(500).json({
                status: 'error',
                data: {},
                message: 'Internal Server Error'
            })
        }
    },
    //========== GET PRODUCT BY ID =========
    getProductById: (req: Request, res: Response) => {
        try {
            const productId = req.params.id;
            const product = productDB.getById(productId);
            res.json({
                status: 'ok',
                data: product,
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
    //========== GET MIN MAX PRICE =========
    getMinMaxPrice: (req: Request, res: Response) => {
        try {
            const products = productDB.getAll();
            let priceMin = products[0].price;
            let priceMax = products[0].price;
            products.forEach(el => {
               if (el.price > priceMax) {
                   priceMax = el.price;
               }
                if (el.price < priceMin) {
                    priceMin = el.price;
                }
            });
            res.json({
                status: 'ok',
                data: {
                    priceMin,
                    priceMax,
                },
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
    //============== GET RATED PRODUCTS ==================
    async getRatedProducts(req: Request, res: Response) {
        try {
            // @ts-ignore
            const user = userDB.findByKeyAndValue("id", req.userId);
            if (!user) {
                return res.status(401).json({
                    status: 'error',
                    data: {},
                    message: 'Пользователь отсутствует в базе данных'
                });
            }
            res.json({
                status: 'ok',
                data: user.ratedProducts,
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
    //============== ADD REVIEW OF PRODUCT ==================
    async reviewProduct(req: Request, res: Response) {
        try {
            const {productId, rating, review} = req.body;
            // @ts-ignore
            const userId = req.userId;
            // @ts-ignore
            const userName = req.login;
            console.log(userName)
            // добавляем в user
            userDB.addRatedProduct(userId, productId, rating);
            // добавляем в product
            productDB.addReview({productId, rating, review, userName});

            res.json({
                status: 'ok',
                data: {},
                message: 'Product is reviewed'
            });

        } catch (e) {
            res.status(500).json({
                status: 'error',
                data: {},
                message: 'Internal Server Error'
            })
        }
    }
};