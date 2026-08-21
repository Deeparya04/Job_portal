import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2, Sparkles } from 'lucide-react'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "student",
    });
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const setDemoCredentials = (role) => {
        if (role === 'student') {
            setInput({
                email: "student@example.com",
                password: "123456",
                role: "student"
            });
        } else {
            setInput({
                email: "recruiter@example.com",
                password: "123456",
                role: "recruiter"
            });
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            if (res.data.success) {
                if (res.data.token) {
                    localStorage.setItem("token", res.data.token);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
                }
                dispatch(setUser(res.data.user));
                navigate(res.data.user.role === 'recruiter' ? "/admin/companies" : "/");
                toast.success(res.data.message || "Logged in successfully!");
            }
        } catch (error) {
            console.error("Login failed:", error);
            toast.error(error?.response?.data?.message || error.message || "Failed to log in. Please check credentials.");
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) {
            navigate(user.role === 'recruiter' ? "/admin/companies" : "/");
        }
    }, [user, navigate]);

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto px-4'>
                <form onSubmit={submitHandler} className='w-full max-w-md border border-gray-200 shadow-md rounded-xl p-6 my-10 bg-white'>
                    <h1 className='font-bold text-2xl mb-2 text-gray-800'>Welcome Back</h1>
                    <p className='text-sm text-gray-500 mb-6'>Log in to your account to explore opportunities</p>
                    
                    {/* Demo Quick Fill */}
                    <div className='bg-purple-50 border border-purple-200 rounded-lg p-3 mb-5'>
                        <div className='flex items-center gap-1.5 text-xs font-semibold text-purple-800 mb-2'>
                            <Sparkles className='w-3.5 h-3.5' /> Quick Demo Login:
                        </div>
                        <div className='flex gap-2'>
                            <button
                                type="button"
                                onClick={() => setDemoCredentials('student')}
                                className='flex-1 text-xs bg-white hover:bg-purple-100 text-purple-700 font-medium py-1.5 px-2 rounded border border-purple-300 transition'
                            >
                                Demo Student
                            </button>
                            <button
                                type="button"
                                onClick={() => setDemoCredentials('recruiter')}
                                className='flex-1 text-xs bg-white hover:bg-purple-100 text-purple-700 font-medium py-1.5 px-2 rounded border border-purple-300 transition'
                            >
                                Demo Recruiter
                            </button>
                        </div>
                    </div>

                    <div className='my-3'>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="name@example.com"
                            required
                        />
                    </div>

                    <div className='my-3'>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    
                    <div className='my-4'>
                        <Label className='mb-2 block'>I am a:</Label>
                        <RadioGroup className="flex items-center gap-6">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id="r1"
                                    name="role"
                                    value="student"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer accent-[#6A38C2] w-4 h-4"
                                />
                                <Label htmlFor="r1" className="cursor-pointer font-normal">Candidate / Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id="r2"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer accent-[#6A38C2] w-4 h-4"
                                />
                                <Label htmlFor="r2" className="cursor-pointer font-normal">Recruiter / Employer</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {
                        loading ? (
                            <Button disabled className="w-full my-4 bg-[#6A38C2]">
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Logging in...
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full my-4 bg-[#6A38C2] hover:bg-[#5b30a6]">
                                Login
                            </Button>
                        )
                    }
                    <div className='text-center mt-3'>
                        <span className='text-sm text-gray-600'>Don't have an account? <Link to="/signup" className='text-[#6A38C2] font-semibold hover:underline'>Sign up</Link></span>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login