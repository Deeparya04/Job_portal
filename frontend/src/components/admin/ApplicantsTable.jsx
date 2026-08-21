import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal, FileText, CheckCircle, XCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { Badge } from '../ui/badge';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);

    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            if (res.data.success) {
                toast.success(res.data.message || `Status updated to ${status}`);
            }
        } catch (error) {
            console.error("Status update error:", error);
            toast.error(error?.response?.data?.message || "Failed to update status.");
        }
    }

    const applicationList = applicants?.applications || [];

    return (
        <div className='bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm'>
            <Table>
                <TableCaption className="pb-4">A list of recent applicants for this position</TableCaption>
                <TableHeader className="bg-gray-50">
                    <TableRow>
                        <TableHead className="font-bold">Full Name</TableHead>
                        <TableHead className="font-bold">Email</TableHead>
                        <TableHead className="font-bold">Contact</TableHead>
                        <TableHead className="font-bold">Resume</TableHead>
                        <TableHead className="font-bold">Status</TableHead>
                        <TableHead className="text-right font-bold">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        applicationList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                    No candidates have applied to this job yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            applicationList.map((item) => (
                                <TableRow key={item._id} className="hover:bg-gray-50">
                                    <TableCell className="font-medium text-gray-900">{item?.applicant?.fullname || "Candidate"}</TableCell>
                                    <TableCell>{item?.applicant?.email || "N/A"}</TableCell>
                                    <TableCell>{item?.applicant?.phoneNumber || "N/A"}</TableCell>
                                    <TableCell>
                                        {
                                            item?.applicant?.profile?.resume ? (
                                                <a 
                                                    className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 font-medium text-xs bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200" 
                                                    href={item.applicant.profile.resume} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                >
                                                    <FileText className='w-3.5 h-3.5' />
                                                    <span>Resume</span>
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 text-xs">No Resume</span>
                                            )
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <Badge 
                                            variant="outline" 
                                            className={`font-semibold capitalize text-xs ${
                                                item?.status === 'accepted' 
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                                    : item?.status === 'rejected' 
                                                    ? 'bg-red-50 text-red-700 border-red-200' 
                                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                            }`}
                                        >
                                            {item?.status || "Pending"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Popover>
                                            <PopoverTrigger className="p-1 rounded-md hover:bg-gray-100">
                                                <MoreHorizontal className="w-5 h-5 text-gray-600" />
                                            </PopoverTrigger>
                                            <PopoverContent className="w-36 p-2" align="end">
                                                <button
                                                    onClick={() => statusHandler("Accepted", item?._id)} 
                                                    className='flex items-center gap-2 p-1.5 w-full hover:bg-emerald-50 text-emerald-700 rounded-md text-xs font-semibold transition'
                                                >
                                                    <CheckCircle className='w-3.5 h-3.5' />
                                                    <span>Accept</span>
                                                </button>
                                                <button
                                                    onClick={() => statusHandler("Rejected", item?._id)} 
                                                    className='flex items-center gap-2 p-1.5 w-full hover:bg-red-50 text-red-700 rounded-md text-xs font-semibold transition mt-1'
                                                >
                                                    <XCircle className='w-3.5 h-3.5' />
                                                    <span>Reject</span>
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

export default ApplicantsTable