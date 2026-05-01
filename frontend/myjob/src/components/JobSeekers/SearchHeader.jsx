import React from 'react';
import { Search, MapPin, Target, LocateFixed } from 'lucide-react';

const SearchHeader = ({ filters, setFilters, onSearch }) => {
  const handleKeywordChange = (e) => {
    setFilters(prev => ({ ...prev, keyword: e.target.value }));
  };

  const handleLocationChange = (e) => {
    setFilters(prev => ({ ...prev, location: e.target.value }));
  };

  const handleApplyNow = (e) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  const clearLocation = () => {
    setFilters(prev => ({ ...prev, location: '' }));
  };

  return (
    <div className="w-full">
      <form onSubmit={handleApplyNow} className="flex flex-col lg:flex-row items-center gap-3">
        <div className="w-full lg:w-[45%] flex items-center relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600 z-10">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input type="text" 
            placeholder="Job title, keywords, or company" 
            value={filters?.keyword || ''}
            onChange={handleKeywordChange}
            className="w-full pl-14 pr-4 py-4 lg:py-5 bg-gray-50 border-2 border-transparent hover:border-gray-100 hover:bg-gray-100 rounded-2xl lg:rounded-l-2xl lg:rounded-r-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white text-gray-900 font-semibold text-sm lg:text-base transition-all shadow-inner outline-none placeholder:text-gray-400 placeholder:font-medium"/>
        </div>
        <div className="hidden lg:block w-1px h-12 bg-gray-200 z-10"></div>
        <div className="w-full lg:w-[45%] flex items-center relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-600 z-10">
            <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="City, state, or 'Remote'" 
            value={filters?.location || ''}
            onChange={handleLocationChange}
            className="w-full pl-14 pr-12 py-4 lg:py-5 bg-gray-50 border-2 border-transparent hover:border-gray-100 hover:bg-gray-100 rounded-2xl lg:rounded-r-2xl lg:rounded-l-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white text-gray-900 font-semibold text-sm lg:text-base transition-all shadow-inner outline-none placeholder:text-gray-400 placeholder:font-medium"/>
          {filters?.location && (
            <button 
              type="button"
              onClick={clearLocation}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-rose-500 transition-colors">
              <LocateFixed className="h-4 w-4" />
            </button>
          )}
        </div>
        <button 
          type="submit"
          className="w-full lg:w-auto flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 lg:py-5 rounded-2xl font-extrabold text-sm lg:text-base tracking-wide transition-all shadow-lg shadow-blue-500/30 active:scale-95 group overflow-hidden relative">
          <span className="absolute inset-0 w-full h-full -mt-1 rounded-2xl opacity-30 bg-linear-to-b from-transparent via-transparent to-black"></span>
          <Target className="h-5 w-5 group-hover:scale-110 transition-transform relative z-10" />
          <span className="relative z-10 whitespace-nowrap">Find Jobs</span>
        </button>
      </form>
    </div>
  );
};

export default SearchHeader;
