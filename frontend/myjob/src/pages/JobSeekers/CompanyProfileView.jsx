import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Building2, Mail, Phone, MapPin, Globe, ArrowLeft,
  Briefcase, ShieldCheck, Calendar, Users, ExternalLink,
  Activity, Loader2
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import moment from 'moment';

const CompanyProfileView = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {

        const profileRes = await axiosInstance.get(API_PATHS.USER.GET_PUBLIC_PROFILE(companyId));
        if (profileRes.status === 200) {
          setCompany(profileRes.data);
        }

        const jobsRes = await axiosInstance.get(API_PATHS.JOBS.GET_ALL_JOBS);
        if (jobsRes.status === 200) {
          const allJobs = jobsRes.data || [];
          const companyJobs = allJobs.filter(
            (j) => (j.company?._id || j.company) === companyId
          );
          setJobs(companyJobs);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load company profile');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyData();
  }, [companyId, navigate]);

  if (loading) {
    return (
      <DashboardLayout activeMenu="find-jobs">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-gray-500 font-medium">Loading company profile…</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!company) return null;

  const profile = {
    name: company.companyName || company.name || 'Company',
    logo: company.avatar || company.companyLogo || null,
    description:
      company.companyDescription ||
      company.bio ||
      'This company hasn\'t added a description yet.',
    email: company.email || 'Not provided',
    phone: company.phone || 'Not provided',
    location: company.location || 'Not specified',
    website: company.website || null,
    industry: company.industry || 'General',
    teamSize: company.teamSize || '—',
    joined: company.createdAt
      ? moment(company.createdAt).format('MMMM YYYY')
      : 'Recently',
  };

  return (
    <DashboardLayout activeMenu="find-jobs">
      <div className="max-w-5xl mx-auto space-y-6 lg:space-y-8 pb-12">
        {}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-blue-600 transition font-medium w-fit">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
          <div className="h-40 sm:h-56 bg-linear-to-r from-blue-700 via-indigo-600 to-purple-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
          </div>
          <div className="px-5 sm:px-8 pb-8 relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 -mt-16 sm:-mt-20">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left z-10 w-full sm:w-auto">
                <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-3xl bg-white border-4 border-white shadow-xl flex items-center justify-center overflow-hidden bg-linear-to-br from-blue-50 to-indigo-50">
                  {profile.logo ? (
                    <img src={profile.logo}
                      alt=""
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          profile.name
                        )}&background=random&color=fff&size=200`;
                      }}/>
                  ) : (
                    <span className="text-5xl font-extrabold text-blue-600 uppercase tracking-tighter">
                      {profile.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="mb-2 sm:mb-4">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                      {profile.name}
                    </h1>
                    <ShieldCheck
                      className="h-6 w-6 text-emerald-500"
                      title="Verified Employer"/>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-3 mt-1.5 text-sm sm:text-base font-medium flex-wrap">
                    <span className="text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                      {profile.industry}
                    </span>
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" /> {profile.location}
                    </span>
                  </div>
                </div>
              </div>
              {profile.website && (
                <div className="w-full sm:w-auto z-10 sm:mb-4">
                  <a href={profile.website.startsWith('http')
                    ? profile.website
                    : `https://${profile.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all shadow-md font-bold text-sm active:scale-95">
                    <Globe className="h-4 w-4" />
                    <span>Visit Website</span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-50 to-transparent rounded-bl-full opacity-50 pointer-events-none" />
              <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2 mb-5">
                <Building2 className="h-5 w-5 text-blue-500" />
                About Company
              </h2>
              <div className="prose prose-sm sm:prose-base prose-blue max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                <p>{profile.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-linear-to-br from-blue-50 to-indigo-50 p-6 rounded-3xl border border-blue-100/50 flex flex-col items-center justify-center text-center shadow-inner transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center mb-3 shadow-sm border border-blue-100/50">
                  <Activity className="h-5 w-5" />
                </div>
                <p className="text-2xl font-extrabold text-gray-900">
                  {jobs.length}
                </p>
                <p className="text-xs text-gray-500 font-bold mt-1 tracking-wide uppercase">
                  Open Jobs
                </p>
              </div>
              <div className="bg-linear-to-br from-purple-50 to-pink-50 p-6 rounded-3xl border border-purple-100/50 flex flex-col items-center justify-center text-center shadow-inner transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-white text-purple-600 rounded-2xl flex items-center justify-center mb-3 shadow-sm border border-purple-100/50">
                  <Users className="h-5 w-5" />
                </div>
                <p className="text-2xl font-extrabold text-gray-900">
                  {profile.teamSize}
                </p>
                <p className="text-xs text-gray-500 font-bold mt-1 tracking-wide uppercase">
                  Team Size
                </p>
              </div>
              <div className="bg-linear-to-br from-emerald-50 to-teal-50 p-6 rounded-3xl border border-emerald-100/50 flex flex-col items-center justify-center text-center shadow-inner transition-all hover:-translate-y-1 col-span-2 sm:col-span-1">
                <div className="w-12 h-12 bg-white text-emerald-600 rounded-2xl flex items-center justify-center mb-3 shadow-sm border border-emerald-100/50">
                  <Calendar className="h-5 w-5" />
                </div>
                <p className="text-2xl font-extrabold text-gray-900">
                  {profile.joined}
                </p>
                <p className="text-xs text-gray-500 font-bold mt-1 tracking-wide uppercase">
                  Member Since
                </p>
              </div>
            </div>
            {jobs.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2 mb-6">
                  <Briefcase className="h-5 w-5 text-blue-500" />
                  Open Positions ({jobs.length})
                </h2>
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <Link
                      key={job._id}
                      to={`/job/${job._id}`}
                      className="group flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors truncate">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 flex-wrap">
                          {job.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {job.location}
                            </span>
                          )}
                          {job.type && (
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-3.5 w-3.5" />
                              {job.type}
                            </span>
                          )}
                          {(job.salaryMin || job.salaryMax) && (
                            <span className="font-semibold text-gray-600">
                              ₹
                              {job.salaryMin >= 100000
                                ? `${(job.salaryMin / 100000).toFixed(1)}L`
                                : `${(job.salaryMin / 1000).toFixed(0)}K`}
                              {' – '}
                              {job.salaryMax >= 100000
                                ? `${(job.salaryMax / 100000).toFixed(1)}L`
                                : `${(job.salaryMax / 1000).toFixed(0)}K`}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity ml-4 shrink-0">
                        <ExternalLink className="h-4 w-4" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                <Mail className="h-5 w-5 text-gray-400" />
                Contact Info
              </h2>
              <ul className="space-y-5">
                <li className="flex items-start group p-2 -mx-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="h-9 w-9 bg-gray-50 border border-gray-100 group-hover:bg-white group-hover:border-blue-100 rounded-xl flex items-center justify-center shrink-0 mr-3 transition-colors">
                    <Globe className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <div className="min-w-0 flex-1 mt-0.5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                      Website
                    </p>
                    {profile.website ? (
                      <a href={profile.website.startsWith('http')
                        ? profile.website
                        : `https://${profile.website}`
                      }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-blue-600 hover:underline flex items-center truncate">
                        {profile.website.replace(/^https?:\/\//, '')}
                        <ExternalLink className="h-3 w-3 ml-1.5 shrink-0 opacity-50" />
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-gray-400">
                        Not provided
                      </p>
                    )}
                  </div>
                </li>
                <li className="flex items-start group p-2 -mx-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="h-9 w-9 bg-gray-50 border border-gray-100 group-hover:bg-white group-hover:border-blue-100 rounded-xl flex items-center justify-center shrink-0 mr-3 transition-colors">
                    <Mail className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <div className="min-w-0 flex-1 mt-0.5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                      Email Address
                    </p>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {profile.email}
                    </p>
                  </div>
                </li>
                <li className="flex items-start group p-2 -mx-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="h-9 w-9 bg-gray-50 border border-gray-100 group-hover:bg-white group-hover:border-blue-100 rounded-xl flex items-center justify-center shrink-0 mr-3 transition-colors">
                    <Phone className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <div className="min-w-0 flex-1 mt-0.5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                      Phone Number
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {profile.phone}
                    </p>
                  </div>
                </li>
                <li className="flex items-start group p-2 -mx-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="h-9 w-9 bg-gray-50 border border-gray-100 group-hover:bg-white group-hover:border-blue-100 rounded-xl flex items-center justify-center shrink-0 mr-3 transition-colors">
                    <MapPin className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <div className="min-w-0 flex-1 mt-0.5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                      Location
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {profile.location}
                    </p>
                  </div>
                </li>
                <li className="flex items-start group p-2 -mx-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="h-9 w-9 bg-gray-50 border border-gray-100 group-hover:bg-white group-hover:border-blue-100 rounded-xl flex items-center justify-center shrink-0 mr-3 transition-colors">
                    <Calendar className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <div className="min-w-0 flex-1 mt-0.5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                      Member Since
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {profile.joined}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CompanyProfileView;
