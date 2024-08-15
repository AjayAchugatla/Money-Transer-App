import { Router } from "express";
import authMiddleware from "../middleware.js";
import Account from "../models/BankModel.js"
import mongoose from "mongoose";
const router = Router();

router.get('/balance', authMiddleware, async (req, res) => {
    try {
        const acc = await Account.findOne({
            userId: req.userId
        })
        res.json({
            balance: acc.balance
        })
    } catch (error) {
        res.status(400).json({
            message: "Error while getting Balance"
        })
    }
})

router.post('/transfer', authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    const { amount, to } = req.body;

    session.startTransaction()

    const acc = await Account.findOne({
        userId: req.userId
    }).session(session)

    if (!acc || acc.balance < amount) {
        await session.abortTransaction();
        return res.json({
            error: "Insufficient Balance"
        })
    }

    const toAcc = await Account.findOne({
        userId: to
    }).session(session)

    if (!toAcc) {
        await session.abortTransaction();
        return res.json({
            error: "Invalid Sender Account"
        })
    }

    await Account.updateOne({
        userId: req.userId
    },
        {
            $inc: {
                balance: -amount
            }
        }
    ).session(session)

    await Account.updateOne({
        userId: to
    },
        {
            $inc: {
                balance: amount
            }
        }
    ).session(session)

    await session.commitTransaction();
    res.json({
        message: "Transaction Successful"
    })
})
export default router