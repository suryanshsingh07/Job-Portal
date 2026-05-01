const fs=require('fs');
const path=require('path');
const User = require('../models/User');

exports.updateProfile=async(req, res, next)=>{
    try{
        const {name, avatar, resume, companyName, companyDescription, companyLogo, phone, location, industry, teamSize, website, title, bio, skills, experience, githubUrl, portfolioUrl}=req.body;
        const user=await User.findById(req.user._id);
        if (!user) return res.status(404).json({message: "user not found"});
        if (name !== undefined) user.name = name;
        if (avatar !== undefined) user.avatar = avatar;
        if (resume !== undefined) user.resume = resume;
        if (phone !== undefined) user.phone = phone;
        if (location !== undefined) user.location = location;
        if (bio !== undefined) user.bio = bio;

        if (user.role === "jobseeker"){
            if (title !== undefined) user.title = title;
            if (skills !== undefined) user.skills = skills;
            if (experience !== undefined) user.experience = experience;
            if (githubUrl !== undefined) user.githubUrl = githubUrl;
            if (portfolioUrl !== undefined) user.portfolioUrl = portfolioUrl;
        }

        if (user.role === "employer"){
            if (companyName !== undefined) user.companyName = companyName;
            if (companyDescription !== undefined) user.companyDescription = companyDescription;
            if (companyLogo !== undefined) user.companyLogo = companyLogo;
            if (industry !== undefined) user.industry = industry;
            if (teamSize !== undefined) user.teamSize = teamSize;
            if (website !== undefined) user.website = website;
        }
        await user.save();
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar || "",
            role: user.role,
            phone: user.phone || "",
            location: user.location || "",
            companyName: user.companyName || "",
            companyDescription: user.companyDescription || "",
            companyLogo: user.companyLogo || "",
            industry: user.industry || "",
            teamSize: user.teamSize || "",
            website: user.website || "",
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
}

exports.deleteResume=async(req, res, next)=>{
    try{
        const {resumeUrl}=req.body;

        const fileName=resumeUrl?.split('/')?.pop();
        const user=await User.findById(req.user._id);
        if(!user) return res.status(404).json({message: "User not found"});
        if (user.role!=="jobseeker"){
            return res.status(403).json({message: "only jobseekers can delete resume"});
        }

        const filePath=path.join(__dirname,'../uploads', fileName);

        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath);
        }

        user.resume= "";
        await user.save();
        res.json({message: "Resume deleted successfully"});
    }catch(error){
        next(error);
    }
}

exports.getPublicProfile=async(req, res, next)=>{
    try{
        const user = await User.findById(req.params.id).select("-password");
        if(!user) return res.status(404).json({message: "User not found"});
        res.json(user);
    }catch(error){
        next(error);
    }
}

