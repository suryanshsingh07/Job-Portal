import React from 'react'

const FilterContent = ({ filters, setFilters }) => {
  
  const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"];
  const EXP_LEVELS = ["Entry Level", "Mid Level", "Senior", "Director", "Executive"];
  const SALARY_RANGES = [
    { label: "Any", min: null },
    { label: "$30k - $50k", min: 30000 },
    { label: "$50k - $80k", min: 50000 },
    { label: "$80k - $120k", min: 80000 },
    { label: "$120k+", min: 120000 },
  ];

  const handleCheckboxChange = (type, value) => {
    setFilters(prev => {
      const currentList = prev[type] || [];
      const updatedList = currentList.includes(value)
        ? currentList.filter(item => item !== value)
        : [...currentList, value];
      
      return { ...prev, [type]: updatedList };
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-8 sticky top-24">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <h3 className="text-lg font-bold text-gray-900">Job Type</h3>
        <button 
          onClick={() => setFilters({ keyword: "", location: "", jobTypes: [], expLevels: [], minSalary: null })}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline px-2 py-1 bg-blue-50 hover:bg-blue-100 transition-colors rounded-md">
          Clear All
        </button>
      </div>
      <div>
        <div className="space-y-3">
          {JOB_TYPES.map(type => (
            <label key={type} className="flex items-center space-x-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={filters.jobTypes?.includes(type)}
                onChange={() => handleCheckboxChange('jobTypes', type)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"/>
              <span className="text-gray-600 group-hover:text-gray-900 font-medium transition-colors">{type}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Experience Level</h3>
        <div className="space-y-3">
          {EXP_LEVELS.map(level => (
            <label key={level} className="flex items-center space-x-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={filters.expLevels?.includes(level)}
                onChange={() => handleCheckboxChange('expLevels', level)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
              <span className="text-gray-600 group-hover:text-gray-900 font-medium transition-colors">{level}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Salary Range</h3>
        <div className="space-y-3">
          {SALARY_RANGES.map((range, index) => (
            <label key={index} className="flex items-center space-x-3 cursor-pointer group">
              <input 
                type="radio" 
                name="salaryFilter"
                checked={filters.minSalary === range.min}
                onChange={() => setFilters(prev => ({ ...prev, minSalary: range.min }))}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer" />
              <span className="text-gray-600 group-hover:text-gray-900 font-medium transition-colors">{range.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FilterContent;
