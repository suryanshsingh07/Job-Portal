const mongoose = require("mongoose");
const bcrypt=require("bcryptjs");

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    role:{type:String, enum:["jobseeker","employer"], required:true},
    avatar:String,
    resume:String,
    title: String,
    bio: String,
    skills: String,
    experience: String,
    githubUrl: String,
    portfolioUrl: String,
    companyName: String,
    companyDescription: String,
    companyLogo: String,
    phone: String,
    location: String,
    industry: String,
    teamSize: String,
    website: String,
},{timestamps: true});
userSchema.pre("save", async function (next){
    try{
        if(!this.isModified("password")) return;
        this.password=await bcrypt.hash(this.password, 10);
    } catch(error){
        next(error);
    }
});

userSchema.methods.matchPassword=function(enteredPassword){
    return bcrypt.compare(enteredPassword, this.password);
};

module.exports=mongoose.model("User",userSchema);