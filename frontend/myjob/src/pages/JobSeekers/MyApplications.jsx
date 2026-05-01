import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  FileText, Clock, CheckCircle2, XCircle, Briefcase,
  MapPin, ArrowRight, Loader2, Search, Filter, RefreshCw,
  Building, Eye, CalendarDays, Sparkles
} from 'lucide-react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  'in review': {
    label: 'In Review',
    dot: 'bg-orange-400',
    badge: 'bg-orange-50 text-orange-700 border-orange-200 ring-orange-300/30',
    icon: Eye,
  },
  shortlisted: {
    label: 'Shortlisted',
    dot: 'bg-blue-500',
    badge: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-300/30',
    icon: Sparkles,
  },
  accepted: {
    label: 'Accepted',
    dot: 'bg-emerald-600',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200 ring-emerald-400/30',
    icon: CheckCircle2,
  },
  rejected: {
    label: 'Rejected',
    dot: 'bg-red-400',
    badge: 'bg-red-50 text-red-700 border-red-200 ring-red-300/30',
    icon: XCircle,
  },
};
const StatusBadge = ({ status }) => {
  const key = (status || 'in review').toLowerCase();
  const cfg = STATUS_CONFIG[key] || STATUS_CONFIG['in review'];
  if (!cfg) return null;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border uppercase tracking-wider ${cfg.badge || cfg.color}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
      {cfg.label}
    </span>
  );
};
const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className={`relative bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 overflow-hidden group hover:shadow-md transition-shadow duration-200`}>
    <div className={`absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-10 ${color}`} />
    <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-3 sm:gap-0">
      <div className="flex flex-col z-10 w-full min-w-0">
        <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 truncate w-full pr-8 sm:pr-0">{label}</p>
        <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-none">{value}</p>
        {sub && <p className="text-[10px] sm:text-xs text-gray-400 mt-1.5 font-medium truncate">{sub}</p>}
      </div>
      <div className={`absolute top-4 right-4 sm:static h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center shrink-0 z-10`}>
        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
  </div>
);
const ApplicationCard = ({ app, navigate }) => {
  const job = app.job || {};
  const appliedDate = moment(app.createdAt).format('MMM DD, YYYY');
  const timeAgo = moment(app.createdAt).fromNow();
  const companyName =
    job.company?.companyName || job.company?.name || job.companyName || 'Company';
  const companyLogo = job.company?.companyLogo || job.company?.avatar || null;

  return (
    <div className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all duration-300">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left: Job & Company Info */}
        <div className="flex-1 flex flex-col sm:flex-row gap-5">
          <div
            onClick={() => job.company?._id && navigate(`/company/${job.company._id}`)}
            className="h-16 w-16 rounded-2xl bg-linear-to-br from-blue-50 to-indigo-100 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-2xl shrink-0 uppercase shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all overflow-hidden">
            {companyLogo ? (
              <img 
                src={companyLogo} 
                alt="" 
                className="h-full w-full object-cover" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=random&color=fff&size=200`;}}/>
            ) : (
              companyName.charAt(0)
            )}
          </div>
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex justify-between items-start gap-3">
              <div className="min-w-0">
                <h3 
                  onClick={() => navigate(`/job/${job._id}`)}
                  className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors cursor-pointer hover:underline">
                  {job.title || 'Job Title'}
                </h3>
                <div 
                  className="flex items-center gap-2 mt-1 text-sm text-blue-600 font-semibold cursor-pointer hover:underline" 
                  onClick={() => job.company?._id && navigate(`/company/${job.company._id}`)}>
                  <Building className="h-4 w-4 shrink-0" />
                  <span className="truncate">{companyName}</span>
                </div>
              </div>
              <div className="lg:hidden shrink-0">
                <StatusBadge status={app.status} />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500">
              {job.location && (
                <div className="flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                  {job.location}
                </div>
              )}
              {job.type && (
                <div className="flex items-center">
                  <Briefcase className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                  {job.type}
                </div>
              )}
              <div className="flex items-center">
                <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                Applied {timeAgo}
              </div>
            </div>
          </div>
        </div>
        {/* Right: Status & Actions */}
        <div className="flex flex-col gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 lg:pl-6 lg:border-l border-gray-100 justify-center min-w-140px">
          <div className="hidden lg:block self-end">
            <StatusBadge status={app.status} />
          </div>
          <button
            onClick={() => navigate(`/job/${job._id}`)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-xl text-sm font-bold transition-all duration-300 shadow-sm">
            <Eye className="h-4 w-4" />
            View Detail
          </button>
        </div>
      </div>
    </div>
  );
};

const MyApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchApplications = useCallback(
    async (silent = false) => {
      try {
        if (silent) setIsRefreshing(true);
        else setIsLoading(true);

        const res = await axiosInstance.get(
          API_PATHS.APPLICATIONS.GET_MY_APPLICATIONS
        );
        if (res.status === 200) {
          setApplications(res.data || []);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load your applications');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const totalApps = applications.length;
  const reviewCount = applications.filter(
    (a) => (a.status || '').toLowerCase() === 'in review'
  ).length;
  const shortlistedCount = applications.filter(
    (a) => (a.status || '').toLowerCase() === 'shortlisted'
  ).length;
  const acceptedCount = applications.filter(
    (a) => (a.status || '').toLowerCase() === 'accepted'
  ).length;
  const rejectedCount = applications.filter(
    (a) => (a.status || '').toLowerCase() === 'rejected'
  ).length;

  const filteredApps = applications
    .filter((a) => {
      const s = (a.status || 'in review').toLowerCase();
      if (filter === 'in-review') return s === 'in review';
      if (filter === 'shortlisted') return s === 'shortlisted';
      if (filter === 'accepted') return s === 'accepted';
      if (filter === 'rejected') return s === 'rejected';
      return true;
    })
    .filter((a) => {
      if (!searchTerm) return true;
      const job = a.job || {};
      const term = searchTerm.toLowerCase();
      return (
        job.title?.toLowerCase().includes(term) ||
        (job.company?.companyName || job.company?.name || '')
          .toLowerCase()
          .includes(term) ||
        job.location?.toLowerCase().includes(term)
      );
    });

  const TABS = [
    { id: 'all', label: 'All', count: totalApps },
    { id: 'in-review', label: 'In Review', count: reviewCount },
    { id: 'shortlisted', label: 'Shortlisted', count: shortlistedCount },
    { id: 'accepted', label: 'Accepted', count: acceptedCount },
    { id: 'rejected', label: 'Rejected', count: rejectedCount },
  ];

  return (
    <DashboardLayout activeMenu="my-applications">
      <div className="max-w-5xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col sm:flex-row gap-6 justify-between items-start">
            <div className="flex gap-4 items-center">
              <div className="h-16 w-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-inner shrink-0">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  My Applications
                </h1>
                <p className="text-blue-100 font-medium flex items-center gap-2 mt-1.5 opacity-90">
                  <Briefcase className="h-4 w-4" />
                  Track and manage your submitted applications
                </p>
              </div>
            </div>
            <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-5 py-3 flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-widest text-blue-200 font-bold leading-none mb-1">
                  Total Applied
                </span>
                <span className="text-2xl font-extrabold leading-none">
                  {totalApps}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard icon={Briefcase} label="Applied" value={totalApps} color="bg-indigo-500" />
          <StatCard icon={Eye} label="In Review" value={reviewCount} color="bg-orange-500" />
          <StatCard icon={Sparkles} label="Shortlisted" value={shortlistedCount} color="bg-blue-600" />
          <StatCard icon={CheckCircle2} label="Accepted" value={acceptedCount} color="bg-emerald-600" />
          <StatCard icon={XCircle} label="Rejected" value={rejectedCount} color="bg-rose-500" />
        </div>
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by job title, company, or location..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"/>
          </div>
          <button
            onClick={() => fetchApplications(true)}
            disabled={isRefreshing}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-all text-sm font-bold">
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}/>
            Refresh
          </button>
        </div>
        {/* Status Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 sm:p-3 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${filter === tab.id
                  ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}>
                {tab.label}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${filter === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                    }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
        {/* Applications List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
              <p className="text-gray-500 font-medium">
                Loading your applications…
              </p>
            </div>
          ) : filteredApps.length > 0 ? (
            filteredApps.map((app) => (
              <ApplicationCard
                key={app._id}
                app={app}
                navigate={navigate}/>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="relative mb-6">
                <div className="h-24 w-24 bg-linear-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center shadow-inner">
                  <FileText className="h-11 w-11 text-blue-300" />
                </div>
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">
                {filter !== 'all'
                  ? 'No applications match this filter'
                  : 'No applications yet'}
              </h3>
              <p className="text-gray-400 text-sm max-w-sm leading-relaxed mb-6">
                {filter !== 'all'
                  ? 'Try switching to another status tab or clear your search.'
                  : "Start applying to jobs and track all your applications here!"}
              </p>
              {filter !== 'all' ? (
                <button
                  onClick={() => {
                    setFilter('all');
                    setSearchTerm('');
                  }}
                  className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all">
                  <Filter className="h-4 w-4" />
                  Clear Filters
                </button>
              ) : (
                <button
                  onClick={() => navigate('/find-jobs')}
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95">
                  Browse Jobs
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyApplications;
