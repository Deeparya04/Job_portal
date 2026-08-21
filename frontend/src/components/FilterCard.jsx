import React from 'react'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFilter, clearAllFilters } from '@/redux/jobSlice'
import { RotateCcw, Filter } from 'lucide-react'

const filterCategories = [
    {
        id: "location",
        name: "Location",
        options: ["Bangalore", "Hyderabad", "Delhi NCR", "Pune", "Mumbai", "Remote"]
    },
    {
        id: "role",
        name: "Job Role",
        options: ["Frontend", "Backend", "Full Stack", "Developer", "Engineer"]
    },
    {
        id: "jobType",
        name: "Job Type",
        options: ["Full Time", "Part Time", "Remote", "Contract", "Internship"]
    },
    {
        id: "salary",
        name: "Salary Range",
        options: ["0-6 LPA", "6-12 LPA", "12-18 LPA", "18+ LPA"]
    }
];

const FilterCard = () => {
    const dispatch = useDispatch();
    const { selectedFilters } = useSelector(store => store.job);

    // Calculate total active filter count across all categories
    const totalActiveCount = selectedFilters 
        ? Object.values(selectedFilters).reduce((acc, curr) => acc + (Array.isArray(curr) ? curr.length : 0), 0)
        : 0;

    const handleCheckboxChange = (categoryId, value) => {
        dispatch(toggleFilter({ category: categoryId, value }));
    };

    const handleReset = () => {
        dispatch(clearAllFilters());
    };

    return (
        <div className='w-full bg-white p-5 rounded-2xl border border-gray-200 shadow-sm'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Filter className='w-4 h-4 text-purple-600' />
                    <h2 className='font-bold text-lg text-gray-800'>Filter Jobs</h2>
                    {
                        totalActiveCount > 0 && (
                            <span className='bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full'>
                                {totalActiveCount}
                            </span>
                        )
                    }
                </div>
                {
                    totalActiveCount > 0 && (
                        <Button 
                            type="button"
                            onClick={handleReset} 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 h-7 px-2 flex items-center gap-1 font-medium"
                        >
                            <RotateCcw className='w-3 h-3' />
                            <span>Reset</span>
                        </Button>
                    )
                }
            </div>

            <hr className='my-3 border-gray-100' />

            <div className='space-y-5'>
                {
                    filterCategories.map((category) => {
                        const currentCategorySelections = selectedFilters?.[category.id] || [];

                        return (
                            <div key={category.id} className='border-b border-gray-50 pb-3 last:border-none'>
                                <div className='flex items-center justify-between mb-2'>
                                    <h3 className='font-semibold text-sm text-gray-700'>{category.name}</h3>
                                    {
                                        currentCategorySelections.length > 0 && (
                                            <span className='text-[11px] text-purple-600 font-medium'>
                                                {currentCategorySelections.length} selected
                                            </span>
                                        )
                                    }
                                </div>
                                <div className='space-y-2'>
                                    {
                                        category.options.map((option, idx) => {
                                            const inputId = `filter-${category.id}-${idx}`;
                                            const isChecked = currentCategorySelections.includes(option);

                                            return (
                                                <div key={idx} className='flex items-center space-x-2.5'>
                                                    <input
                                                        type="checkbox"
                                                        id={inputId}
                                                        checked={isChecked}
                                                        onChange={() => handleCheckboxChange(category.id, option)}
                                                        className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500 cursor-pointer accent-[#6A38C2]"
                                                    />
                                                    <Label 
                                                        htmlFor={inputId} 
                                                        className={`text-sm font-normal cursor-pointer select-none transition ${
                                                            isChecked ? 'font-semibold text-purple-900' : 'text-gray-600 hover:text-gray-900'
                                                        }`}
                                                    >
                                                        {option}
                                                    </Label>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
};

export default FilterCard;