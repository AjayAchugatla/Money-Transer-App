import mongoose, { Schema } from "mongoose"


const bankSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

const Account = mongoose.model('Bank', bankSchema);
export default Account;
