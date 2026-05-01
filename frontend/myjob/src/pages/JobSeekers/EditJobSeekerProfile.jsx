import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { User, Briefcase, Save, UploadCloud, Link as LinkIcon, MapPin, Mail, Phone, CheckCircle2, ChevronLeft, Image as ImageIcon, Building2, FileText, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const InputWrapper = ({ icon: Icon, label, required, children }) => (
  <div className="space-y-1.5 focus-within:text-blue-600">
    <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5 transition-colors">
      <Icon className="h-4 w-4" />
      {label}
      {required && <span className="text-rose-500">*</span>}
    </label>
    {children}
  </div>
);

const EditJobSeekerProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    title: "",
    skills: "",
    experience: "",
    githubUrl: "",
    portfolioUrl: "",
    bio: "",
    avatar: "",
    resume: ""
  });

  useEffect(() => {
    if (user && !formData.name) {
      setFormData({
        name: user.name || user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        title: user.title || "",
        skills: user.skills || "",
        experience: user.experience || "",
        githubUrl: user.githubUrl || "",
        portfolioUrl: user.portfolioUrl || "",
        bio: user.bio || user.about || "",
        avatar: user.avatar || "",
        resume: user.resume || ""
      });
    }

  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    const imageFormData = new FormData();
    imageFormData.append('image', file);

    try {
      setIsUploading(true);
      const res = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, imageFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.imageUrl) {
        setFormData(prev => ({ ...prev, avatar: res.data.imageUrl }));
        toast.success('Avatar uploaded successfully');
      }
    } catch (error) {
      toast.error('Failed to upload image. Please try again.');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Resume size should be less than 5MB');
      return;
    }

    const resumeFormData = new FormData();
    resumeFormData.append('image', file); // Backend expects 'image' field for both image and pdf uploads.

    try {
      setIsSubmitting(true);
      const res = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, resumeFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.imageUrl) {
        setFormData(prev => ({ ...prev, resume: res.data.imageUrl }));
        toast.success('Resume uploaded successfully');
      }
    } catch (error) {
      toast.error('Failed to upload resume. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResumeRemove = async () => {
    try {
      setIsSubmitting(true);
      if (formData.resume) {
        await axiosInstance.delete(API_PATHS.AUTH.DELETE_RESUME, { data: { resumeUrl: formData.resume } });
        setFormData(prev => ({ ...prev, resume: "" }));
        toast.success('Resume removed successfully');
      }
    } catch (error) {
      toast.error('Failed to remove resume');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error("Name and Email are required");
      return;
    }

    setIsSubmitting(true);

    try {
      const updatePayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone.trim() === "" ? null : formData.phone,
        location: formData.location,
        title: formData.title,
        skills: formData.skills,
        experience: formData.experience,
        githubUrl: formData.githubUrl,
        portfolioUrl: formData.portfolioUrl,
        bio: formData.bio,
        avatar: formData.avatar,
        resume: formData.resume
      };

      const res = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, updatePayload);
      updateUser(res.data);

      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-2xl pointer-events-auto flex ring-1 ring-black/5`}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="shrink-0 pt-0.5">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-bold text-gray-900">Profile Updated</p>
                <p className="mt-1 text-sm text-gray-500">Your professional profile has been successfully updated.</p>
              </div>
            </div>
          </div>
        </div>
      ));
      navigate("/profile");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout activeMenu="profile">
      <div className="max-w-4xl mx-auto pb-12 overflow-x-hidden">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm active:scale-95">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-extrabold text-gray-900">Edit Professional Profile</h1>
        </div>
        <div className="bg-white shadow-xl shadow-gray-200/40 border border-gray-100 rounded-3xl overflow-hidden relative">
          <div className="h-32 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
          </div>
          <form onSubmit={handleSave} className="p-6 md:p-10 -mt-16 relative z-10 space-y-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 pb-8 border-b border-gray-100">
              <div className="relative group">
                <div className="h-32 w-32 rounded-3xl bg-white border-4 border-white shadow-xl flex items-center justify-center overflow-hidden shrink-0 relative">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="" className="h-full w-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || "U")}&background=random&color=fff&size=200`; }} />
                  ) : (
                    <User className="h-12 w-12 text-gray-300" />
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center backdrop-blur-sm">
                      <div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <label className="absolute -bottom-3 -right-3 h-12 w-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-2xl flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 z-20">
                  <UploadCloud className="h-5 w-5" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                </label>
              </div>
              <div className="text-center sm:text-left pt-14 sm:pt-0">
                <h2 className="text-xl font-extrabold text-gray-900">{formData.name || 'Your Name'}</h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Upload a high quality professional profile photo.</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                  <div className="items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg inline-flex border border-gray-100">
                    <ImageIcon className="h-3.5 w-3.5" />
                    <span>JPEG, PNG (Max 2MB)</span>
                  </div>
                  {formData.avatar && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, avatar: "" }))}
                      className="text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-red-100 cursor-pointer">
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <InputWrapper icon={Briefcase} label="Full Name" required>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white text-gray-900 font-semibold transition-all outline-none"
                  placeholder="e.g. Jane Doe"/>
              </InputWrapper>

              <InputWrapper icon={Briefcase} label="Professional Title" required>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white text-gray-900 font-semibold transition-all outline-none"
                  placeholder="e.g. Senior Frontend Developer"/>
              </InputWrapper>

              <InputWrapper icon={Mail} label="Email Address" required>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-whit font-semibold transition-all outline-none text-gray-500 cursor-not-allowed"
                  disabled/>
              </InputWrapper>

              <InputWrapper icon={Phone} label="Phone Number">
                <input
                  type="tel"
                  name="phone"
                  inputMode="numeric"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setFormData(prev => ({ ...prev, phone: value }));
                  }}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white text-gray-900 font-semibold transition-all outline-none"
                  placeholder="+91 88745 XXXXX"/>
              </InputWrapper>

              <InputWrapper icon={MapPin} label="Location">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white text-gray-900 font-semibold transition-all outline-none"
                  placeholder="e.g., San Francisco, CA"/>
              </InputWrapper>

              <InputWrapper icon={Briefcase} label="Years of Experience">
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white text-gray-900 font-semibold transition-all outline-none"
                  placeholder="e.g. 4"/>
              </InputWrapper>

              <div className="md:col-span-2 mt-4">
                <InputWrapper icon={Building2} label="Key Skills (comma separated)">
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white text-gray-900 font-medium transition-all outline-none resize-none"
                    placeholder="React, Tailwind CSS, Node.js, Python . . ."></textarea>
                </InputWrapper>
              </div>

              <div>
                <InputWrapper icon={LinkIcon} label="GitHub Profile">
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white text-gray-900 font-semibold transition-all outline-none"
                    placeholder="https://github.com/alexdev"/>
                </InputWrapper>
              </div>

              <div>
                <InputWrapper icon={LinkIcon} label="Portfolio Website">
                  <input
                    type="url"
                    name="portfolioUrl"
                    value={formData.portfolioUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white text-gray-900 font-semibold transition-all outline-none"
                    placeholder="https://alex.dev"/>
                </InputWrapper>
              </div>

              <div className="md:col-span-2">
                <InputWrapper icon={Building2} label="About Me Summary">
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white text-gray-900 font-medium transition-all outline-none resize-y"
                    placeholder="Write a short summary highlighting your professional background, skills, and goals . . ."></textarea>
                </InputWrapper>
              </div>

              <div className="md:col-span-2">
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        Professional Resume
                      </h3>
                      <p className="text-sm text-gray-500 font-medium mt-1">Upload your resume in PDF format (Max 5MB)</p>
                    </div>
                  </div>

                  {formData.resume ? (
                    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="h-10 w-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center shrink-0">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {formData.resume.split('/').pop()}
                          </p>
                          <a href={formData.resume} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-blue-600 hover:underline">
                            View Document
                          </a>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleResumeRemove}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove Resume">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="border-2 border-dashed border-blue-200 bg-white rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors hover:border-blue-400 hover:bg-blue-50/50">
                        <UploadCloud className="h-8 w-8 text-blue-400 mb-3" />
                        <h4 className="text-sm font-bold text-gray-900 mb-1">Click to upload your resume</h4>
                        <p className="text-xs text-gray-500 font-medium">PDF formats only supported</p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleResumeUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isSubmitting}/>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 mt-8 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="w-full sm:w-auto px-8 py-3.5 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-95">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="w-full sm:w-auto flex items-center justify-center px-8 py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-extrabold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/30 active:scale-95 group">
                {isSubmitting ? (
                  <div className='animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2' />
                ) : (
                  <Save className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                )}
                {isSubmitting ? 'Saving Changes...' : 'Save & Update Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditJobSeekerProfile;
