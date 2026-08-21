import React, { useState } from 'react'
import { Button } from './ui/button'
import { Bookmark, BookmarkCheck, MapPin } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const Job = ({ job }) => {
    const navigate = useNavigate();
    const [saved, setSaved] = useState(false);

    const daysAgoFunction = (mongodbTime) => {
        if (!mongodbTime) return "Recently";
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        const days = Math.floor(timeDifference / (1000 * 24 * 60 * 60));
        return days === 0 ? "Today" : `${days} days ago`;
    }

    const saveJobHandler = () => {
        setSaved(!saved);
        if (!saved) {
            toast.success("Job saved to your bookmarks!");
        } else {
            toast.info("Job removed from bookmarks.");
        }
    };

    const getInitials = (name) => {
        if (!name) return "CO";
        return name.slice(0, 2).toUpperCase();
    };
    
    return (
        <div className='p-6 rounded-2xl bg-white border border-gray-200 hover:border-purple-200 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between h-full'>
            <div>
                <div className='flex items-center justify-between'>
                    <p className='text-xs font-medium text-gray-500'>{daysAgoFunction(job?.createdAt)}</p>
                    <Button 
                        onClick={saveJobHandler} 
                        variant="ghost" 
                        className={`rounded-full h-8 w-8 p-0 ${saved ? 'text-purple-600' : 'text-gray-400'}`}
                    >
                        {saved ? <BookmarkCheck className='w-4 h-4 fill-purple-100' /> : <Bookmark className='w-4 h-4' />}
                    </Button>
                </div>

                <div className='flex items-center gap-3 my-3'>
                    <Avatar className="h-10 w-10 border border-gray-100 rounded-lg">
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

                <div className='my-3'>
                    <h3 className='font-bold text-gray-900 text-base line-clamp-1'>{job?.title}</h3>
                    <p className='text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed'>
                        {job?.description}
                    </p>
                </div>

                <div className='flex flex-wrap items-center gap-2 mt-4'>
                    <Badge className='text-blue-700 bg-blue-50 border-blue-200 font-semibold text-xs' variant="outline">
                        {job?.position || 1} Openings
                    </Badge>
                    <Badge className='text-red-700 bg-red-50 border-red-200 font-semibold text-xs' variant="outline">
                        {job?.jobType || "Full Time"}
                    </Badge>
                    <Badge className='text-purple-700 bg-purple-50 border-purple-200 font-semibold text-xs' variant="outline">
                        {job?.salary} LPA
                    </Badge>
                </div>
            </div>

            <div className='flex items-center gap-3 mt-6 pt-4 border-t border-gray-100'>
                <Button 
                    onClick={() => navigate(`/description/${job?._id}`)} 
                    variant="outline" 
                    className="flex-1 rounded-xl text-xs font-semibold hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200"
                >
                    View Details
                </Button>
                <Button 
                    onClick={saveJobHandler} 
                    className={`flex-1 rounded-xl text-xs font-semibold ${saved ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : 'bg-[#6A38C2] hover:bg-[#5b30a6] text-white'}`}
                >
                    {saved ? "Saved" : "Save Job"}
                </Button>
            </div>
        </div>
    )
}

export default Job