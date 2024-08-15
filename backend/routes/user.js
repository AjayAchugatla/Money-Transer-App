import express from "express";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { z } from "zod"
import User from "../models/UserModel.js"
import Account from "../models/BankModel.js"
import authMiddleware from "../middleware.js"


const saltRounds = 10;
const router = express.Router();

const signupSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string(),
})

const signinSchema = z.object({
    email: z.string().email(),
    password: z.string(),
})

const updateSchema = z.object({
    password: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
})



router.post('/signup', async (req, res) => {
    const userInfo = req.body
    const infoVerify = signupSchema.safeParse(userInfo)
    try {

        if (!infoVerify.success) {
            return res.json({
                error: "Invalid inputs"
            })
        }
        const user = await User.findOne({
            email: userInfo.email
        })
        if (user) {
            return res.status(411).json({
                error: "User already exists. Sign in"
            })
        }

        const hashedPassword = await bcrypt.hash(userInfo.password, saltRounds)
        const newUser = await User.create({
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email,
            password: hashedPassword,
        })
        const userId = newUser._id;
        const token = jwt.sign({
            userId
        }, process.env.JWT_SECRET)

        const bal = 1 + Math.random() * 10000
        await Account.create({
            userId,
            balance: bal.toFixed(2),
        })

        res.status(200).json({
            message: "User created successfully",
            token: token
        })
    } catch (error) {
        res.json({
            error: "Internal Server Error"
        })
    }
})


router.post('/signin', async (req, res) => {
    const userInfo = req.body
    const infoVerify = signinSchema.safeParse(userInfo)
    if (!infoVerify.success) {
        return res.json({
            error: "Invalid Inputs"
        })
    }
    try {

        const user = await User.findOne({
            email: userInfo.email
        })

        if (user) {
            const pwdCheck = await bcrypt.compare(userInfo.password, user.password)
            if (!pwdCheck) {
                return res.json({
                    error: "Incorrect Password"
                })
            }
            const token = jwt.sign({
                userId: user._id,
            }, process.env.JWT_SECRET)

            res.status(200).json({
                token: token
            })
        } else {
            return res.json({
                error: "User not found"
            })
        }
    } catch (error) {
        res.json({
            error: "Internal Server Error"
        })
    }

})

router.put('/', authMiddleware, async (req, res) => {
    const info = req.body
    const verify = updateSchema.safeParse(info)
    if (!(verify.success)) {
        return res.json({
            error: "Invalid Input"
        })
    }
    const userId = req.userId
    const user = await User.findOne({
        _id: userId
    })

    if (user) {
        const passverify = await bcrypt.compare(info.current, user.password)
        if (passverify) {
            try {
                const up = await User.updateOne({ _id: userId }, info)
                return res.json({
                    message: "Updated successfully"
                })
            } catch (error) {
                return res.status(200).json({
                    error: "Error while updating information"
                })
            }
        } else {
            return res.json({
                error: "Incorrect Password"
            })
        }
    } else {
        return res.json({
            error: "User not found"
        })
    }


})


router.get('/bulk', authMiddleware, async (req, res) => {
    const filter = req.query.filter || "";
    let users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter,
                "$options": "i"
            }
        }, {
            lastName: {
                "$regex": filter,
                "$options": "i"
            }
        }]
    })

    users = users.filter((user) => (
        user._id != req.userId
    ))
    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})


router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.userId
        }).select('-password -_id -__v');
        if (user) {
            return res.json({
                userInfo: user
            })
        } else {
            return res.json({
                error: "User Not found"
            })
        }
    } catch (error) {
        res.json({
            error: "Internal Server Error!"
        })
    }
})


router.delete('/', authMiddleware, async (req, res) => {
    const pwd = req.body.password;
    try {
        const user = await User.findOne({
            _id: req.userId
        })

        if (user) {
            const pwdCheck = await bcrypt.compare(pwd, user.password)
            if (!pwdCheck) {
                return res.json({
                    error: "Incorrect Password"
                })
            }
            const resp = await User.deleteOne({
                _id: req.userId
            })
            if (resp.acknowledged) {
                return res.json({
                    message: "Account deletion Successful"
                })
            } else {
                return res.json({
                    error: "Account deletion Failed"
                })
            }
        } else {
            return res.json({
                error: "User not found"
            })
        }
    } catch (error) {
        res.json({
            error: "Internal Server Error"
        })
    }
})

export default router