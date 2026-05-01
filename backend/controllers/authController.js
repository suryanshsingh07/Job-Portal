const User=require("../models/User");
const jwt=require("jsonwebtoken");
const generateToken=(id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "60d"});
};
exports.register=async(req, res, next)=>{
    try{
        const {name, email, password, avatar, role}=req.body;
        const userExists=await User.findOne({email});
        if(userExists) return res.status(400).json({message:"User already exists"});
        const user = await User.create({name, email, password, role, avatar});
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar || "",
            role: user.role,
            token: generateToken(user._id),
            companyName: user.companyName || "",
            companyDescription: user.companyDescription || "",
            companyLogo: user.companyLogo || "",
            industry: user.industry || "",
            teamSize: user.teamSize || "",
            website: user.website || "",
            phone: user.phone || "",
            location: user.location || "",
            resume: user.resume || "",
            title: user.title || "",
            bio: user.bio || "",
            skills: user.skills || "",
            experience: user.experience || "",
            githubUrl: user.githubUrl || "",
            portfolioUrl: user.portfolioUrl || ""
        });
    }catch(err){
        next(err);
    }
};
exports.login=async(req, res, next)=>{
    try{
        const {email, password}=req.body;
        const user=await User.findOne({email});
        if(!user || !(await user.matchPassword(password))) return res.status(401).json({message:"Invalid email or password"});
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
            avatar: user.avatar || "",
            companyName: user.companyName || "",
            companyDescription: user.companyDescription || "",
            companyLogo: user.companyLogo || "",
            industry: user.industry || "",
            teamSize: user.teamSize || "",
            website: user.website || "",
            phone: user.phone || "",
            location: user.location || "",
            resume: user.resume || "",
            title: user.title || "",
            bio: user.bio || "",
            skills: user.skills || "",
            experience: user.experience || "",
            githubUrl: user.githubUrl || "",
            portfolioUrl: user.portfolioUrl || ""
        });
    }catch(err){
        next(err);
    }

};
exports.getMe=async(req,res)=>{
    res.json(req.user);
};