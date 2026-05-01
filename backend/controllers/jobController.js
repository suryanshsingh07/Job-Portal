const Job = require("../models/Job");
const User = require("../models/User");
const Application = require("../models/Application");
const SavedJob = require("../models/SavedJob");
exports.createJob=async(req,res)=>{
    try{
        if (req.user.role !== "employer"){
            return res.status(403).json({message: "only employers can post jobs"});
        }
        const job=await Job.create({...req.body, company: req.user._id});
        res.status(201).json(job);
    }catch(err){
        res.status(500).json({message: err.message});
    }
};

exports.getJobs=async(req,res)=>{
    const {keyword,location,category,type,minSalary,maxSalary,userId}=req.query;
    const query = {
        isClosed:false,
        ...(keyword && {title:{$regex: keyword, $options: "i"}}),
        ...(location && {location:{$regex: location, $options: "i"}}),
        ...(category && {category}),
        ...(type && {type}),
    };
    if (minSalary ||maxSalary){
        query.$and=[];
        if (minSalary){
            query.$and.push({salaryMax:{$gte: Number(minSalary)}});
        }
        if (maxSalary){
            query.$and.push({salaryMin:{$lte: Number(maxSalary)}});
        }
        if (query.$and.length === 0){
            delete query.$and;
        }
    }
    try{
        const jobs = await Job.find(query).populate("company","name companyName companyLogo website companyDescription industry teamSize");
        let SavedJobIds=[];
        let appliedJobStatusMap={};
        if(!userId){
            const savedJobs=await SavedJob.find({jobseeker: userId}).select("job");
            SavedJobIds=savedJobs.map((s)=>String(s.job));
            const applications = await Application.find({applicant: userId}).select("job status");
            applications.forEach((app)=>{
                appliedJobStatusMap[String(app.job)]=app.status;
            });
            const jobsWithExtras=jobs.map((job)=>{
                const jobIdStr=String(job._id);
                return{
                    ...job.toObject(),
                    isSaved: SavedJobIds.includes(jobIdStr),
                    applicationStatus: appliedJobStatusMap[jobIdStr] || null,
                };
            });
            res.json(jobsWithExtras);
        }
    }catch(err){
        res.status(500).json({message: err.message});
    }
};
exports.getJobsEmployer=async(req, res)=>{
    try{
        const userId=req.user._id;
        const {role}=req.user;
        if (role!=="employer"){
            return res.status(403),json({message: "Access denied"});
        }
        const jobs=await Job.find({company: userId})
        .populate("company", "name companyName companyLogo website companyDescription industry teamSize")
        .lean();
        const jobsWithExtras = await Promise.all(
            jobs.map(async (job) => {
                const applications = await Application.find({ job: job._id }).select("status");
                
                const stats = {
                  total: applications.length,
                  applied: applications.filter(a => (a.status || 'pending').toLowerCase() === 'pending' || (a.status || '').toLowerCase() === 'applied').length,
                  inReview: applications.filter(a => (a.status || '').toLowerCase() === 'in review').length,
                  shortlisted: applications.filter(a => (a.status || '').toLowerCase() === 'shortlisted').length,
                  rejected: applications.filter(a => (a.status || '').toLowerCase() === 'rejected').length,
                  accepted: applications.filter(a => (a.status || '').toLowerCase() === 'accepted').length
                };

                return {
                    ...job,
                    applicationCount: stats.total,
                    applicationsCount: stats.total, // frontend uses plural
                    stats
                };
            })
        );
        res.json(jobsWithExtras);
    }catch(err){
        res.status(500).json({message: err.message});
    }
    
};
exports.getJobsById=async(req, res)=>{
    try{
        const {userId}=req.query;
        const jobs=await Job.findById(req.params.id).populate("company", "name companyName companyLogo website companyDescription industry teamSize");
        if (!jobs){
            return res.status(404).json({message: "job not found"});
        }
        let applicationStatus=null;
        if(userId){
            const application = await Application.findOne({
                job:jobs._id,
                applicant: userId,
            }).select("status");
            if(application){
                applicationStatus=application.status;
            }
        }
        res.json({
            ...jobs.toObject(),
            applicationStatus,
        });
    }catch(err){
        res.status(500).json({message: err.message});
    }
};
exports.updateJob=async(req, res)=>{
    try{
        const jobs=await Job.findById(req.params.id);
        if (!jobs){
            return res.status(404).json({message: "job not found"});
        }
        if (jobs.company.toString()!==req.user._id.toString()){
            return res
            .status(403)
            .json({message: "Not authorized to update this job"});
        }
        Object.assign(jobs, req.body);
        const updated = await jobs.save();
        res.json(updated);
    }catch(err){
        res.status(500).json({message: err.message});
    }
};
exports.deleteJob=async(req, res)=>{
    try{
        const jobs=await Job.findById(req.params.id);
        if (!jobs){
            return res.status(404).json({message: "job not found"});
        }
        if (jobs.company.toString()!==req.user._id.toString()){
            return res
            .status(403)
            .json({message: "Not authorized to delete this job"});
        }
        await jobs.deleteOne();
        res.json({message: "job deleted successfully"}); 
    }catch(err){
        res.status(500).json({message: err.message});
    }
};
exports.toggleCloseJob=async(req, res)=>{
    try{
        const jobs=await Job.findById(req.params.id);
        if (!jobs){
            return res.status(404).json({message: "job not found"});
        }
        if (jobs.company.toString()!==req.user._id.toString()){
            return res
            .status(403)
            .json({message: "Not authorized to close this job"});
        }
        jobs.isClosed= !jobs.isClosed;
        await jobs.save();
        res.json({message: "Job marked as closed"});
    }catch(err){
        res.status(500).json({message: err.message});
    }
};