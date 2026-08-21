import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Eye, MoreHorizontal, Briefcase } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../ui/badge'

const AdminJobsTable = () => { 
    const { allAdminJobs, searchJobByText } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allAdminJobs || []);
    const navigate = useNavigate();

    useEffect(() => { 
        if (!allAdminJobs) return;
        const filtered = allAdminJobs.filter((job) => {
            if (!searchJobByText) return true;
            return (
                job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || 
                job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase())
            );
        });
        setFilterJobs(filtered);
    }, [allAdminJobs, searchJobByText]);

    return (
        <div className='bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm'>
            <Table>
                <TableCaption className="pb-4">A list of your posted job openings</TableCaption>
                <TableHeader className="bg-gray-50">
                    <TableRow>
                        <TableHead className="font-bold">Company Name</TableHead>
                        <TableHead className="font-bold">Role</TableHead>
                        <TableHead className="font-bold">Date Posted</TableHead>
                        <TableHead className="font-bold">Applicants</TableHead>
                        <TableHead className="text-right font-bold">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        !filterJobs || filterJobs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                    No posted jobs found. Click "Post New Job" to create your first listing.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filterJobs.map((job) => (
                                <TableRow key={job._id} className="hover:bg-gray-50">
                                    <TableCell className="font-semibold text-gray-900">{job?.company?.name || "Company"}</TableCell>
                                    <TableCell>{job?.title}</TableCell>
                                    <TableCell>{job?.createdAt?.split("T")?.[0] || "Recently"}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-purple-50 text-purple-700 font-semibold border-purple-200">
                                            {job?.applications?.length || 0} applied
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right cursor-pointer">
                                        <Popover>
                                            <PopoverTrigger className="p-1 rounded-md hover:bg-gray-100">
                                                <MoreHorizontal className="w-5 h-5 text-gray-600" />
                                            </PopoverTrigger>
                                            <PopoverContent className="w-40 p-2" align="end">
                                                <button 
                                                    onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)} 
                                                    className='flex items-center gap-2 p-2 w-full hover:bg-purple-50 text-purple-700 rounded-md text-sm font-medium transition'
                                                >
                                                    <Eye className='w-4 h-4'/>
                                                    <span>View Applicants</span>
                                                </button>
                                                <button 
                                                    onClick={() => navigate(`/description/${job._id}`)} 
                                                    className='flex items-center gap-2 p-2 w-full hover:bg-gray-50 text-gray-700 rounded-md text-sm font-medium transition mt-1'
                                                >
                                                    <Briefcase className='w-4 h-4'/>
                                                    <span>Job Details</span>
                                                </button>
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                </TableRow>
                            ))
                        )
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AdminJobsTable