import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { LogOut, User2, Briefcase } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            localStorage.removeItem("token");
            delete axios.defaults.headers.common['Authorization'];
            dispatch(setUser(null));
            navigate("/login");
            toast.success(res?.data?.message || "Logged out successfully");
        } catch (error) {
            console.error("Logout error:", error);
            localStorage.removeItem("token");
            delete axios.defaults.headers.common['Authorization'];
            dispatch(setUser(null));
            navigate("/login");
        }
    }

    const getUserInitials = (name) => {
        if (!name) return "U";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    return (
        <div className='bg-white border-b border-gray-100 sticky top-0 z-50'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4'>
                <div>
                    <Link to="/" className='text-2xl font-bold tracking-tight'>
                        Job<span className='text-[#6A38C2]'>Portal</span>
                    </Link>
                </div>
                <div className='flex items-center gap-8'>
                    <ul className='flex font-medium items-center gap-6 text-gray-700'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li><Link to="/admin/companies" className='hover:text-[#6A38C2] transition'>Companies</Link></li>
                                    <li><Link to="/admin/jobs" className='hover:text-[#6A38C2] transition'>Posted Jobs</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/" className='hover:text-[#6A38C2] transition'>Home</Link></li>
                                    <li><Link to="/jobs" className='hover:text-[#6A38C2] transition'>Jobs</Link></li>
                                    <li><Link to="/browse" className='hover:text-[#6A38C2] transition'>Browse</Link></li>
                                </>
                            )
                        }
                    </ul>

                    {
                        !user ? (
                            <div className='flex items-center gap-3'>
                                <Link to="/login"><Button variant="outline" className="border-gray-300">Login</Button></Link>
                                <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button></Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer border-2 border-purple-200">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                        <AvatarFallback className="bg-purple-100 text-purple-700 font-bold">
                                            {getUserInitials(user?.fullname)}
                                        </AvatarFallback>
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 p-4" align="end">
                                    <div>
                                        <div className='flex items-center gap-3 pb-3 border-b border-gray-100'>
                                            <Avatar className="h-12 w-12 border border-gray-200">
                                                <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                                <AvatarFallback className="bg-purple-100 text-purple-700 font-bold">
                                                    {getUserInitials(user?.fullname)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className='overflow-hidden'>
                                                <h4 className='font-bold text-gray-800 truncate'>{user?.fullname}</h4>
                                                <p className='text-xs text-gray-500 truncate'>{user?.email}</p>
                                                <span className='inline-block mt-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-800'>
                                                    {user?.role}
                                                </span>
                                            </div>
                                        </div>
                                        <div className='flex flex-col gap-1 mt-3 text-gray-600'>
                                            {
                                                user?.role === 'student' && (
                                                    <Link to="/profile" className='flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md transition text-sm font-medium'>
                                                        <User2 className='w-4 h-4 text-purple-600' />
                                                        <span>View Profile</span>
                                                    </Link>
                                                )
                                            }
                                            {
                                                user?.role === 'recruiter' && (
                                                    <Link to="/admin/jobs/create" className='flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md transition text-sm font-medium'>
                                                        <Briefcase className='w-4 h-4 text-purple-600' />
                                                        <span>Post a New Job</span>
                                                    </Link>
                                                )
                                            }
                                            <button 
                                                onClick={logoutHandler} 
                                                className='flex items-center gap-2 p-2 hover:bg-red-50 text-red-600 rounded-md transition text-sm font-medium w-full text-left'
                                            >
                                                <LogOut className='w-4 h-4' />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Navbar