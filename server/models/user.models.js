import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minLength:[6, "Email must be at least 6 characters long"],
        maxLength:[55, "Email must be less than 55 characters long"],
        match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"]
    },
    password:{
        type:String,
        required:true,
        select:false,
    }
});

userSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password, 10);
}

userSchema.methods.isValidPassword = async function(password){
    console.log("Comparing password:", password, "with hash:", this.password);
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAuthToken = function(){
    return jwt.sign({email: this.email}, process.env.JWT_SECRET, { expiresIn: "24h" });
}

const User = mongoose.model("User", userSchema);

export default User;