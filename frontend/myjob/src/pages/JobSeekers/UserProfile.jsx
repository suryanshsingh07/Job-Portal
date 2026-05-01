import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, Edit, Briefcase, CheckCircle, FileText, User, Award, Link as LinkIcon} from 'lucide-react';
import moment from 'moment';

const UserProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const profile = {
    name: user?.name || user?.fullName || "Your Name",
    avatar: user?.avatar || null,
    title: user?.title || "Professional Title Not Set",
    about: user?.bio || user?.about || "You haven't added an about section yet. Click Edit Profile to tell employers about your skills, experience, and career goals.",
    email: user?.email || "No email provided",
    phone: user?.phone || "Phone not added",
    location: user?.location || "Location not set",
    portfolioUrl: user?.portfolioUrl || null,
    githubUrl: user?.githubUrl || null,
    skills: user?.skills || "Not specified",
    experience: user?.experience || "0",
    resume: user?.resume || null,
    joined: user?.createdAt ? moment(user.createdAt).format('MMMM YYYY') : "Recently",
  };

  return (
    <DashboardLayout activeMenu="profile">
      <div className="max-w-5xl mx-auto space-y-6 lg:space-y-8 pb-12">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative group">
          <div className="h-40 sm:h-56 bg-linear-to-r from-blue-700 via-indigo-600 to-purple-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          </div>  
          <div className="px-5 sm:px-8 pb-8 relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 -mt-16 sm:-mt-20">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left z-10 w-full sm:w-auto">
                <div className="relative isolate">
                  <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-3xl bg-white border-4 border-white shadow-xl flex items-center justify-center overflow-hidden bg-linear-to-br from-blue-50 to-indigo-50">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="" className="h-full w-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || "U")}&background=random&color=fff&size=200`; }} />
                    ) : (
                      <span className="text-5xl font-extrabold text-blue-600 uppercase tracking-tighter">
                        {profile.name.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mb-2 sm:mb-4">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">{profile.name}</h1>
                    <CheckCircle className="h-6 w-6 text-emerald-500" title="Verified Profile" />
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-3 mt-1.5 text-sm sm:text-base font-medium">
                    <span className="text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                      {profile.title}
                    </span>
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" /> {profile.location}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full sm:w-auto z-10 sm:mb-4">
                <button 
                  onClick={() => navigate('/edit-profile')}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all shadow-md font-bold text-sm active:scale-95">
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-50 to-transparent rounded-bl-full opacity-50 pointer-events-none" />
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  Professional Summary
                </h2>
                <button 
                  onClick={() => navigate('/edit-profile')}
                  className="text-sm font-bold text-blue-600 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  Edit
                </button>
              </div>
              <div className="prose prose-sm sm:prose-base prose-blue max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                <p>{profile.about}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-linear-to-br from-blue-50 to-indigo-50 p-6 rounded-3xl border border-blue-100/50 flex flex-col items-center justify-center text-center shadow-inner group transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center mb-3 shadow-sm border border-blue-100/50 group-hover:scale-110 transition-transform">
                  <Award className="h-5 w-5" />
                </div>
                <p className="text-3xl font-extrabold text-gray-900">{profile.experience}+</p>
                <p className="text-sm text-gray-500 font-bold mt-1 tracking-wide uppercase">Years Experience</p>
              </div>  
              <div className="bg-linear-to-br from-purple-50 to-pink-50 p-6 rounded-3xl border border-purple-100/50 flex flex-col items-center justify-center text-center shadow-inner group transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-white text-purple-600 rounded-2xl flex items-center justify-center mb-3 shadow-sm border border-purple-100/50 group-hover:scale-110 transition-transform">
                  <Briefcase className="h-5 w-5" />
                </div>
                <p className="text-lg font-extrabold text-gray-900 truncate px-2">{profile.skills}</p>
                <p className="text-sm text-gray-500 font-bold mt-1 tracking-wide uppercase">Core Skills</p>
              </div>
            </div>
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
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Portfolio</p>
                    {profile.portfolioUrl ? (
                      <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-600 hover:underline flex items-center truncate">
                        {profile.portfolioUrl.replace(/^https?:\/\//, '')}
                      </a>
                    ) : (
                      <span className="text-sm font-semibold text-gray-400">Not provided</span>
                    )}
                  </div>
                </li>
                <li className="flex items-start group p-2 -mx-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="h-9 w-9 bg-gray-50 border border-gray-100 group-hover:bg-white group-hover:border-blue-100 rounded-xl flex items-center justify-center shrink-0 mr-3 transition-colors">
                    <LinkIcon className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <div className="min-w-0 flex-1 mt-0.5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">GitHub</p>
                    {profile.githubUrl ? (
                      <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-600 hover:underline flex items-center truncate">
                        {profile.githubUrl.replace(/^https?:\/\//, '')}
                      </a>
                    ) : (
                      <span className="text-sm font-semibold text-gray-400">Not provided</span>
                    )}
                  </div>
                </li>
                <li className="flex items-start group p-2 -mx-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="h-9 w-9 bg-gray-50 border border-gray-100 group-hover:bg-white group-hover:border-blue-100 rounded-xl flex items-center justify-center shrink-0 mr-3 transition-colors">
                    <Mail className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <div className="min-w-0 flex-1 mt-0.5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Email Address</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">{profile.email}</p>
                  </div>
                </li>
                <li className="flex items-start group p-2 -mx-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="h-9 w-9 bg-gray-50 border border-gray-100 group-hover:bg-white group-hover:border-blue-100 rounded-xl flex items-center justify-center shrink-0 mr-3 transition-colors">
                    <Phone className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <div className="min-w-0 flex-1 mt-0.5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Phone Number</p>
                    <p className="text-sm font-semibold text-gray-900">{profile.phone}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-linear-to-bl from-blue-700 to-indigo-800 p-6 sm:p-7 rounded-3xl shadow-lg relative overflow-hidden text-white">
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white rounded-full opacity-10 blur-xl"></div>
              <h3 className="relative text-lg font-extrabold mb-2">Your Resume</h3>
              <p className="relative text-blue-100 text-sm mb-6 leading-relaxed font-medium">Keep your resume up to date to increase your chances of being hired.</p>
              {profile.resume ? (
                <a 
                  href={profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative w-full flex justify-between items-center px-5 py-3.5 bg-white text-blue-700 font-extrabold rounded-xl hover:bg-blue-50 transition-all shadow-md active:scale-95 group">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <span>View Resume PDF</span>
                  </div>
                </a>
              ) : (
                <button 
                  onClick={() => navigate('/edit-profile')}
                  className="relative w-full flex justify-between items-center px-5 py-3.5 bg-white text-blue-700 font-extrabold rounded-xl hover:bg-blue-50 transition-all shadow-md active:scale-95 group">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <span>Upload Resume</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;