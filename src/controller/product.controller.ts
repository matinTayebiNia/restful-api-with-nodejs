import {Request, Response} from "express"
import {createProduct, deleteProduct, findAndUpdateProduct, findProduct} from "../service/product.services";
import {createProductInput, deleteProductInput, getProductInput, updateProductInput} from "../schema/product.schema";
import {get} from "lodash"

export async function createProductHandler(
    req: Request<{}, {}, createProductInput["body"]>
    , res: Response) {
    try {
        const userID = res.locals.user._id;
        const body = req.body;
        await createProduct({...body, user: userID})
        return res.status(200).json("product created")
    } catch (e: any) {
        return res.status(500).json(e.message)
    }
}

export async function updateProductHandler(req: Request<updateProductInput["params"], {}, updateProductInput["body"]>, res: Response) {
    try {
        const userID = res.locals.user._id
        const productId = get(req.params, "productId")
        const product = await findProduct({productId})
        if (!product) return res.status(404).json("product not found")
        if (String(product.user) !== userID) return res.status(403).json("Access denied")
        await findAndUpdateProduct({productId}, req.body, {new: true});
        return res.status(200).json("product updated");
    } catch (e: any) {
        return res.status(500).json(e.message);
    }
}

export async function getProductHandler(req: Request<getProductInput["params"]>, res: Response) {
    try {
        const productId = req.params.productId;
        const product = await findProduct({productId});
        if (!product) return res.status(404).json("product not found")
        return res.status(200).json(product);
    } catch (e: any) {
        return res.status(500).json(e.message);
    }
}

export async function deleteProductHandler(req: Request<deleteProductInput["params"]>, res: Response) {
    try {
        const productId = req.params.productId
        const userID = res.locals.user._id
        const product = await findProduct({productId})
        if (!product) return res.status(404).json("product not found")
        if (String(product.user) !== userID) return res.status(403).json("Access denied")
        await deleteProduct({productId})
        return res.status(200).json("product deleted");
    } catch (e: any) {
        return res.status(500).json(e.message)
    }
}