import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Bookmark, BookmarkCheck, Share2, MapPin, Briefcase, Clock, Building, ArrowLeft, ExternalLink, Send, Globe } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAuth } from '../../context/useAuth'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import toast from 'react-hot-toast'

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return; // Wait for auth context to hydrate

    const fetchJobData = async () => {
      try {

        const url = user?._id 
          ? `${API_PATHS.JOBS.GET_JOB_BY_ID(jobId)}?userId=${user._id}` 
          : API_PATHS.JOBS.GET_JOB_BY_ID(jobId);
        const response = await axiosInstance.get(url);
        if (response.status === 200) {
          const jobData = response.data.job || response.data;
          setJob(jobData);
          if (jobData.applicationStatus) {
            setHasApplied(true);
          }
        }

        const savedRes = await axiosInstance.get(API_PATHS.JOBS.GET_SAVED_JOBS);
        if (savedRes.status === 200) {
          const arrayData = savedRes.data.savedJobs || savedRes.data || [];
          const savedIds = arrayData.map(j => j.job?._id || j.job || j.jobId);
          if (savedIds.includes(jobId)) {
            setIsSaved(true);
          }
        }

        try {
          const appsRes = await axiosInstance.get(API_PATHS.APPLICATIONS.GET_MY_APPLICATIONS);
          if (appsRes.status === 200) {
            const apps = appsRes.data || [];
            const appliedIds = apps.map(a => a.job?._id || a.job);
            if (appliedIds.includes(jobId)) {
              setHasApplied(true);
            }
          }
        } catch (e) {
          console.error("Check applied status error:", e);
        }

      } catch (error) {
        toast.error("Failed to load job details");
        console.error(error);
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchJobData();
  }, [jobId, navigate, user]);

  const handleApply = async () => {
    try {
      await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY_TO_JOB(jobId));
      toast.success("Application submitted successfully!");
      setHasApplied(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit application");
    }
  };

  const toggleSaveJob = async () => {
    try {
      if (isSaved) {
        await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(jobId));
        toast.success("Job unsaved");
      } else {
        await axiosInstance.post(API_PATHS.JOBS.SAVE_JOB(jobId));
        toast.success("Job saved successfully");
      }
      setIsSaved(!isSaved);
    } catch (error) {
      toast.error("Failed to update saved status");
      console.error(error);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: job.title,
          text: `Check out this job: ${job.title} at ${job.company?.companyName || "a great company"}`,
          url: url,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error("Error sharing:", err);
        }
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Job link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <DashboardLayout activeMenu="find-jobs">
      <div className="max-w-5xl mx-auto pb-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition font-medium w-fit">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
              <div className="absolute top-8 right-8 flex space-x-3">
                <button 
                  onClick={toggleSaveJob}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${isSaved ? 'text-blue-700 bg-blue-50 hover:bg-red-50 hover:text-red-600 group/save' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50 bg-gray-50 border border-gray-100'}`}
                  title="Save Job">
                  {isSaved ? (
                    <>
                      <BookmarkCheck className="h-5 w-5 fill-blue-100 group-hover/save:hidden" />
                      <Bookmark className="h-5 w-5 hidden group-hover/save:block" />
                      <span className="group-hover/save:hidden">Saved</span>
                      <span className="hidden group-hover/save:inline">Unsave</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-5 w-5" />
                      <span>Save Job</span>
                    </>
                  )}
                </button>
                <button 
                  onClick={handleShare}
                  className="p-2 text-gray-400 hover:bg-gray-50 hover:text-blue-600 rounded-full transition" 
                  title="Share Job">
                  <Share2 className="h-6 w-6" />
                </button>
              </div>
              <div className="flex gap-6 items-start">
                <div className="h-20 w-20 bg-linear-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-2xl flex items-center justify-center text-3xl font-bold text-blue-600 shadow-sm shrink-0 overflow-hidden">
                  {job?.company?.companyLogo ? <img src={job.company.companyLogo} className="h-full w-full object-cover" alt="" onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job?.company?.companyName || job?.company?.name || "C")}&background=random&color=fff&size=200`; }} /> : (job?.title?.charAt(0) || "J")}
                </div>
                <div className="pt-1 pr-16 space-y-2">
                  <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                  <div className="flex items-center text-lg text-gray-600 font-medium pb-2">
                    <Building className="h-5 w-5 mr-2 text-gray-400" />
                    {job.company?.companyName || job.company?.name || "Company"}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg font-medium">
                  <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                  {job.location}
                </div>
                <div className="flex items-center text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg font-medium">
                  <span className="mr-1.5 font-bold text-gray-500">₹</span>
                  {job.salaryMin >= 100000 ? `${(job.salaryMin/100000).toFixed(1)}L` : `${(job.salaryMin/1000).toFixed(0)}K`} – {job.salaryMax >= 100000 ? `${(job.salaryMax/100000).toFixed(1)}L` : `${(job.salaryMax/1000).toFixed(0)}K`} / yr
                </div>
                <div className="flex items-center text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg font-medium">
                  <Briefcase className="h-5 w-5 mr-2 text-gray-400" />
                  {job.type}
                </div>
                <div className="flex items-center text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg font-medium">
                  <Clock className="h-5 w-5 mr-2 text-gray-400" />
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Job Description</h2>
                <div className="prose prose-blue text-gray-600 whitespace-pre-line leading-relaxed">
                  {job.description}
                </div>
              </section>
              {job.requirements && <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Key Requirements</h2>
                <div className="prose prose-blue text-gray-600 whitespace-pre-line leading-relaxed">
                  {job.requirements}
                </div>
              </section>}
              {job.benefits && <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Benefits</h2>
                <div className="prose prose-blue text-gray-600 whitespace-pre-line leading-relaxed">
                  {job.benefits}
                </div>
              </section>}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <button 
                onClick={handleApply}
                disabled={hasApplied}
                className="w-full flex items-center justify-center space-x-2 bg-linear-to-r from-blue-600 to-purple-600 text-white py-3.5 px-6 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition shadow-md disabled:from-green-500 disabled:to-green-600 disabled:opacity-100 disabled:cursor-not-allowed">
                {hasApplied ? (
                  <>
                    <Briefcase className="h-5 w-5" />
                    <span>Application Sent</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Apply Now</span>
                  </>
                )}
              </button>
              <div className="text-center text-sm text-gray-500 mt-4 font-medium flex items-center justify-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{job.applicantsCount} people applied already</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">About the Company</h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-12 w-12 overflow-hidden bg-gray-50 rounded-lg flex items-center justify-center font-bold text-blue-600 border border-gray-100 shrink-0">
                  {job?.company?.companyLogo ? <img src={job.company.companyLogo} className="h-full w-full object-cover" alt="" onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job?.company?.companyName || job?.company?.name || "C")}&background=random&color=fff&size=200`; }} /> : (job?.title?.charAt(0) || "C")}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{job?.company?.companyName || job?.company?.name || "Company Details"}</h4>
                  <Link 
                    to={`/company/${job?.company?._id}`}
                    className="text-sm text-blue-600 hover:underline flex items-center mt-0.5 font-medium">
                    View Full Profile <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {job.company?.companyDescription || job.company?.bio || job.companyInfo || job.companyDescription || "A leading company looking for talented individuals."}
              </p>
              {job?.company?.website && (
                <a 
                  href={job.company.website.startsWith('http') ? job.company.website : `https://${job.company.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                  <Globe className="h-3.5 w-3.5" />
                  Visit Website
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default JobDetails;