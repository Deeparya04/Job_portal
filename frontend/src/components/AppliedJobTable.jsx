import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'

const AppliedJobTable = () => {
    const { allAppliedJobs } = useSelector(store => store.job);
    const appliedList = allAppliedJobs || [];

    return (
        <div className='bg-white rounded-xl border border-gray-100 overflow-hidden'>
            <Table>
                <TableCaption className="pb-4">A record of all your submitted job applications</TableCaption>
                <TableHeader className="bg-gray-50">
                    <TableRow>
                        <TableHead className="font-bold">Date</TableHead>
                        <TableHead className="font-bold">Job Role</TableHead>
                        <TableHead className="font-bold">Company</TableHead>
                        <TableHead className="text-right font-bold">Application Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        appliedList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                    You have not applied to any jobs yet.{" "}
                                    <Link to="/jobs" className="text-purple-600 font-semibold hover:underline">
                                        Explore open positions
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ) : (
                            appliedList.map((appliedJob) => (
                                <TableRow key={appliedJob._id} className="hover:bg-gray-50">
                                    <TableCell className="text-gray-500">{appliedJob?.createdAt?.split("T")?.[0] || "Recently"}</TableCell>
                                    <TableCell className="font-semibold text-gray-900">{appliedJob?.job?.title || "Job"}</TableCell>
                                    <TableCell className="text-gray-700">{appliedJob?.job?.company?.name || "Company"}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge 
                                            variant="outline"
                                            className={`font-semibold capitalize text-xs ${
                                                appliedJob?.status === "rejected" 
                                                    ? 'bg-red-50 text-red-700 border-red-200' 
                                                    : appliedJob?.status === 'accepted' 
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                            }`}
                                        >
                                            {appliedJob?.status || "Pending"}
                                        </Badge>
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

export default AppliedJobTable