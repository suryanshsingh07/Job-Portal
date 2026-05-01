import React from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useState } from 'react'
import { AlertCircle, Briefcase, Users, Eye, Send, MapPin } from 'lucide-react'
import { API_PATHS } from '../../utils/apiPaths'
import { useLocation, useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { CATEGORIES, JOB_TYPES } from '../utils/data'
import toast from 'react-hot-toast'
import InputField from '../../components/Input/InputField'
import SelectField from '../../components/Input/SelectField'
import TextareaField from '../../components/Input/TextareaField'
import JobPostingPreview from '../../components/Cards/JobPostingPreview'

const JobPostingForm = () => {
  const navigate=useNavigate();
  const location=useLocation();
  const jobId=location.state?.jobId || null;

  const [formData, setFormData]=useState({
    jobTitle: "",
    location: "",
    category: "",
    jobType: "",
    description: "",
    requirements: "",
    salaryMin: "",
    salaryMax: "",
  });

  const [errors, setErrors]=useState({});
  const [isSubmitting, setIsSubmitting]=useState(false);
  const [isPreview, setIsPreview]=useState(false);

  const handleInputChange=(field, value)=> {
    setFormData((prev)=>({
      ...prev,
      [field]: value,
    }));

    if (errors[field]){
      setErrors((prev)=>({
        ...prev,
        [field]:"",
      }));
    }

    if ((field === "salaryMin" || field === "salaryMax") && errors.salary) {
      setErrors((prev) => ({
        ...prev,
        salary: "",
      }));
    }
  };
  const handleSubmit=async (e)=>{
    e.preventDefault();
    const validationErrors=validateForm(formData);
    if(Object.keys(validationErrors).length>0){
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    const jobPayload={
      title: formData.jobTitle,
      description: formData.description,
      requirements: formData.requirements,
      location: formData.location,
      category: formData.category,
      type: formData.jobType,
      salaryMin: formData.salaryMin,
      salaryMax: formData.salaryMax,
    };
    try{
      const response=jobId
        ? await axiosInstance.put(API_PATHS.JOBS.UPDATE_JOB(jobId), jobPayload)
        : await axiosInstance.post(API_PATHS.JOBS.POST_JOB, jobPayload);
      if (response.status===200 || response.status===201){
        toast.success(
          jobId ? "Job Updated Successfully!" : "Job Posted Successfully!"
        );
        setFormData({
          jobTitle: "",
          location: "",
          category: "",
          jobType: "",
          description: "",
          requirements: "",
          salaryMin: "",
          salaryMax: "",
        });
        navigate("/employer-dashboard");
        return;
      }
      console.error("Unexpected response:", response);
      toast.error("Something went wrong. Please try again");
    } catch (error){
      const errorMessage = error.response?.data?.message || "Failed to post/update job. Please try again.";
      console.error("API Error:", errorMessage);
      toast.error(errorMessage);
    } finally{
      setIsSubmitting(false);
    }
  };

  const validateForm=(formData)=>{
    const errors={};
    if (!formData.jobTitle.trim()){
      errors.jobTitle="Job title is required";
    }
    if(!formData.category){
      errors.category="Please select a category";
    }
    if (!formData.location.trim()) {
      errors.location = "Location is required";
    }
    if(!formData.jobType){
      errors.jobType="Please select a job type";
    }
    if(!formData.description.trim()){
      errors.description="Job description is required";
    }
    if (!formData.requirements.trim()){
      errors.requirements="Job requirements are required";
    }
    if(!formData.salaryMin || !formData.salaryMax){
      errors.salary="Both minimum and maximum salary are required";
    }else if(parseInt(formData.salaryMin)>=parseInt(formData.salaryMax)){
      errors.salary="maximum salary must be greater than minimum salary";
    }
    return errors;
  };


  if (isPreview){
    return (
      <DashboardLayout activeMenu="post-job">
        <JobPostingPreview formData={formData} setIsPreview={setIsPreview}/>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu='post-job'>
      <div className='min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-purple-50/20 py-8 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white shadow-xl rounded-2xl p-6'>
            <div className='flex items-center justify-between mb-8'>
              <div>
                <h2 className='text-xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
                  Post a New Job
                </h2>
                <p className='text-sm text-gray-600 mt-1'>
                  Fill out the form below to create your job posting
                </p>
              </div>
              <div className='flex items-center space-x-2'>
                <button onClick={()=>setIsPreview(true)}
                className='group flex items-center space-x-2 px-6 py-3 text-sm font-medium text-gray-600 hover:text-white bg-white/50 hover:bg-linear-to-r hover:from-blue-500 hover:to-blue-600 border border-gray-200 hover:border-transparent rounded-xl transition-all duration-300 shadow-lg shadow-gray-100 hover:shadow-xl transform hover:translate-y-0 cursor-pointer'>
                  <Eye className='h-4 w-4 transition-transform group-hover:-translate-x-1'/>
                  <span>Preview</span>
                </button>
              </div>
            </div>
            <div className='space-y-6'>
              <InputField label="Job Title" id="jobTitle"
              placeholder="e.g., Senior Frontend Developer" value={formData.jobTitle}
              onChange={(e)=>handleInputChange('jobTitle', e.target.value)}
              error={errors.jobTitle} required icon={Briefcase}/>
              <div className='space-y-4'>
                <div className='flex flex-col sm:flex-row sm:items-end sm:space-x-4 space-y-4 sm:space-y-0'>
                  <div className='flex-1'>
                    <InputField label="location"
                    id="location"
                    placeholder="e.g., Lucknow, UP"
                    value={formData.location}
                    onChange={(e)=> handleInputChange("location", e.target.value)}
                    error={errors.location}
                    icon={MapPin}/>
                  </div>
                </div>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <SelectField label="Category"
                id="category"
                value={formData.category}
                onChange={(e)=>handleInputChange("category", e.target.value)}
                options={CATEGORIES} placeholder="Select a category"
                error={errors.category} required icon={Users}/>
                <SelectField label="Job Type" id="jobType"
                value={formData.jobType} onChange={(e)=>handleInputChange("jobType", e.target.value)} options={JOB_TYPES} placeholder="Select job type"
                error={errors.jobType} required icon={Users}/>
              </div>
              <TextareaField label="Job Description" id="description"
              placeholder="Describe the role and responsibilities . . ."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              error={errors.description}
              helperText="Include key responsibilities, day-to-day tasks and what makes this role exciting" required />
              <TextareaField label="Requirements" id="requirements" placeholder="List key qualifications and skills . . ."
              value={formData.requirements}
              onChange={(e) => handleInputChange("requirements", e.target.value)}
              error={errors.requirements} helperText="Include required skills, experience level, education and any preferred qualifications" required />
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>
                  Salary Range (₹) <span className='text-red-500'>*</span>
                  <span className='ml-2 text-xs text-gray-400 font-normal'>Enter amount in ₹ per year (e.g. 600000 = ₹6 LPA)</span>
                </label>
                <div className='grid grid-cols-2 gap-3'>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10'>
                      <span className='text-gray-500 font-bold text-base'>₹</span>
                    </div>
                    <input type='number' placeholder='Min (e.g. 500000)' value={formData.salaryMin}
                    onChange={(e)=>handleInputChange("salaryMin",e.target.value)}
                    className='w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:border-blue-500 transition-colors duration-200'/>
                  </div>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10'>
                      <span className='text-gray-500 font-bold text-base'>₹</span>
                    </div>
                    <input type='number' placeholder='Max (e.g. 1000000)'
                    value={formData.salaryMax} onChange={(e)=>handleInputChange("salaryMax", e.target.value)}
                    className='w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:border-blue-500 transition-colors duration-200'/>
                  </div>
                </div>
                {errors.salary && (
                  <div className='flex items-center space-x-1 text-sm text-red-600'>
                    <AlertCircle className='h-4 w-4'/>
                    <span>{errors.salary}</span>
                  </div>
                )}
              </div>
              <div className='pt-2'>
                <button onClick={handleSubmit} disabled={isSubmitting}
                className='w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-600/90 focus:outline-none focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed outline-none transition-colors duration-200'>
                  {isSubmitting ? (
                    <>
                      <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'/>
                        Publishing Job . . .
                    </>
                  ) : (
                    <>
                      <Send className='h-5 w-5 mr-2'/>
                      Publish Job
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default JobPostingForm