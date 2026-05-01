import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import JobCard from '../../components/Cards/JobCard'
import { Bookmark, ArrowRight, Loader2, LayoutGrid, List } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import toast from 'react-hot-toast'

const SavedJobs = () => {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.JOBS.GET_SAVED_JOBS);
        setSavedJobs(res.data.savedJobs || res.data || []);
      } catch (error) {
        toast.error("Failed to fetch saved jobs");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSavedJobs();

    const fetchAppliedJobs = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.APPLICATIONS.GET_MY_APPLICATIONS);
        if (res.status === 200) {
          const apps = res.data || [];
          setAppliedJobs(apps.map(a => a.job?._id || a.job));
        }
      } catch (error) {
        console.error("Failed to fetch applied jobs", error);
      }
    };
    fetchAppliedJobs();
  }, []);

  const removeJob = async (savedEntry) => {
    const jobId = savedEntry.job?._id || savedEntry.job || savedEntry._id;
    try {
      await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(jobId));
      setSavedJobs(jobs => jobs.filter(j => {
        const jId = j.job?._id || j.job || j._id;
        return jId !== jobId;
      }));
      toast.success("Job removed from saved list");
    } catch (error) {
        toast.error("Failed to remove job");
        console.error(error);
    }
  };

  return (
    <DashboardLayout activeMenu="saved-jobs">
      <div className="max-w-5xl mx-auto pb-12">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
            <p className="text-gray-500 mt-1">You have {savedJobs.length} jobs saved to review later.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                title="Grid View">
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                title="List View">
                <List className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => navigate('/find-jobs')}
              className="text-blue-600 font-medium hover:text-blue-800 transition flex items-center hover:underline whitespace-nowrap">
              Browse more jobs <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "flex flex-col space-y-6"}>
          {isLoading ? (
             <div className="col-span-full flex justify-center py-20">
               <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
             </div>
          ) : savedJobs.length > 0 ? (
            savedJobs.map(entry => {
              const jobData = entry.job || entry;
              const jobId = jobData._id;
              return (
                <JobCard
                  key={entry._id || jobId}
                  job={jobData}
                  isSaved={true}
                  isApplied={appliedJobs.includes(jobId)}
                  onToggleSave={() => removeJob(entry)}/>
              );
            })
          ) : (
            <div className="col-span-full pt-16 pb-16 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <Bookmark className="h-8 w-8 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 block">No Saved Jobs</h3>
              <p className="text-gray-500 mb-6">You haven't saved any jobs yet. Start browsing and save jobs you like!</p>
              <button
                onClick={() => navigate('/find-jobs')}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition inline-block">
                Find Jobs
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default SavedJobs;