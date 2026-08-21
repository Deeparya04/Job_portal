import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, FileText } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    const getUserInitials = (name) => {
        if (!name) return "U";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    return (
        <div className='min-h-screen bg-gray-50/50 pb-12'>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-6 p-8 shadow-sm'>
                <div className='flex justify-between items-start'>
                    <div className='flex items-center gap-5'>
                        <Avatar className="h-20 w-20 border-2 border-purple-200 shadow-sm">
                            <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                            <AvatarFallback className="bg-purple-100 text-purple-700 text-xl font-bold">
                                {getUserInitials(user?.fullname)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className='font-bold text-2xl text-gray-900'>{user?.fullname || "Your Name"}</h1>
                            <p className='text-gray-600 mt-1 text-sm'>{user?.profile?.bio || "No bio added yet."}</p>
                            <span className='inline-block mt-2 text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200'>
                                {user?.role || "Candidate"}
                            </span>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className="rounded-xl flex items-center gap-2 border-gray-300" variant="outline">
                        <Pen className='w-4 h-4' />
                        <span>Edit Profile</span>
                    </Button>
                </div>

                <div className='my-6 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl'>
                    <div className='flex items-center gap-3 text-gray-700'>
                        <Mail className='w-4 h-4 text-purple-600' />
                        <span className='text-sm font-medium'>{user?.email || "No email provided"}</span>
                    </div>
                    <div className='flex items-center gap-3 text-gray-700'>
                        <Contact className='w-4 h-4 text-purple-600' />
                        <span className='text-sm font-medium'>{user?.phoneNumber || "No phone number"}</span>
                    </div>
                </div>

                <div className='my-6'>
                    <h3 className='font-bold text-gray-800 text-md mb-2'>Skills</h3>
                    <div className='flex flex-wrap items-center gap-2'>
                        {
                            user?.profile?.skills && user.profile.skills.length > 0 ? (
                                user.profile.skills.map((item, index) => (
                                    <Badge key={index} className='bg-purple-50 text-purple-700 border border-purple-200 text-xs px-3 py-1 font-medium'>
                                        {item}
                                    </Badge>
                                ))
                            ) : (
                                <span className='text-sm text-gray-400'>No skills added yet.</span>
                            )
                        }
                    </div>
                </div>

                <div className='my-6'>
                    <Label className="text-md font-bold text-gray-800 block mb-2">Resume / CV</Label>
                    {
                        user?.profile?.resume ? (
                            <a 
                                target='_blank' 
                                rel="noreferrer" 
                                href={user?.profile?.resume} 
                                className='inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-4 py-2 rounded-lg text-sm font-semibold transition'
                            >
                                <FileText className='w-4 h-4' />
                                <span>{user?.profile?.resumeOriginalName || "View Uploaded Resume"}</span>
                            </a>
                        ) : (
                            <span className='text-sm text-gray-400'>No resume uploaded yet.</span>
                        )
                    }
                </div>
            </div>

            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 shadow-sm'>
                <h2 className='font-bold text-xl text-gray-900 mb-4'>Applied Jobs History</h2>
                <AppliedJobTable />
            </div>

            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile