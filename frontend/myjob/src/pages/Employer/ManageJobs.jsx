import React, { useState, useEffect, useCallback } from 'react';
import {Briefcase, Edit3, Trash2, Eye, MapPin, Calendar, Search, Plus, ToggleLeft, ToggleRight, LayoutGrid, LayoutList, Users, TrendingUp, CheckCircle2, XCircle, Clock, AlertTriangle, ChevronRight, Sparkles, RefreshCw, Filter} from 'lucide-react';
import moment from 'moment';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';

const formatINR = (amount) => {
  if (!amount && amount !== 0) return '—';
  const num = parseInt(amount);
  if (isNaN(num)) return '—';
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
  return `₹${num.toLocaleString('en-IN')}`;
};

const STATUS_CONFIG = {
  active: {
    label: 'Active',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-300/30',
    icon: CheckCircle2,
  },
  closed: {
    label: 'Closed',
    dot: 'bg-red-400',
    badge: 'bg-red-50 text-red-700 border-red-200 ring-red-300/30',
    icon: XCircle,
  },
  draft: {
    label: 'Draft',
    dot: 'bg-amber-400',
    badge: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-300/30',
    icon: Clock,
  },
};

const getStatus = (job) => (job.isClosed ? 'closed' : 'active');
const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className={`relative bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 overflow-hidden group hover:shadow-md transition-shadow duration-200`}>
    <div className={`absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-10 ${color}`} />
    <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-3 sm:gap-0">
      <div className="flex flex-col z-10 w-full min-w-0">
        <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 truncate w-full pr-8 sm:pr-0">{label}</p>
        <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-none">{value}</p>
        {sub && <p className="text-[10px] sm:text-xs text-gray-400 mt-1.5 font-medium truncate">{sub}</p>}
      </div>
      <div className={`absolute top-4 right-4 sm:static h-8 w-8 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center ${color.replace('bg-', 'bg-blue-')} bg-opacity-15 shrink-0 z-10`}>
        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border ring-1 ring-inset uppercase tracking-wider ${cfg.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot} shrink-0`} />
      {cfg.label}
    </span>
  );
};

const DeleteModal = ({ job, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
    <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 max-w-md w-full">
      <div className="h-14 w-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <AlertTriangle className="h-7 w-7 text-red-500" />
      </div>
      <h2 className="text-xl font-extrabold text-gray-900 text-center mb-2">Delete Job Posting?</h2>
      <p className="text-gray-500 text-center text-sm leading-relaxed mb-6">
        You're about to permanently delete <span className="font-bold text-gray-800">"{job?.title}"</span>.
        This action cannot be undone and all applications will also be removed.
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-linear-to-r from-red-500 to-red-600 text-white font-semibold text-sm hover:from-red-600 hover:to-red-700 transition-all shadow-md shadow-red-200">
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
);

const JobCardGrid = ({ job, onEdit, onDelete, onToggle, onViewApplicants }) => {
  const status = getStatus(job);
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 overflow-hidden flex flex-col">
      <div className={`h-1 w-full ${status === 'active' ? 'bg-linear-to-r from-emerald-400 to-teal-500' : status === 'closed' ? 'bg-linear-to-r from-red-400 to-rose-500' : 'bg-linear-to-r from-amber-400 to-orange-400'}`} />
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="h-12 w-12 rounded-xl bg-linear-to-br from-blue-50 to-indigo-100 border border-blue-100 flex items-center justify-center flex-linear-0">
            <Briefcase className="h-5 w-5 text-blue-600" />
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug mb-1 line-clamp-2">
          {job.title}
        </h3>
        <p className="text-xs text-gray-400 font-medium mb-4">{job.category || 'General'}</p>

        {/* Meta */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            <span className="truncate">{job.location || 'Not specified'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-bold text-gray-400 text-xs shrink-0">₹</span>
            <span className="font-semibold text-gray-700">
              {formatINR(job.salaryMin)} – {formatINR(job.salaryMax)}
              <span className="text-xs text-gray-400 font-normal ml-1">/ yr</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Briefcase className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            <span className="capitalize">{job.type || 'Full-time'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            <span>{moment(job.createdAt).format('DD MMM YYYY')}</span>
          </div>
        </div>

        {/* Applicants Breakdown */}
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-2">
          <button
            onClick={() => onViewApplicants(job._id, 'pending')}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-100 transition-all group/stat">
            <span className="text-sm font-extrabold text-amber-700">{job.stats?.applied || 0}</span>
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-tighter">Pending</span>
          </button>
          <button
            onClick={() => onViewApplicants(job._id, 'in review')}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-100 transition-all group/stat">
            <span className="text-sm font-extrabold text-orange-700">{job.stats?.inReview || 0}</span>
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-tighter">Review</span>
          </button>
          <button
            onClick={() => onViewApplicants(job._id, 'shortlisted')}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-all group/stat">
            <span className="text-sm font-extrabold text-blue-700">{job.stats?.shortlisted || 0}</span>
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">Shortlist</span>
          </button>
          <button
            onClick={() => onViewApplicants(job._id, 'accepted')}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 transition-all group/stat">
            <span className="text-sm font-extrabold text-emerald-700">{job.stats?.accepted || 0}</span>
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Accepted</span>
          </button>
          <button
            onClick={() => onViewApplicants(job._id, 'rejected')}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-100 transition-all group/stat">
            <span className="text-sm font-extrabold text-rose-700">{job.stats?.rejected || 0}</span>
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-tighter">Rejected</span>
          </button>
        </div>

        <button
          onClick={() => onViewApplicants(job._id)}
          className="mt-4 flex items-center justify-between text-gray-500 hover:text-blue-600 transition-colors w-full group/total px-1">
          <span className="text-xs font-bold uppercase tracking-wider">Total Applications</span>
          <div className="flex items-center gap-1">
            <span className="text-xs font-extrabold">{job.applicationCount || 0}</span>
            <ChevronRight className="h-3 w-3 group-hover/total:translate-x-0.5 transition-transform" />
          </div>
        </button>
      </div>

      {/* Action Row */}
      <div className="border-t border-gray-100 px-6 py-3 flex items-center gap-2 bg-gray-50/50">
        <button
          onClick={() => onToggle(job._id, job.isClosed)}
          title={job.isClosed ? 'Reopen Job' : 'Close Job'}
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg transition-all duration-200 ${job.isClosed
            ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
            : 'text-orange-700 bg-orange-50 hover:bg-orange-100'}`}>
          {job.isClosed ? <ToggleRight className="h-3.5 w-3.5" /> : <ToggleLeft className="h-3.5 w-3.5" />}
          {job.isClosed ? 'Reopen' : 'Close'}
        </button>
        <button
          onClick={() => onEdit(job._id)}
          title="Edit Job"
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors">
          <Edit3 className="h-3.5 w-3.5" />
          Edit
        </button>
        <button
          onClick={() => onDelete(job)}
          title="Delete Job"
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg text-red-700 bg-red-50 hover:bg-red-100 transition-colors">
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
};

const JobCardList = ({ job, onEdit, onDelete, onToggle, onViewApplicants }) => {
  const status = getStatus(job);

  return (
    <div className="group bg-white border border-gray-100 rounded-2xl p-5 hover:border-blue-100 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center gap-4">
      {/* Icon */}
      <div className="h-12 w-12 rounded-xl bg-linear-to-br from-blue-50 to-indigo-100 border border-blue-100 flex items-center justify-center shrink-0">
        <Briefcase className="h-5 w-5 text-blue-600" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
            {job.title}
          </h3>
          <StatusBadge status={status} />
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-gray-400" />{job.location || 'Not specified'}</span>
          <span className="flex items-center gap-1.5">
            <span className="font-bold text-gray-400 text-xs">₹</span>
            <span className="font-semibold text-gray-700">{formatINR(job.salaryMin)} – {formatINR(job.salaryMax)}</span>
            <span className="text-gray-400 text-xs">/ yr</span>
          </span>
          <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5 text-gray-400" />{job.type || 'Full-time'}</span>
          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-gray-400" />{moment(job.createdAt).fromNow()}</span>
        </div>
      </div>

      {/* Applicants Breakdown */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onViewApplicants(job._id, 'pending')}
          className="flex flex-col items-center justify-center w-16 p-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-all"
          title="View Pending" >
          <span className="text-xs font-extrabold text-blue-700">{job.stats?.applied || 0}</span>
          <span className="text-[8px] font-bold text-blue-500 uppercase">Pending</span>
        </button>
        <button
          onClick={() => onViewApplicants(job._id, 'shortlisted')}
          className="flex flex-col items-center justify-center w-16 p-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-all"
          title="View Shortlisted">
          <span className="text-xs font-extrabold text-indigo-700">{job.stats?.shortlisted || 0}</span>
          <span className="text-[8px] font-bold text-indigo-500 uppercase">Shortlist</span>
        </button>
        <button
          onClick={() => onViewApplicants(job._id, 'accepted')}
          className="flex flex-col items-center justify-center w-16 p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 transition-all"
          title="View Accepted">
          <span className="text-xs font-extrabold text-emerald-700">{job.stats?.accepted || 0}</span>
          <span className="text-[8px] font-bold text-emerald-500 uppercase">Accepted</span>
        </button>
        <button
          onClick={() => onViewApplicants(job._id, 'rejected')}
          className="flex flex-col items-center justify-center w-16 p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-100 transition-all"
          title="View Rejected">
          <span className="text-xs font-extrabold text-rose-700">{job.stats?.rejected || 0}</span>
          <span className="text-[8px] font-bold text-rose-500 uppercase">Rejected</span>
        </button>
      </div>

      <button onClick={() => onViewApplicants(job._id)}
        className="hidden lg:flex items-center gap-2 text-gray-400 hover:text-blue-600 px-3 transition-colors shrink-0"
        title="View All Applications">
        <div className="text-center">
          <p className="text-sm font-extrabold leading-none">{job.applicationCount || 0}</p>
          <p className="text-[10px] font-bold uppercase tracking-tighter">Total</p>
        </div>
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onToggle(job._id, job.isClosed)}
          title={job.isClosed ? 'Reopen Job' : 'Close Job'}
          className={`p-2 rounded-xl transition-colors ${job.isClosed ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100' : 'text-orange-700 bg-orange-50 hover:bg-orange-100'}`}>
          {job.isClosed ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
        </button>
        <button
          onClick={() => onEdit(job._id)}
          title="Edit"
          className="p-2 rounded-xl text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors">
          <Edit3 className="h-5 w-5" />
        </button>
        <button
          onClick={() => onDelete(job)}
          title="Delete"
          className="p-2 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition-colors">
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

const EmptyState = ({ hasFilter, onPost }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
    <div className="relative mb-6">
      <div className="h-24 w-24 bg-linear-to-br from-blue-50 to-indigo-100 rounded-3xl flex items-center justify-center shadow-inner">
        <Briefcase className="h-11 w-11 text-blue-300" />
      </div>
      <div className="absolute -top-2 -right-2 h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center">
        <Sparkles className="h-4 w-4 text-amber-500" />
      </div>
    </div>
    <h3 className="text-xl font-extrabold text-gray-900 mb-2">
      {hasFilter ? 'No jobs match your filters' : 'No job postings yet'}
    </h3>
    <p className="text-gray-400 text-sm max-w-xs leading-relaxed mb-6">
      {hasFilter
        ? 'Try adjusting your search or status filter to find what you\'re looking for.'
        : 'You haven\'t posted any jobs yet. Create your first job posting to start attracting candidates.'}
    </p>
    {!hasFilter && (
      <button
        onClick={onPost}
        className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-200">
        <Plus className="h-4 w-4" />
        Post Your First Job
      </button>
    )}
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 animate-pulse">
    <div className="flex justify-between">
      <div className="h-12 w-12 bg-gray-100 rounded-xl" />
      <div className="h-6 w-16 bg-gray-100 rounded-full" />
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-100 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-100 rounded w-full" />
      <div className="h-3 bg-gray-100 rounded w-5/6" />
      <div className="h-3 bg-gray-100 rounded w-4/5" />
    </div>
    <div className="h-10 bg-gray-100 rounded-xl" />
    <div className="h-10 bg-gray-100 rounded-xl" />
  </div>
);

const ManageJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchJobs = useCallback(async (silent = false) => {
    try {
      if (silent) setIsRefreshing(true);
      else setIsLoading(true);
      const res = await axiosInstance.get(API_PATHS.JOBS.GET_JOBS_EMPLOYER);
      if (res.status === 200) setJobs(res.data || []);
    } catch {
      toast.error('Failed to load jobs. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleToggleClose = async (jobId, isClosed) => {
    try {
      await axiosInstance.put(API_PATHS.JOBS.TOGGLE_CLOSE(jobId));
      setJobs((prev) => prev.map((j) => j._id === jobId ? { ...j, isClosed: !isClosed } : j));
      toast.success(isClosed ? 'Job reopened!' : 'Job closed successfully.');
    } catch {
      toast.error('Failed to update job status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await axiosInstance.delete(API_PATHS.JOBS.DELETE_JOB(deleteTarget._id));
      setJobs((prev) => prev.filter((j) => j._id !== deleteTarget._id));
      toast.success('Job deleted successfully.');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete job.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (jobId) => navigate('/post-job', { state: { jobId } });
  const handleViewApplicants = (jobId, initialFilter = 'all') =>
    navigate('/applicants', { state: { jobId, initialFilter } });

  const totalActive = jobs.filter((j) => !j.isClosed).length;
  const totalClosed = jobs.filter((j) => j.isClosed).length;
  const totalApplications = jobs.reduce((a, j) => a + (j.applicationsCount || 0), 0);

  const filtered = jobs.filter((job) => {
    const status = getStatus(job);
    const matchSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTab =
      activeTab === 'all' ||
      (activeTab === 'active' && status === 'active') ||
      (activeTab === 'closed' && status === 'closed');
    return matchSearch && matchTab;
  });

  const TABS = [
    { key: 'all', label: 'All Jobs', count: jobs.length },
    { key: 'active', label: 'Active', count: totalActive },
    { key: 'closed', label: 'Closed', count: totalClosed },
  ];

  return (
    <DashboardLayout activeMenu="manage-jobs">
      <div className="max-w-7xl mx-auto space-y-6 pb-12">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Manage Jobs</h1>
            <p className="text-sm text-gray-400 mt-0.5 font-medium">
              {jobs.length} total posting{jobs.length !== 1 ? 's' : ''} · manage, edit and track performance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => fetchJobs(true)}
              disabled={isRefreshing}
              className="p-2.5 text-gray-500 hover:text-blue-600 bg-white border border-gray-200 rounded-xl hover:border-blue-200 transition-all shadow-sm"
              title="Refresh">
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-blue-500' : ''}`} />
            </button>
            <button onClick={() => navigate('/post-job')}
              className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:from-blue-700 hover:to-purple-700 transition-all shadow-md shadow-blue-200 hover:shadow-lg">
              <Plus className="h-4 w-4" />
              Post New Job
            </button>
          </div>
        </div>

        {/* ── Stats Bar ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard icon={Briefcase} label="Total Jobs" value={jobs.length} color="bg-blue-500" />
          <StatCard icon={CheckCircle2} label="Active" value={totalActive} color="bg-emerald-500" sub="Currently hiring" />
          <StatCard icon={XCircle} label="Closed" value={totalClosed} color="bg-red-400" />
          <StatCard icon={Users} label="Applications" value={totalApplications} color="bg-purple-500" sub="All time total" />
        </div>

        {/* ── Filters Row ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input type="text"
              placeholder="Search by title or location…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all outline-none"/>
          </div>

          {/* Tab Pills */}
          <div className="flex items-center gap-1.5 bg-gray-100 rounded-xl p-1 shrink-0">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${activeTab === tab.key
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'}`}>
                {tab.label}
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${activeTab === tab.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
              <LayoutList className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── Results Label ── */}
        {!isLoading && (
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              {searchTerm && ` for "${searchTerm}"`}
            </p>
            {(searchTerm || activeTab !== 'all') && (
              <button onClick={() => { setSearchTerm(''); setActiveTab('all'); }} className="text-xs text-blue-600 font-bold hover:underline">
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* ── Content ── */}
        {isLoading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-4'}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              viewMode === 'grid' ? <SkeletonCard key={i} /> :
                <div key={i} className="h-24 bg-white rounded-2xl border border-gray-100 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <EmptyState
              hasFilter={!!(searchTerm || activeTab !== 'all')}
              onPost={() => navigate('/post-job')}/>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((job) => (
              <JobCardGrid
                key={job._id}
                job={job}
                onEdit={handleEdit}
                onDelete={setDeleteTarget}
                onToggle={handleToggleClose}
                onViewApplicants={handleViewApplicants}/>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((job) => (
              <JobCardList
                key={job._id}
                job={job}
                onEdit={handleEdit}
                onDelete={setDeleteTarget}
                onToggle={handleToggleClose}
                onViewApplicants={handleViewApplicants}/>
            ))}
          </div>
        )}
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {deleteTarget && (
        <DeleteModal
          job={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}/>
      )}
    </DashboardLayout>
  );
};

export default ManageJobs;