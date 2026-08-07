import React from 'react';
import { Filter, RotateCcw, MapPin, Briefcase, Laptop, Clock } from 'lucide-react';
import { LOCATIONS, WORK_MODES, SHIFT_TYPES, EXPERIENCE_LEVELS } from '../data/jobsData';
import { FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onResetFilters: () => void;
  activeCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  activeCount
}) => {
  const isFiltered =
    filters.department !== 'All Departments' ||
    filters.location !== 'All Locations' ||
    filters.experience !== 'All Experience Levels' ||
    filters.workMode !== 'All Work Modes' ||
    filters.shiftType !== 'All Shifts' ||
    filters.searchQuery !== '';

  return (
    <div className="bg-[#141C2E] border border-[#2A364F] rounded-2xl p-4 shadow-lg mb-8 text-slate-200">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Filter Bar Header */}
        <div className="flex items-center justify-between gap-2 border-b lg:border-b-0 border-[#2A364F] pb-3 lg:pb-0">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#FF6B00]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Filter Openings
            </span>
            <span className="text-xs text-slate-400 font-medium">({activeCount} roles found)</span>
          </div>

          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-xs text-[#FF6B00] hover:text-[#FF8A00] font-semibold transition-colors"
              id="reset-filters-btn"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All</span>
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 flex-1 lg:max-w-4xl">
          
          {/* Location Filter */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B0F19] border border-[#2A364F] focus-within:border-[#FF6B00] transition-colors">
            <MapPin className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
            <select
              value={filters.location}
              onChange={(e) => onFilterChange('location', e.target.value)}
              className="w-full bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
              id="filter-location-select"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc} className="bg-[#141C2E] text-slate-200">
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Work Mode Filter */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B0F19] border border-[#2A364F] focus-within:border-[#FF6B00] transition-colors">
            <Laptop className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <select
              value={filters.workMode}
              onChange={(e) => onFilterChange('workMode', e.target.value)}
              className="w-full bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
              id="filter-workmode-select"
            >
              {WORK_MODES.map((wm) => (
                <option key={wm} value={wm} className="bg-[#141C2E] text-slate-200">
                  {wm}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Filter */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B0F19] border border-[#2A364F] focus-within:border-[#FF6B00] transition-colors">
            <Briefcase className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <select
              value={filters.experience}
              onChange={(e) => onFilterChange('experience', e.target.value)}
              className="w-full bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
              id="filter-experience-select"
            >
              {EXPERIENCE_LEVELS.map((exp) => (
                <option key={exp} value={exp} className="bg-[#141C2E] text-slate-200">
                  {exp}
                </option>
              ))}
            </select>
          </div>

          {/* Shift Type Filter */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B0F19] border border-[#2A364F] focus-within:border-[#FF6B00] transition-colors">
            <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <select
              value={filters.shiftType}
              onChange={(e) => onFilterChange('shiftType', e.target.value)}
              className="w-full bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
              id="filter-shifttype-select"
            >
              {SHIFT_TYPES.map((st) => (
                <option key={st} value={st} className="bg-[#141C2E] text-slate-200">
                  {st}
                </option>
              ))}
            </select>
          </div>

        </div>

      </div>
    </div>
  );
};
