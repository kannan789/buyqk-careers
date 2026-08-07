import React from 'react';
import { 
  Headphones, 
  Truck, 
  Code2, 
  ShoppingBag, 
  Store, 
  Layers
} from 'lucide-react';
import { DEPARTMENTS } from '../data/jobsData';

interface CategoryTabsProps {
  selectedDepartment: string;
  onSelectDepartment: (dept: string) => void;
  getDeptCount: (dept: string) => number;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  selectedDepartment,
  onSelectDepartment,
  getDeptCount
}) => {
  const getIcon = (dept: string) => {
    switch (dept) {
      case 'Customer Trust & Partner Support':
        return <Headphones className="w-4 h-4" />;
      case 'Operations & Darkstore Logistics':
        return <Truck className="w-4 h-4" />;
      case 'Engineering & AI Product':
        return <Code2 className="w-4 h-4" />;
      case 'Category Management & Merchandising':
        return <ShoppingBag className="w-4 h-4" />;
      case 'Merchant Partner Operations':
        return <Store className="w-4 h-4" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-[#0B0F19] py-4 border-b border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
          {DEPARTMENTS.map((dept) => {
            const isSelected = selectedDepartment === dept;
            const count = getDeptCount(dept);

            return (
              <button
                key={dept}
                onClick={() => onSelectDepartment(dept)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                  isSelected
                    ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-md shadow-[#FF6B00]/20 scale-102'
                    : 'bg-[#141C2E] text-slate-300 border-[#2A364F] hover:bg-[#1E293B] hover:text-white hover:border-[#FF6B00]/40'
                }`}
                id={`dept-tab-${dept.toLowerCase().replace(/[^a-z0-0]/g, '-')}`}
              >
                <span className={isSelected ? 'text-white' : 'text-[#FF6B00]'}>
                  {getIcon(dept)}
                </span>
                <span>{dept}</span>
                <span
                  className={`ml-1 px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                    isSelected
                      ? 'bg-black/20 text-white'
                      : 'bg-[#0B0F19] text-slate-400 group-hover:text-white'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
