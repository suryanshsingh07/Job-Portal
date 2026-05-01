import React from 'react'
import { Briefcase, MapPin, Bookmark, BookmarkCheck, ArrowRight, CheckCircle } from 'lucide-react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'

const JobCard = ({ job, isSaved, isApplied, onToggleSave }) => {
 const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 group">
      <div className="flex justify-between items-start">
        <div className="flex gap-4 min-w-0">
          <div className="h-14 w-14 bg-gray-50 rounded-xl flex items-center justify-center font-bold text-xl text-blue-600 border border-gray-100 shrink-0">
            {job.companyName?.charAt(0) || "C"}
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
              {job.title}
            </h3>
            <p className="text-gray-500 font-medium text-sm mt-0.5 truncate">
              {job.companyName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          {isApplied && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
              <CheckCircle className="h-3.5 w-3.5" />
              Applied
            </span>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleSave && onToggleSave(job._id); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-all ${isSaved ? 'text-blue-700 bg-blue-50 hover:bg-red-50 hover:text-red-600 group/save' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50 bg-gray-50'}`}>
            {isSaved ? (
              <>
                <BookmarkCheck className="h-4 w-4 fill-blue-100 group-hover/save:hidden" />
                <Bookmark className="h-4 w-4 hidden group-hover/save:block" />
                <span className="group-hover/save:hidden">Saved</span>
                <span className="hidden group-hover/save:inline">Unsave</span>
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4" />
                <span>Save</span>
              </>
            )}
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mt-4">
        <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg font-medium">
          <MapPin className="h-4 w-4 mr-1.5 opacity-70" />
          {job.location}
        </div>
        <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg font-medium">
          <span className="mr-1 font-bold text-gray-500">₹</span>
          {job.salaryMin >= 100000 ? `${(job.salaryMin/100000).toFixed(1)}L` : `${(job.salaryMin/1000).toFixed(0)}K`} - {job.salaryMax >= 100000 ? `${(job.salaryMax/100000).toFixed(1)}L` : `${(job.salaryMax/1000).toFixed(0)}K`}
        </div>
        <div className="flex items-center text-sm text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg font-medium">
          <Briefcase className="h-4 w-4 mr-1.5 opacity-70" />
          {job.type}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          {moment(job.createdAt).fromNow()}
        </span>
        <button 
          onClick={() => navigate(`/job/${job._id}`)}
          className="flex items-center space-x-1.5 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors group-hover:underline">
          <span>View Details</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  )
}

export default JobCard;
