import mongoose from 'mongoose';

export interface UserInterface {
    _id?: string,
    name: string;
    email: string;
    password: string;
    refreshToken?: string[];
}

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    refreshToken:{
        type: Array,
        default: []
    }
    });

const User = mongoose.model('User', userSchema);
export default User;