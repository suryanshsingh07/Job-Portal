import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {FileText, CheckCircle2, XCircle, Download, Mail, Check, X, Clock, AlertTriangle, ArrowLeft, Users, Briefcase, RefreshCw, Sparkles, Filter, Link as LinkIcon, Eye, Briefcase as JobIcon} from 'lucide-react';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import ApplicationActions from '../../components/Employer/ApplicationActions';

const STATUS_CONFIG = {
  'in review': {
    label: 'In Review',
    dot: 'bg-orange-500',
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

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className={`relative bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 overflow-hidden group hover:shadow-md transition-shadow duration-200`}>
    <div className={`absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-10 ${color}`} />
    <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-3 sm:gap-0">
      <div className="flex flex-col z-10 w-full min-w-0">
        <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 truncate w-full pr-8 sm:pr-0">{label}</p>
        <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-none">{value}</p>
        {sub && <p className="text-[10px] sm:text-xs text-gray-400 mt-1.5 font-medium truncate">{sub}</p>}
      </div>
      <div className="absolute top-4 right-4 sm:static h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center shrink-0 z-10">
        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['in review'];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border ring-1 ring-inset uppercase tracking-wider ${cfg.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot} shrink-0`} />
      {cfg.label}
    </span>
  );
};

const SkeletonRow = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row gap-6 animate-pulse">
    <div className="flex-1 flex gap-4">
      <div className="h-14 w-14 bg-gray-100 rounded-full" />
      <div className="space-y-2 flex-1">
        <div className="h-5 bg-gray-100 rounded-md w-1/3" />
        <div className="h-4 bg-gray-100 rounded-md w-1/4" />
        <div className="flex gap-2 mt-3">
          <div className="h-6 w-16 bg-gray-100 rounded-full" />
          <div className="h-6 w-16 bg-gray-100 rounded-full" />
        </div>
      </div>
    </div>
    <div className="flex items-center justify-end gap-3 w-full md:w-auto">
      <div className="h-10 w-24 bg-gray-100 rounded-xl" />
      <div className="h-10 w-10 bg-gray-100 rounded-xl" />
      <div className="h-10 w-10 bg-gray-100 rounded-xl" />
    </div>
  </div>
);

const EmptyState = ({ hasFilter, onClear }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
    <div className="relative mb-6">
      <div className="h-24 w-24 bg-linear-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center shadow-inner">
        <Users className="h-11 w-11 text-blue-300" />
      </div>
      <div className="absolute -top-1 -right-1 h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center">
        <Sparkles className="h-4 w-4 text-amber-500" />
      </div>
    </div>
    <h3 className="text-xl font-extrabold text-gray-900 mb-2">
      {hasFilter ? 'No candidates match your filters' : 'No applications yet'}
    </h3>
    <p className="text-gray-400 text-sm max-w-sm leading-relaxed mb-6">
      {hasFilter
        ? 'Try adjusting your search or switching to another status.'
        : 'Applications for this job will appear here once candidates start applying.'}
    </p>
    {hasFilter && (
      <button onClick={onClear}
        className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all">
        <Filter className="h-4 w-4" />
        Clear Filters
      </button>
    )}
  </div>
);

const ActionModal = ({ title, desc, icon: Icon, color, confirmText, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
    <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 max-w-md w-full animate-in zoom-in-95 duration-200">
      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-5 ${color.bg}`}>
        <Icon className={`h-7 w-7 ${color.text}`} />
      </div>
      <h2 className="text-xl font-extrabold text-gray-900 text-center mb-2">{title}</h2>
      <p className="text-gray-500 text-center text-sm leading-relaxed mb-6">{desc}</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button onClick={onConfirm} className={`flex-1 py-3 rounded-xl text-white font-semibold text-sm transition-all shadow-md ${color.btn}`}>
          {confirmText}
        </button>
      </div>
    </div>
  </div>
);

const ApplicationRow = ({ app, onUpdateStatus }) => {
  const applicantName = app?.applicant?.name || app?.candidateName || 'Unknown Candidate';
  const email = app?.applicant?.email || app?.email || 'No email provided';
  const status = app.status?.toLowerCase() || 'pending';
  const resumeLink = app?.resume || app?.applicant?.resume || app?.resumeLink;
  const appliedDate = moment(app.appliedAt || app.createdAt).fromNow();
  const rawSkills = app?.applicant?.skills || app?.skills || '';
  const skills = typeof rawSkills === 'string' ? rawSkills.split(',').map(s => s.trim()).filter(Boolean) : Array.isArray(rawSkills) ? rawSkills : [];
  const applicantId = app?.applicant?._id;
  const navigate = useNavigate();

  return (
    <div className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all duration-300">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 flex flex-col sm:flex-row gap-4 sm:gap-5">
          <div onClick={() => applicantId && navigate(`/applicant/${applicantId}`)}
            className={`h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-linear-to-br from-blue-50 to-indigo-100 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-xl sm:text-2xl shrink-0 uppercase shadow-sm overflow-hidden ${applicantId ? 'cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all' : ''}`}>
            {app?.applicant?.avatar ? (
              <img src={app.applicant.avatar} alt="" className="h-full w-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(applicantName)}&background=random&color=fff&size=200`; }} />
            ) : (
              applicantName.charAt(0)
            )}
          </div>
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex justify-between items-start gap-3">
              <div className="min-w-0">
                <h3 onClick={() => applicantId && navigate(`/applicant/${applicantId}`)}
                  className={`text-base sm:text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors ${applicantId ? 'cursor-pointer hover:underline' : ''}`}>
                  {applicantName}
                </h3>
                {app?.applicant?.title && (
                  <p className="text-xs sm:text-sm text-blue-600 font-medium mt-0.5 truncate">{app.applicant.title}</p>
                )}
                <div className="flex items-center text-xs sm:text-sm text-gray-500 mt-1">
                  <Mail className="h-3.5 w-3.5 mr-1.5 shrink-0 text-gray-400" />
                  <span className="truncate">{email}</span>
                </div>
              </div>
              <div className="lg:hidden shrink-0">
                <StatusBadge status={status} />
              </div>
            </div>
            {skills && skills.length > 0 && (
              <div className="flex gap-1.5 flex-wrap">
                {skills.slice(0, 4).map((skill, idx) => (
                  <span key={idx} className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-gray-50 border border-gray-100 text-gray-600 rounded-lg text-[10px] sm:text-[11px] font-bold tracking-wide uppercase">
                    {typeof skill === 'string' ? skill : skill.name}
                  </span>
                ))}
                {skills.length > 4 && (
                  <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-gray-50 border border-gray-100 text-gray-500 rounded-lg text-[10px] sm:text-[11px] font-bold tracking-wide">
                    +{skills.length - 4}
                  </span>
                )}
              </div>
            )}
            <div className="flex items-center gap-4 text-[10px] sm:text-xs font-medium text-gray-400 mt-2">
              <div className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                Applied {appliedDate}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 lg:pl-6 lg:border-l border-gray-100 justify-center">
          <div className="hidden lg:block self-end">
            <StatusBadge status={status} />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto">
            <div className="flex gap-2 w-full sm:w-auto">
              {applicantId && (
                <button
                  onClick={() => navigate(`/applicant/${applicantId}`)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-95">
                  <Eye className="h-4 w-4" />
                  Profile
                </button>
              )}
              {resumeLink ? (
                <a href={resumeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-95">
                  <LinkIcon className="h-4 w-4 text-gray-400" />
                  CV
                </a>
              ) : (
                <button disabled className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-100 text-gray-400 bg-gray-50 rounded-xl text-xs sm:text-sm font-bold opacity-70 cursor-not-allowed">
                  <FileText className="h-4 w-4" />
                  No CV
                </button>
              )}
            </div>
            <ApplicationActions
              applicationId={app._id}
              status={status}
              onApprove={() => onUpdateStatus(app, 'accepted')}
              onShortlist={() => onUpdateStatus(app, 'shortlisted')}
              onReject={() => onUpdateStatus(app, 'rejected')}
              onInReview={() => onUpdateStatus(app, 'in review')}
              onReset={() => onUpdateStatus(app, 'pending')}/>
          </div>
        </div>
      </div>
    </div>
  );
};
const ApplicationViewer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const jobId = location.state?.jobId || null;

  const [applications, setApplications] = useState([]);
  const [jobInfo, setJobInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState(location.state?.initialFilter || "all");

  const [actionTarget, setActionTarget] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchData = useCallback(async (silent = false) => {
    if (!jobId) {
      setIsLoading(false);
      return;
    }

    try {
      if (silent) setIsRefreshing(true);
      else setIsLoading(true);

      const appRes = await axiosInstance.get(API_PATHS.APPLICATIONS.GET_ALL_APPLICATIONS(jobId));
      if (appRes.status === 200) {
        setApplications(appRes.data?.applications || appRes.data || []);
      }

      try {
        const jobRes = await axiosInstance.get(API_PATHS.JOBS.GET_JOB_BY_ID(jobId));
        if (jobRes.status === 200) {
          setJobInfo(jobRes.data.job || jobRes.data);
        }
      } catch (err) {

      }
    } catch (error) {
      toast.error('Failed to load applications. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!jobId && !isLoading) {
      toast('Please select a job to view its applications.', { icon: 'ℹ️' });
      navigate('/manage-jobs');
    }
  }, [jobId, isLoading, navigate]);

  const confirmUpdateStatus = async () => {
    if (!actionTarget) return;
    const { app, newStatus } = actionTarget;
    setIsProcessing(true);

    try {
      await axiosInstance.put(API_PATHS.APPLICATIONS.UPDATE_STATUS(app._id), { status: newStatus });
      setApplications(prev => prev.map(a =>
        a._id === app._id ? { ...a, status: newStatus } : a
      ));
      toast.success(`Application marked as ${newStatus}`);
      setActionTarget(null);
    } catch (error) {
      toast.error(`Failed to mark as ${newStatus}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const totalApps = applications.length;
  const reviewApps = applications.filter(a => (a.status || '').toLowerCase() === 'in review').length;
  const shortApps = applications.filter(a => (a.status || '').toLowerCase() === 'shortlisted').length;
  const accApps = applications.filter(a => (a.status || '').toLowerCase() === 'accepted').length;
  const rejApps = applications.filter(a => (a.status || '').toLowerCase() === 'rejected').length;

  const filteredApps = applications.filter(a => {
    if (filter === 'all') return true;
    return (a.status || 'in review').toLowerCase() === filter;
  });

  const TABS = [
    { id: 'all', label: 'All Candidates', count: totalApps },
    { id: 'in review', label: 'In Review', count: reviewApps },
    { id: 'shortlisted', label: 'Shortlisted', count: shortApps },
    { id: 'accepted', label: 'Accepted', count: accApps },
    { id: 'rejected', label: 'Rejected', count: rejApps },
  ];

  if (!jobId) return <DashboardLayout activeMenu="applicants"><div /></DashboardLayout>;

  return (
    <DashboardLayout activeMenu="applicants">
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/manage-jobs')}
            className="group flex items-center gap-2 text-gray-500 hover:text-blue-600 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold">Back to Jobs</span>
          </button>
          <button onClick={() => fetchData(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm font-bold hidden sm:block">Refresh</span>
          </button>
        </div>
        <div className="bg-linear-to-r from-blue-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col sm:flex-row gap-6 justify-between items-start">
            <div className="flex gap-4 items-center">
              <div className="h-16 w-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-inner shrink-0">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Applications</h1>
                <p className="text-blue-100 font-medium flex items-center gap-2 mt-1.5 opacity-90">
                  <Briefcase className="h-4 w-4" />
                  {jobInfo?.title ? `For "${jobInfo.title}"` : 'Reviewing candidates'}
                </p>
              </div>
            </div>
            <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-5 py-3 flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-widest text-blue-200 font-bold leading-none mb-1">Total Received</span>
                <span className="text-2xl font-extrabold leading-none">{totalApps}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard icon={Users} label="Total" value={totalApps} color="bg-blue-500" />
          <StatCard icon={Eye} label="In Review" value={reviewApps} color="bg-orange-500" />
          <StatCard icon={Sparkles} label="Shortlisted" value={shortApps} color="bg-blue-600" />
          <StatCard icon={CheckCircle2} label="Accepted" value={accApps} color="bg-emerald-600" />
          <StatCard icon={XCircle} label="Rejected" value={rejApps} color="bg-rose-500" />
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 sm:p-3 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {TABS.map(tab => (
              <button key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${filter === tab.id
                  ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100 inset-ring'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}>
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-xs ${filter === tab.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {isLoading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : filteredApps.length > 0 ? (
            filteredApps.map(app => (
              <ApplicationRow key={app._id}
                app={app}
                onUpdateStatus={(appData, status) => setActionTarget({ app: appData, newStatus: status })}/>
            ))
          ) : (
            <EmptyState hasFilter={filter !== 'all'} onClear={() => setFilter('all')} />
          )}
        </div>
      </div>
      {actionTarget && actionTarget.newStatus === 'shortlisted' && (
        <ActionModal title="Shortlist Candidate?"
          desc="This will move the candidate to the shortlisted tab. They will be considered for the next round of interviews."
          icon={CheckCircle2}
          color={{ bg: 'bg-emerald-100', text: 'text-emerald-600', btn: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-200' }}
          confirmText={isProcessing ? "Processing..." : "Yes, Shortlist"}
          onConfirm={confirmUpdateStatus}
          onCancel={() => setActionTarget(null)}/>
      )}
      {actionTarget && actionTarget.newStatus === 'in review' && (
        <ActionModal title="Mark as In Review?"
          desc="This will update the candidate's status to In Review. It shows the candidate that you are actively considering their application."
          icon={Eye}
          color={{ bg: 'bg-orange-100', text: 'text-orange-600', btn: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-200' }}
          confirmText={isProcessing ? "Processing..." : "Yes, Mark Review"}
          onConfirm={confirmUpdateStatus}
          onCancel={() => setActionTarget(null)} />
      )}
      {actionTarget && actionTarget.newStatus === 'accepted' && (
        <ActionModal
          title="Approve Candidate?"
          desc="Are you sure you want to approve this candidate? This will mark them as Accepted."
          icon={CheckCircle2}
          color={{ bg: 'bg-emerald-100', text: 'text-emerald-700', btn: 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-emerald-200' }}
          confirmText={isProcessing ? "Processing..." : "Yes, Approve"}
          onConfirm={confirmUpdateStatus}
          onCancel={() => setActionTarget(null)}/>
      )}
      {actionTarget && actionTarget.newStatus === 'rejected' && (
        <ActionModal title="Reject Candidate?"
          desc="Are you sure you want to reject this application? This action will move them to the rejected tab."
          icon={XCircle}
          color={{ bg: 'bg-rose-100', text: 'text-rose-600', btn: 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-rose-200' }}
          confirmText={isProcessing ? "Processing..." : "Yes, Reject"}
          onConfirm={confirmUpdateStatus}
          onCancel={() => setActionTarget(null)}/>
      )}
      {actionTarget && actionTarget.newStatus === 'pending' && (
        <ActionModal
          title="Reset to Pending?"
          desc="This will reset the candidate's status back to Pending. They will appear in the Pending tab again."
          icon={Clock}
          color={{ bg: 'bg-gray-100', text: 'text-gray-600', btn: 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 shadow-gray-200' }}
          confirmText={isProcessing ? "Processing..." : "Yes, Reset"}
          onConfirm={confirmUpdateStatus}
          onCancel={() => setActionTarget(null)}/>
      )}
    </DashboardLayout>
  );
};

export default ApplicationViewer;