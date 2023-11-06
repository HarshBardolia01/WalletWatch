import {Router} from "express";
import * as controller from "../controller/transaction-controller.js"

const router = Router();

router.post(
    "/create",
    controller.create
);

router.post(
    "/getAllTransaction",
    controller.getAllTransactions
);

router.put(
    "/updateById/:id",
    controller.updateTransaction
);

router.delete(
    "/deteleById/:id",
    controller.deleteTransaction
);

export default router;