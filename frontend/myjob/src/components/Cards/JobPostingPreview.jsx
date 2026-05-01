import React from 'react'
import {Briefcase, MapPin, ArrowLeft, Tag, Send, Eye, CheckCircle2, Award, Building2, Clock, Users, Sparkles} from 'lucide-react'
import { useAuth } from '../../context/useAuth'

const formatINR = (amount) => {
  if (!amount) return '0';
  const num = parseInt(amount);
  if (isNaN(num)) return '0';
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toLocaleString('en-IN');
};

const MetaChip = ({ icon: Icon, children }) => (
  <div className='flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 text-sm font-medium text-white'>
    {Icon && <Icon className='h-3.5 w-3.5 shrink-0' />}
    {children}
  </div>
);

const SectionHeader = ({ icon: Icon, title, iconBg = 'bg-blue-50', iconColor = 'text-blue-600' }) => (
  <div className='flex items-center gap-2.5 mb-4'>
    <div className={`h-8 w-8 ${iconBg} rounded-lg flex items-center justify-center shrink-0`}>
      <Icon className={`h-4 w-4 ${iconColor}`} />
    </div>
    <h2 className='text-xl font-bold text-gray-900'>{title}</h2>
  </div>
);

const JobPostingPreview = ({ formData, setIsPreview }) => {
  const { user } = useAuth();

  const descriptionParagraphs = formData?.description
    ? formData.description.split('\n').filter((l) => l.trim())
    : [];

  const requirementsList = formData?.requirements
    ? formData.requirements.split('\n').filter((l) => l.trim())
    : [];

  const companyInitial =
    user?.companyName?.charAt(0).toUpperCase() ||
    user?.name?.charAt(0).toUpperCase() ||
    'C';

  const companyLabel = user?.companyName || user?.name || 'Your Company';

  return (
    <div className='min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-purple-50/20 py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='flex items-center justify-between mb-6'>
          <button
            onClick={() => setIsPreview(false)}
            className='group flex items-center gap-2 text-gray-600 hover:text-blue-600 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200'>
            <ArrowLeft className='h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200' />
            <span className='text-sm font-medium'>Back to Edit</span>
          </button>
          <div className='flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl'>
            <Eye className='h-4 w-4 text-amber-600' />
            <span className='text-sm font-semibold text-amber-700'>Preview Mode</span>
          </div>
        </div>
        <div className='bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100/80'>
          <div className='relative bg-linear-to-br from-blue-600 via-blue-700 to-purple-700 px-8 pt-8 pb-20 overflow-hidden'>
            <div className='absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full' />
            <div className='absolute -bottom-12 -left-12 w-48 h-48 bg-purple-400/20 rounded-full' />
            <div className='absolute top-1/2 right-1/4 w-24 h-24 bg-blue-400/10 rounded-full' />
            <div className='relative z-10'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='h-14 w-14 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-2xl flex items-center justify-center font-bold text-2xl text-white shadow-lg shrink-0'>
                  {companyInitial}
                </div>
                <div>
                  <p className='text-blue-200 text-xs font-semibold uppercase tracking-widest'>Posted by</p>
                  <h3 className='text-white font-bold text-lg leading-tight'>{companyLabel}</h3>
                </div>
              </div>
              <h1 className='text-3xl sm:text-4xl font-extrabold text-white mb-5 leading-tight tracking-tight'>
                {formData?.jobTitle || (
                  <span className='opacity-50 italic'>Job Title</span>
                )}
              </h1>
              <div className='flex flex-wrap gap-2.5'>
                <MetaChip icon={MapPin}>
                  {formData?.location || 'Location not specified'}
                </MetaChip>
                <MetaChip>
                  <span className='font-bold text-base leading-none mr-0.5'>₹</span>
                  {formatINR(formData?.salaryMin)} – ₹{formatINR(formData?.salaryMax)}
                  <span className='opacity-70 text-xs ml-1'>/ yr</span>
                </MetaChip>
                <MetaChip icon={Briefcase}>
                  {formData?.jobType || 'Job Type'}
                </MetaChip>
                {formData?.category && (
                  <MetaChip icon={Tag}>{formData.category}</MetaChip>
                )}
              </div>
            </div>
          </div>
          <div className='relative -mt-10 mx-6 sm:mx-10 bg-white rounded-2xl shadow-xl border border-gray-100 grid grid-cols-3 divide-x divide-gray-100 z-20'>
            <div className='flex flex-col items-center py-5 px-2'>
              <span className='text-xl sm:text-2xl font-extrabold text-blue-600'>
                ₹{formatINR(formData?.salaryMin) || '—'}
              </span>
              <span className='text-xs text-gray-400 font-semibold uppercase tracking-wide mt-1'>Min CTC</span>
            </div>
            <div className='flex flex-col items-center py-5 px-2'>
              <span className='text-xl sm:text-2xl font-extrabold text-purple-600'>
                ₹{formatINR(formData?.salaryMax) || '—'}
              </span>
              <span className='text-xs text-gray-400 font-semibold uppercase tracking-wide mt-1'>Max CTC</span>
            </div>
            <div className='flex flex-col items-center py-5 px-2'>
              <span className='text-xl sm:text-2xl font-extrabold text-emerald-600 truncate max-w-full px-1 text-center'>
                {formData?.jobType || '—'}
              </span>
              <span className='text-xs text-gray-400 font-semibold uppercase tracking-wide mt-1'>Job Type</span>
            </div>
          </div>
          <div className='px-8 pb-8 pt-6 space-y-8 mt-4'>
            <section>
              <SectionHeader icon={Briefcase} title='Job Description' iconBg='bg-blue-50' iconColor='text-blue-600' />
              <div className='bg-linear-to-br from-gray-50 to-blue-50/30 rounded-2xl p-6 border border-gray-100'>
                {descriptionParagraphs.length > 0 ? (
                  <div className='space-y-3'>
                    {descriptionParagraphs.map((para, i) => (
                      <p key={i} className='text-gray-600 leading-relaxed'>{para}</p>
                    ))}
                  </div>
                ) : (
                  <p className='text-gray-400 italic text-sm'>No description provided yet.</p>
                )}
              </div>
            </section>
            <section>
              <SectionHeader icon={CheckCircle2} title='Requirements' iconBg='bg-purple-50' iconColor='text-purple-600' />
              <div className='bg-linear-to-br from-gray-50 to-purple-50/30 rounded-2xl p-6 border border-gray-100'>
                {requirementsList.length > 0 ? (
                  <ul className='space-y-3'>
                    {requirementsList.map((req, i) => (
                      <li key={i} className='flex items-start gap-3'>
                        <div className='h-5 w-5 bg-purple-100 rounded-full flex items-center justify-center shrink-0 mt-0.5'>
                          <div className='h-2 w-2 bg-purple-500 rounded-full' />
                        </div>
                        <span className='text-gray-600 leading-relaxed'>{req}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className='text-gray-400 italic text-sm'>No requirements provided yet.</p>
                )}
              </div>
            </section>
            <section>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='bg-linear-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100'>
                  <div className='flex items-center gap-2 mb-3'>
                    <Award className='h-5 w-5 text-emerald-600' />
                    <h3 className='font-bold text-gray-900 text-sm uppercase tracking-wide'>Salary Package (CTC)</h3>
                  </div>
                  <div className='flex items-baseline gap-1 flex-wrap'>
                    <span className='text-2xl font-extrabold text-emerald-600'>
                      ₹{formatINR(formData?.salaryMin) || '0'}
                    </span>
                    <span className='text-gray-400 font-semibold text-lg'>–</span>
                    <span className='text-2xl font-extrabold text-emerald-600'>
                      ₹{formatINR(formData?.salaryMax) || '0'}
                    </span>
                  </div>
                  <p className='text-xs text-gray-500 font-medium mt-1.5'>Per annum (annual CTC)</p>
                </div>
                <div className='bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100'>
                  <div className='flex items-center gap-2 mb-3'>
                    <Tag className='h-5 w-5 text-blue-600' />
                    <h3 className='font-bold text-gray-900 text-sm uppercase tracking-wide'>Department & Type</h3>
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    <span className='inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold'>
                      {formData?.category || 'Uncategorized'}
                    </span>
                    <span className='inline-flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-bold'>
                      {formData?.jobType || 'Not specified'}
                    </span>
                  </div>
                </div>
              </div>
            </section>
            <section>
              <div className='flex items-center gap-4 p-5 bg-linear-to-r from-rose-50 to-pink-50 rounded-2xl border border-rose-100'>
                <div className='h-11 w-11 bg-rose-100 rounded-xl flex items-center justify-center shrink-0'>
                  <MapPin className='h-5 w-5 text-rose-500' />
                </div>
                <div>
                  <p className='text-[11px] text-rose-400 font-bold uppercase tracking-widest'>Work Location</p>
                  <p className='text-gray-900 font-bold mt-0.5 text-base'>
                    {formData?.location || 'Location not specified'}
                  </p>
                </div>
              </div>
            </section>
            <div className='pt-4 border-t border-gray-100'>
              <div className='relative bg-linear-to-r from-blue-600 to-purple-700 rounded-2xl p-7 text-white text-center overflow-hidden'>
                <div className='absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full' />
                <div className='relative z-10'>
                  <div className='flex items-center justify-center gap-2 mb-2'>
                    <Sparkles className='h-5 w-5 text-yellow-300' />
                    <h3 className='text-xl font-extrabold'>Ready to Post This Job?</h3>
                  </div>
                  <p className='text-white/75 text-sm mb-6 max-w-sm mx-auto'>
                    Everything looks great! Hit publish to reach thousands of talented candidates across India.
                  </p>
                  <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                    <button
                      onClick={() => setIsPreview(false)}
                      className='px-6 py-3 bg-white/15 hover:bg-white/25 border border-white/30 rounded-xl font-semibold text-sm transition-all duration-200 backdrop-blur-sm'>
                      ← Edit Details
                    </button>
                    <button
                      onClick={() => setIsPreview(false)}
                      className='px-8 py-3 bg-white text-blue-600 rounded-xl font-extrabold text-sm hover:bg-blue-50 transition-all duration-200 shadow-lg flex items-center justify-center gap-2'>
                      <Send className='h-4 w-4' />
                      Publish Job Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostingPreview;