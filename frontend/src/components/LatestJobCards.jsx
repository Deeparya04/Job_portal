import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { MapPin } from 'lucide-react'

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();

    const getInitials = (name) => {
        if (!name) return "CO";
        return name.slice(0, 2).toUpperCase();
    };

    return (
        <div 
            onClick={() => navigate(`/description/${job?._id}`)} 
            className='p-6 rounded-2xl bg-white border border-gray-200 hover:border-purple-300 shadow-sm hover:shadow-md transition duration-200 cursor-pointer flex flex-col justify-between'
        >
            <div>
                <div className='flex items-center gap-3 mb-3'>
                    <Avatar className="h-9 w-9 border border-gray-100 rounded-lg">
                        <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
                        <AvatarFallback className="bg-purple-50 text-purple-700 font-bold text-xs rounded-lg">
                            {getInitials(job?.company?.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className='font-semibold text-gray-900 text-sm'>{job?.company?.name || "Company"}</h2>
                        <div className='flex items-center gap-1 text-xs text-gray-500'>
                            <MapPin className='w-3 h-3' />
                            <span>{job?.location || "India"}</span>
                        </div>
                    </div>
                </div>

                <h3 className='font-bold text-gray-900 text-base line-clamp-1 mb-1'>{job?.title}</h3>
                <p className='text-xs text-gray-500 line-clamp-2 leading-relaxed'>
                    {job?.description}
                </p>
            </div>

            <div className='flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-gray-100'>
                <Badge className='text-blue-700 bg-blue-50 border-blue-200 font-semibold text-xs' variant="outline">
                    {job?.position || 1} Positions
                </Badge>
                <Badge className='text-red-700 bg-red-50 border-red-200 font-semibold text-xs' variant="outline">
                    {job?.jobType || "Full Time"}
                </Badge>
                <Badge className='text-purple-700 bg-purple-50 border-purple-200 font-semibold text-xs' variant="outline">
                    {job?.salary} LPA
                </Badge>
            </div>
        </div>
    )
}

export default LatestJobCards