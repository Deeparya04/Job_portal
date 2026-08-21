import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Briefcase, MapPin, DollarSign, Calendar, Users, Building, ArrowLeft, CheckCircle } from 'lucide-react';

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isInitiallyApplied = singleJob?.applications?.some(application => 
        (typeof application === 'string' ? application === user?._id : application?.applicant === user?._id)
    ) || false;
    
    const [isApplied, setIsApplied] = useState(isInitiallyApplied);
    const [applying, setApplying] = useState(false);

    const applyJobHandler = async () => {
        if (!user) {
            toast.error("Please log in to apply for this job.");
            navigate("/login");
            return;
        }

        if (user.role === 'recruiter') {
            toast.error("Recruiters cannot apply for jobs.");
            return;
        }

        try {
            setApplying(true);
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });
            
            if (res.data.success) {
                setIsApplied(true);
                const updatedApplications = singleJob?.applications ? [...singleJob.applications, { applicant: user?._id }] : [{ applicant: user?._id }];
                const updatedSingleJob = { ...singleJob, applications: updatedApplications };
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message || "Applied successfully!");
            }
        } catch (error) {
            console.error("Apply job error:", error);
            toast.error(error?.response?.data?.message || "Failed to apply for job.");
        } finally {
            setApplying(false);
        }
    }

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    const alreadyApplied = res.data.job?.applications?.some(application => 
                        (typeof application === 'string' ? application === user?._id : application?.applicant === user?._id)
                    ) || false;
                    setIsApplied(alreadyApplied);
                }
            } catch (error) {
                console.error("Fetch single job error:", error);
            }
        }
        if (jobId) {
            fetchSingleJob(); 
        }
    }, [jobId, dispatch, user?._id]);

    return (
        <div className='min-h-screen bg-gray-50/50 pb-12'>
            <Navbar />
            <div className='max-w-4xl mx-auto my-8 px-4'>
                <Button 
                    onClick={() => navigate(-1)} 
                    variant="ghost" 
                    className="mb-4 text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className='w-4 h-4 mr-2' /> Back
                </Button>

                <div className='bg-white border border-gray-200 rounded-2xl p-8 shadow-sm'>
                    <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100'>
                        <div>
                            <div className='flex items-center gap-2 text-sm text-gray-500 font-medium mb-1'>
                                <Building className='w-4 h-4 text-purple-600' />
                                <span>{singleJob?.company?.name || "Company"}</span>
                            </div>
                            <h1 className='font-bold text-2xl md:text-3xl text-gray-900'>{singleJob?.title}</h1>
                            <div className='flex flex-wrap items-center gap-2 mt-3'>
                                <Badge className='text-blue-700 bg-blue-50 border-blue-200 font-semibold' variant="outline">
                                    {singleJob?.position || 1} Openings
                                </Badge>
                                <Badge className='text-red-700 bg-red-50 border-red-200 font-semibold' variant="outline">
                                    {singleJob?.jobType || "Full Time"}
                                </Badge>
                                <Badge className='text-purple-700 bg-purple-50 border-purple-200 font-semibold' variant="outline">
                                    {singleJob?.salary} LPA
                                </Badge>
                            </div>
                        </div>

                        <div>
                            {
                                isApplied ? (
                                    <Button disabled className="bg-emerald-600 text-white cursor-not-allowed flex items-center gap-2 px-6 py-2 rounded-xl">
                                        <CheckCircle className='w-4 h-4' /> Already Applied
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={applyJobHandler}
                                        disabled={applying}
                                        className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white px-8 py-2 rounded-xl transition shadow-md"
                                    >
                                        {applying ? "Applying..." : "Apply Now"}
                                    </Button>
                                )
                            }
                        </div>
                    </div>

                    <div className='mt-8'>
                        <h2 className='font-bold text-lg text-gray-800 mb-4'>Job Overview & Requirements</h2>
                        
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-5 rounded-xl mb-6'>
                            <div className='flex items-center gap-3'>
                                <MapPin className='w-5 h-5 text-gray-400' />
                                <div>
                                    <p className='text-xs text-gray-500 font-medium'>Location</p>
                                    <p className='text-sm font-semibold text-gray-800'>{singleJob?.location || "Remote / On-site"}</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-3'>
                                <Briefcase className='w-5 h-5 text-gray-400' />
                                <div>
                                    <p className='text-xs text-gray-500 font-medium'>Experience Required</p>
                                    <p className='text-sm font-semibold text-gray-800'>{singleJob?.experienceLevel || 0} Years</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-3'>
                                <DollarSign className='w-5 h-5 text-gray-400' />
                                <div>
                                    <p className='text-xs text-gray-500 font-medium'>Salary Package</p>
                                    <p className='text-sm font-semibold text-gray-800'>{singleJob?.salary} LPA</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-3'>
                                <Users className='w-5 h-5 text-gray-400' />
                                <div>
                                    <p className='text-xs text-gray-500 font-medium'>Total Applicants</p>
                                    <p className='text-sm font-semibold text-gray-800'>{singleJob?.applications?.length || 0}</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-3'>
                                <Calendar className='w-5 h-5 text-gray-400' />
                                <div>
                                    <p className='text-xs text-gray-500 font-medium'>Posted Date</p>
                                    <p className='text-sm font-semibold text-gray-800'>{singleJob?.createdAt?.split("T")?.[0] || "Recently"}</p>
                                </div>
                            </div>
                        </div>

                        <div className='my-6'>
                            <h3 className='font-bold text-md text-gray-800 mb-2'>Role Description</h3>
                            <p className='text-gray-600 leading-relaxed whitespace-pre-line'>
                                {singleJob?.description || "No description provided."}
                            </p>
                        </div>

                        {
                            singleJob?.requirements && singleJob.requirements.length > 0 && (
                                <div className='my-6'>
                                    <h3 className='font-bold text-md text-gray-800 mb-3'>Key Skills & Requirements</h3>
                                    <div className='flex flex-wrap gap-2'>
                                        {
                                            singleJob.requirements.map((skill, idx) => (
                                                <span key={idx} className='bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-purple-100'>
                                                    {skill}
                                                </span>
                                            ))
                                        }
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

export default JobDescription