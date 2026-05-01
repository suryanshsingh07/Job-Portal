import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import SearchHeader from '../../components/JobSeekers/SearchHeader';
import FilterContent from '../../components/JobSeekers/FilterContent';
import JobCard from '../../components/Cards/JobCard';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import { RefreshCw, SearchX, Briefcase, Sparkles, Filter, LayoutGrid, List } from 'lucide-react';

const JobSeekerdashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [sortOption, setSortOption] = useState("Most Recent");
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    jobTypes: [],
    expLevels: [],
    minSalary: null
  });

  const fetchJobs = useCallback(async (silent = false) => {
    try {
      if (silent) setIsRefreshing(true);
      else setIsLoading(true);
      const res = await axiosInstance.get(API_PATHS.JOBS.GET_ALL_JOBS);
      if (res.status === 200) {
        setJobs(res.data.jobs || res.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load job listings');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const fetchSavedJobs = useCallback(async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.JOBS.GET_SAVED_JOBS);
      if (res.status === 200) {

        const arrayData = res.data.savedJobs || res.data || [];
        const savedIds = arrayData.map(j => j.job?._id || j.job || j.jobId);
        setSavedJobs(savedIds);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchAppliedJobs = useCallback(async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.APPLICATIONS.GET_MY_APPLICATIONS);
      if (res.status === 200) {
        const apps = res.data || [];
        const appliedIds = apps.map(a => a.job?._id || a.job);
        setAppliedJobs(appliedIds);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
    fetchSavedJobs();
    fetchAppliedJobs();
  }, [fetchJobs, fetchSavedJobs, fetchAppliedJobs]);

  const toggleSaveJob = async (jobId) => {
    const isSaved = savedJobs.includes(jobId);
    
    setSavedJobs(prev => 
      isSaved ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );

    try {
      if (isSaved) {
        await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(jobId));
        toast.success("Job removed from saved list");
      } else {
        await axiosInstance.post(API_PATHS.JOBS.SAVE_JOB(jobId));
        toast.success("Job saved successfully");
      }
    } catch (err) {
      console.error(err);
      setSavedJobs(prev => 
        isSaved ? [...prev, jobId] : prev.filter(id => id !== jobId)
      );
      toast.error("Failed to update saved status");
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (filters.keyword && 
       !job.title?.toLowerCase().includes(filters.keyword.toLowerCase()) && 
       !job.companyName?.toLowerCase().includes(filters.keyword.toLowerCase())) return false;
    
    if (filters.location && !job.location?.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.jobTypes.length > 0 && !filters.jobTypes.includes(job.type)) return false;
    if (filters.minSalary && (job.salaryMin || 0) < filters.minSalary) return false;
    if (filters.expLevels.length > 0 && !filters.expLevels.includes(job.experienceLevel)) return false;
    
    return true;
  }).sort((a, b) => {
    if (sortOption === "Salary: High to Low") {
      return (b.salaryMax || 0) - (a.salaryMax || 0);
    }
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  return (
    <DashboardLayout activeMenu="find-jobs">
      <div className="bg-linear-to-r from-blue-700 via-indigo-700 to-purple-800 relative overflow-hidden pt-12 pb-16 lg:pb-24 rounded-3xl mb-8">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white rounded-full mix-blend-overlay blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-20 -left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-overlay blur-3xl opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-blue-100 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="h-4 w-4 text-amber-300" />
            Over thousands of jobs available
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white text-center tracking-tight leading-tight mb-6 max-w-4xl">
            Find Your <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-200 to-purple-200">Dream Job</span> Today
          </h1>
          <p className="text-blue-100 text-lg md:text-xl text-center max-w-2xl font-medium opacity-90 leading-relaxed mb-4">
            Discover opportunities that match your precise skills, interests, and professional career goals.
          </p>
        </div>
      </div> 
      <div className="container mx-auto px-2 lg:px-6 -mt-8 sm:-mt-12 relative z-20 flex-1 pb-16">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-blue-900/5 p-2 sm:p-4 border border-gray-100">
          <SearchHeader filters={filters} setFilters={setFilters} onSearch={() => fetchJobs(true)} />
        </div>   
        <div className="mt-8 lg:mt-12 flex flex-col lg:flex-row gap-8 items-start">
          <button 
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="lg:hidden w-full flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl py-3.5 font-bold text-gray-700 shadow-sm active:scale-95 transition-all">
            <Filter className="h-5 w-5" />
            {showMobileFilter ? 'Hide Filters' : 'Show Advanced Filters'}
          </button>
          <div className={`w-full lg:w-1/4 xl:w-1/4 ${showMobileFilter ? 'block' : 'hidden lg:block'} sticky top-24`}>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-1">
              <FilterContent filters={filters} setFilters={setFilters} />
            </div>
          </div>
          <div className="w-full lg:w-3/4 xl:w-3/4 flex flex-col space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:px-6 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex shrink-0 items-center justify-center font-bold">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-gray-900 leading-tight">Recommended Jobs</h2>
                  <p className="text-sm font-medium text-gray-500">Showing {filteredJobs.length} active listings</p>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => fetchJobs(true)} 
                  disabled={isRefreshing}
                  className="h-10 w-10 border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-95 bg-white">
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-blue-500' : ''}`} />
                </button>
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
                <div className="flex-1 sm:flex-none relative">
                  <select 
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full sm:w-48 appearance-none bg-gray-50 border border-gray-200 text-gray-700 font-bold text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-pointer">
                    <option value="Most Recent">Most Recent</option>
                    <option value="Salary: High to Low">Salary: High to Low</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <Filter className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
            {isLoading ? (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6" : "flex flex-col space-y-5 sm:space-y-6"}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-3xl border border-gray-100 p-6 h-64 animate-pulse">
                    <div className="flex gap-4 mb-4">
                      <div className="h-14 w-14 bg-gray-100 rounded-2xl"></div>
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="space-y-3 mt-8">
                      <div className="h-3 bg-gray-100 rounded w-full"></div>
                      <div className="h-3 bg-gray-100 rounded w-4/5"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6" : "flex flex-col space-y-5 sm:space-y-6"}>
                {filteredJobs.map(job => (
                  <JobCard 
                    key={job._id} 
                    job={job} 
                    isSaved={savedJobs.includes(job._id)} 
                    isApplied={appliedJobs.includes(job._id)}
                    onToggleSave={() => toggleSaveJob(job._id)}/>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm py-20 px-6 flex flex-col items-center justify-center text-center">
                <div className="h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <SearchX className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-500 font-medium max-w-sm mb-6">
                  We couldn't find any jobs matching your specific criteria. Try tweaking your filters or search terms.
                </p>
                <button 
                  onClick={() => setFilters({ keyword: "", location: "", jobTypes: [], expLevels: [], minSalary: null })}
                  className="px-6 py-3 bg-blue-50 text-blue-700 font-extrabold rounded-xl hover:bg-blue-100 transition-colors active:scale-95">
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobSeekerdashboard;