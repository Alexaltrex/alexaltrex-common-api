import {IBrand, ICategories, IProducts, IRating} from "../../interfaces/shop-interfaces";
import {articleCreate, generateBoolean, generateColors, getRandomIntInclusive, getRate, id} from "../../helpers/helpers";
import {productDB} from "./ProductDB";
import {brandDB} from "./BrandDB";
import {categoryDB} from "./CategoryDB";

export const _populateDB = (
    categoryCount: number, // количество категорий
    productCount: number, // количество товаров в категории
    brandCount: number, // количество брендов
    quantity = 20 // максимальное количество товара
) => {
    // заполнение brandDB
    const brands: IBrand[] = [];
    for (let i = 0; i < brandCount; i++) {
        brands.push(`Brand ${i + 1}`)
    }

    // заполнение categoryDB и productDB
    const categories: ICategories = {}
    const products: IProducts = {}

    for (let i = 0; i < categoryCount; i++) {
        const categoryId = id();
        categories[categoryId] = {
            id: categoryId,
            title: `Category ${i + 1}`,
            products: []
        };
        const category = categories[categoryId];
        for (let j = 0; j < productCount; j++) {
            const productId = id();
            category.products.push(productId);

            const rating: IRating = {}
            for (let i = 1; i <= 5; i++) {
                rating[String(i)] = getRandomIntInclusive(0, 50);
            }

            const rate = getRate(rating)

            products[productId] = {
                id: productId,
                title: `Product ${productCount * i + j}`,
                category: {
                    id: category.id,
                    title: category.title
                },
                article: articleCreate(),
                available: generateBoolean(),
                quantity: getRandomIntInclusive(1, quantity),
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vulputate.',
                price: getRandomIntInclusive(1, 100),
                weight: getRandomIntInclusive(1, 20),
                colors: generateColors(),
                brand: brands[getRandomIntInclusive(0, brandCount - 1)],
                rating,
                rate,
                reviews: []
            }
        }
    }
    return {brands, products, categories}
};