"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductHandler = exports.getProductHandler = exports.updateProductHandler = exports.createProductHandler = void 0;
const product_services_1 = require("../service/product.services");
const lodash_1 = require("lodash");
function createProductHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userID = res.locals.user._id;
            const body = req.body;
            yield (0, product_services_1.createProduct)(Object.assign(Object.assign({}, body), { user: userID }));
            return res.status(200).json("product created");
        }
        catch (e) {
            return res.status(500).json(e.message);
        }
    });
}
exports.createProductHandler = createProductHandler;
function updateProductHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userID = res.locals.user._id;
            const productId = (0, lodash_1.get)(req.params, "productId");
            const product = yield (0, product_services_1.findProduct)({ productId });
            if (!product)
                return res.status(404).json("product not found");
            if (String(product.user) !== userID)
                return res.status(403).json("Access denied");
            yield (0, product_services_1.findAndUpdateProduct)({ productId }, req.body, { new: true });
            return res.status(200).json("product updated");
        }
        catch (e) {
            return res.status(500).json(e.message);
        }
    });
}
exports.updateProductHandler = updateProductHandler;
function getProductHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const productId = req.params.productId;
            const product = yield (0, product_services_1.findProduct)({ productId });
            if (!product)
                return res.status(404).json("product not found");
            return res.status(200).json(product);
        }
        catch (e) {
            return res.status(500).json(e.message);
        }
    });
}
exports.getProductHandler = getProductHandler;
function deleteProductHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const productId = req.params.productId;
            const userID = res.locals.user._id;
            const product = yield (0, product_services_1.findProduct)({ productId });
            if (!product)
                return res.status(404).json("product not found");
            if (String(product.user) !== userID)
                return res.status(403).json("Access denied");
            yield (0, product_services_1.deleteProduct)({ productId });
            return res.status(200).json("product deleted");
        }
        catch (e) {
            return res.status(500).json(e.message);
        }
    });
}
exports.deleteProductHandler = deleteProductHandler;
