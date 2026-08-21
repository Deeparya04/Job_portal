import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { toggleFilter, clearAllFilters } from '@/redux/jobSlice';
import { X, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';

const Jobs = () => {
    useGetAllJobs();
    const dispatch = useDispatch();
    const { allJobs, searchedQuery, selectedFilters } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs || []);

    useEffect(() => {
        if (!allJobs) return;

        let filtered = [...allJobs];

        // 1. Text Query Filter (from Hero search / search bar)
        if (searchedQuery && typeof searchedQuery === 'string' && searchedQuery.trim()) {
            const query = searchedQuery.toLowerCase().trim();
            filtered = filtered.filter((job) => {
                return (
                    job?.title?.toLowerCase().includes(query) ||
                    job?.description?.toLowerCase().includes(query) ||
                    job?.location?.toLowerCase().includes(query) ||
                    job?.jobType?.toLowerCase().includes(query) ||
                    job?.company?.name?.toLowerCase().includes(query) ||
                    job?.requirements?.some(req => req.toLowerCase().includes(query))
                );
            });
        }

        // 2. Category: Location Filter
        const selectedLocations = selectedFilters?.location || [];
        if (selectedLocations.length > 0) {
            filtered = filtered.filter((job) => {
                const jobLoc = (job?.location || "").toLowerCase();
                return selectedLocations.some(loc => jobLoc.includes(loc.toLowerCase()));
            });
        }

        // 3. Category: Role Filter
        const selectedRoles = selectedFilters?.role || [];
        if (selectedRoles.length > 0) {
            filtered = filtered.filter((job) => {
                const title = (job?.title || "").toLowerCase();
                const desc = (job?.description || "").toLowerCase();
                const reqs = (job?.requirements || []).map(r => r.toLowerCase()).join(" ");
                return selectedRoles.some(role => {
                    const r = role.toLowerCase();
                    return title.includes(r) || desc.includes(r) || reqs.includes(r);
                });
            });
        }

        // 4. Category: Job Type Filter
        const selectedJobTypes = selectedFilters?.jobType || [];
        if (selectedJobTypes.length > 0) {
            filtered = filtered.filter((job) => {
                const type = (job?.jobType || "").toLowerCase();
                return selectedJobTypes.some(t => type.includes(t.toLowerCase()));
            });
        }

        // 5. Category: Salary Range Filter
        const selectedSalaries = selectedFilters?.salary || [];
        if (selectedSalaries.length > 0) {
            filtered = filtered.filter((job) => {
                const salary = Number(job?.salary || 0);
                return selectedSalaries.some(range => {
                    if (range === "0-6 LPA") return salary <= 6;
                    if (range === "6-12 LPA") return salary > 6 && salary <= 12;
                    if (range === "12-18 LPA") return salary > 12 && salary <= 18;
                    if (range === "18+ LPA") return salary > 18;
                    return true;
                });
            });
        }

        setFilterJobs(filtered);
    }, [allJobs, searchedQuery, selectedFilters]);

    // Flatten all active filters for pills display
    const activeFilterPills = [];
    if (selectedFilters) {
        Object.entries(selectedFilters).forEach(([category, values]) => {
            if (Array.isArray(values)) {
                values.forEach(value => {
                    activeFilterPills.push({ category, value });
                });
            }
        });
    }

    return (
        <div className='min-h-screen bg-gray-50/50'>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-6 px-4'>
                <div className='flex flex-col md:flex-row gap-6'>
                    {/* Left Sidebar Filter Card */}
                    <div className='w-full md:w-1/4'>
                        <FilterCard />
                    </div>

                    {/* Right Jobs Listing */}
                    <div className='flex-1 pb-10'>
                        {/* Active Filter Pills Bar */}
                        {
                            (activeFilterPills.length > 0 || (searchedQuery && searchedQuery.trim())) && (
                                <div className='flex flex-wrap items-center gap-2 mb-4 bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm'>
                                    <span className='text-xs font-semibold text-gray-500 mr-1'>Active Filters:</span>
                                    
                                    {
                                        searchedQuery && (
                                            <span className='inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-700 font-semibold px-2.5 py-1 rounded-lg border border-purple-200'>
                                                Keyword: "{searchedQuery}"
                                            </span>
                                        )
                                    }

                                    {
                                        activeFilterPills.map(({ category, value }) => (
                                            <button
                                                key={`${category}-${value}`}
                                                onClick={() => dispatch(toggleFilter({ category, value }))}
                                                className='inline-flex items-center gap-1 text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold px-2.5 py-1 rounded-lg border border-purple-200 transition'
                                            >
                                                <span>{value}</span>
                                                <X className='w-3 h-3 text-purple-600' />
                                            </button>
                                        ))
                                    }

                                    <Button
                                        onClick={() => dispatch(clearAllFilters())}
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 h-6 px-2 ml-auto flex items-center gap-1 font-medium"
                                    >
                                        <RotateCcw className='w-3 h-3' />
                                        <span>Clear All</span>
                                    </Button>
                                </div>
                            )
                        }

                        {
                            filterJobs.length <= 0 ? (
                                <div className='bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm'>
                                    <h3 className='text-lg font-bold text-gray-800'>No Jobs Match Your Filters</h3>
                                    <p className='text-sm text-gray-500 mt-1 mb-4'>Try unchecking some filter options to see more job listings.</p>
                                    <Button 
                                        onClick={() => dispatch(clearAllFilters())}
                                        className="bg-[#6A38C2] hover:bg-[#5b30a6] text-xs font-semibold rounded-xl"
                                    >
                                        Reset All Filters
                                    </Button>
                                </div>
                            ) : (
                                <div>
                                    <div className='flex justify-between items-center mb-4'>
                                        <h2 className='font-bold text-gray-800 text-lg'>
                                            Showing {filterJobs.length} Available {filterJobs.length === 1 ? 'Job' : 'Jobs'}
                                        </h2>
                                    </div>
                                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5'>
                                        <AnimatePresence>
                                            {
                                                filterJobs.map((job) => (
                                                    <motion.div
                                                        layout
                                                        initial={{ opacity: 0, y: 15 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        transition={{ duration: 0.2 }}
                                                        key={job?._id}>
                                                        <Job job={job} />
                                                    </motion.div>
                                                ))
                                            }
                                        </AnimatePresence>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Jobs