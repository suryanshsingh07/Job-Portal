import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Mail, Phone, MapPin, Globe, ArrowLeft, Briefcase,
  CheckCircle, FileText, User, Award, Loader2,
  Link as LinkIcon, ExternalLink, Calendar
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import moment from 'moment';

const JobSeekerProfileView = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.USER.GET_PUBLIC_PROFILE(userId));
        if (res.status === 200) {
          setProfile(res.data);
        }
      } catch (error) {
        toast.error('Failed to load profile');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId, navigate]);

  if (loading) {
    return (
      <DashboardLayout activeMenu="applicants">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-gray-500 font-medium">Loading profile…</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) return null;

  const data = {
    name: profile.name || 'Job Seeker',
    avatar: profile.avatar || null,
    title: profile.title || 'Professional',
    about: profile.bio || 'No bio provided.',
    email: profile.email || 'Not provided',
    phone: profile.phone || 'Not provided',
    location: profile.location || 'Not specified',
    portfolioUrl: profile.portfolioUrl || null,
    githubUrl: profile.githubUrl || null,
    skills: profile.skills || 'Not specified',
    experience: profile.experience || '0',
    resume: profile.resume || null,
    joined: profile.createdAt
      ? moment(profile.createdAt).format('MMMM YYYY')
      : 'Recently',
  };

  const skillsList = data.skills
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <DashboardLayout activeMenu="applicants">
      <div className="max-w-5xl mx-auto space-y-6 lg:space-y-8 pb-12">
        {/* Back button */}
        <button onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-blue-600 transition font-medium w-fit">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        {/* ─── Hero Cover & Header ─── */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
          <div className="h-40 sm:h-56 bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
          </div>

          <div className="px-5 sm:px-8 pb-8 relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 -mt-16 sm:-mt-20">
              {/* Avatar */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left z-10 w-full sm:w-auto">
                <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-3xl bg-white border-4 border-white shadow-xl flex items-center justify-center overflow-hidden bg-linear-to-br from-emerald-50 to-teal-50">
                  {data.avatar ? (
                    <img src={data.avatar} alt=""
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          data.name
                        )}&background=random&color=fff&size=200`;
                      }}/>
                  ) : (
                    <span className="text-5xl font-extrabold text-emerald-600 uppercase tracking-tighter">
                      {data.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="mb-2 sm:mb-4">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                      {data.name}
                    </h1>
                    <CheckCircle className="h-6 w-6 text-emerald-500"
                      title="Verified Profile"/>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-3 mt-1.5 text-sm sm:text-base font-medium flex-wrap">
                    <span className="text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                      {data.title}
                    </span>
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" /> {data.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Resume CTA */}
              {data.resume && (
                <div className="w-full sm:w-auto z-10 sm:mb-4">
                  <a href={data.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all shadow-md font-bold text-sm active:scale-95">
                    <FileText className="h-4 w-4" />
                    <span>View Resume</span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/*Grid layout*/}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* About */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-emerald-50 to-transparent rounded-bl-full opacity-50 pointer-events-none" />
              <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2 mb-5">
                <User className="h-5 w-5 text-emerald-500" />
                Professional Summary
              </h2>
              <div className="prose prose-sm sm:prose-base max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                <p>{data.about}</p>
              </div>
            </div>

            {/* Skills */}
            {skillsList.length > 0 && skillsList[0] !== 'Not specified' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2 mb-5">
                  <Award className="h-5 w-5 text-emerald-500" />
                  Skills & Expertise
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skillsList.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-100 text-emerald-800 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-linear-to-br from-emerald-50 to-teal-50 p-6 rounded-3xl border border-emerald-100/50 flex flex-col items-center justify-center text-center shadow-inner transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-white text-emerald-600 rounded-2xl flex items-center justify-center mb-3 shadow-sm border border-emerald-100/50">
                  <Award className="h-5 w-5" />
                </div>
                <p className="text-3xl font-extrabold text-gray-900">
                  {data.experience}+
                </p>
                <p className="text-xs text-gray-500 font-bold mt-1 tracking-wide uppercase">
                  Years Experience
                </p>
              </div>

              <div className="bg-linear-to-br from-cyan-50 to-blue-50 p-6 rounded-3xl border border-cyan-100/50 flex flex-col items-center justify-center text-center shadow-inner transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-white text-cyan-600 rounded-2xl flex items-center justify-center mb-3 shadow-sm border border-cyan-100/50">
                  <Calendar className="h-5 w-5" />
                </div>
                <p className="text-lg font-extrabold text-gray-900">
                  {data.joined}
                </p>
                <p className="text-xs text-gray-500 font-bold mt-1 tracking-wide uppercase">
                  Member Since
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                <Mail className="h-5 w-5 text-gray-400" />
                Contact Info
              </h2>
              <ul className="space-y-5">
                {/* Portfolio */}
                <li className="flex items-start group p-2 -mx-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="h-9 w-9 bg-gray-50 border border-gray-100 group-hover:bg-white group-hover:border-emerald-100 rounded-xl flex items-center justify-center shrink-0 mr-3 transition-colors">
                    <Globe className="h-4 w-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <div className="min-w-0 flex-1 mt-0.5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                      Portfolio
                    </p>
                    {data.portfolioUrl ? (
                      <a href={data.portfolioUrl.startsWith('http')
                          ? data.portfolioUrl
                          : `https://${data.portfolioUrl}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-blue-600 hover:underline flex items-center truncate">
                        {data.portfolioUrl.replace(/^https?:\/\//, '')}
                        <ExternalLink className="h-3 w-3 ml-1.5 shrink-0 opacity-50" />
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-gray-400">
                        Not provided
                      </p>
                    )}
                  </div>
                </li>

                {/* GitHub */}
                <li className="flex items-start group p-2 -mx-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="h-9 w-9 bg-gray-50 border border-gray-100 group-hover:bg-white group-hover:border-emerald-100 rounded-xl flex items-center justify-center shrink-0 mr-3 transition-colors">
                    <LinkIcon className="h-4 w-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <div className="min-w-0 flex-1 mt-0.5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                      GitHub
                    </p>
                    {data.githubUrl ? (
                      <a
                        href={data.githubUrl.startsWith('http')
                          ? data.githubUrl
                          : `https://${data.githubUrl}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-blue-600 hover:underline flex items-center truncate">
                        {data.githubUrl.replace(/^https?:\/\//, '')}
                        <ExternalLink className="h-3 w-3 ml-1.5 shrink-0 opacity-50" />
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-gray-400">
                        Not provided
                      </p>
                    )}
                  </div>
                </li>

                {/* Email */}
                <li className="flex items-start group p-2 -mx-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="h-9 w-9 bg-gray-50 border border-gray-100 group-hover:bg-white group-hover:border-emerald-100 rounded-xl flex items-center justify-center shrink-0 mr-3 transition-colors">
                    <Mail className="h-4 w-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <div className="min-w-0 flex-1 mt-0.5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                      Email Address
                    </p>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {data.email}
                    </p>
                  </div>
                </li>

                {/* Phone */}
                <li className="flex items-start group p-2 -mx-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="h-9 w-9 bg-gray-50 border border-gray-100 group-hover:bg-white group-hover:border-emerald-100 rounded-xl flex items-center justify-center shrink-0 mr-3 transition-colors">
                    <Phone className="h-4 w-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <div className="min-w-0 flex-1 mt-0.5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                      Phone Number
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {data.phone}
                    </p>
                  </div>
                </li>

                {/* Location */}
                <li className="flex items-start group p-2 -mx-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="h-9 w-9 bg-gray-50 border border-gray-100 group-hover:bg-white group-hover:border-emerald-100 rounded-xl flex items-center justify-center shrink-0 mr-3 transition-colors">
                    <MapPin className="h-4 w-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <div className="min-w-0 flex-1 mt-0.5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                      Location
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {data.location}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Resume Card */}
            {data.resume && (
              <div className="bg-linear-to-bl from-emerald-700 to-teal-800 p-6 sm:p-7 rounded-3xl shadow-lg relative overflow-hidden text-white">
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white rounded-full opacity-10 blur-xl" />
                <h3 className="relative text-lg font-extrabold mb-2">
                  Candidate's Resume
                </h3>
                <p className="relative text-emerald-100 text-sm mb-6 leading-relaxed font-medium">
                  Download and review the candidate's resume to evaluate their
                  qualifications.
                </p>
                <a href={data.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative w-full flex justify-between items-center px-5 py-3.5 bg-white text-emerald-700 font-extrabold rounded-xl hover:bg-emerald-50 transition-all shadow-md active:scale-95 group">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <span>View Resume PDF</span>
                  </div>
                  <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobSeekerProfileView;
