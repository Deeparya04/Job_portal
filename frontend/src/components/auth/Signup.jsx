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
import { setLoading } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "student",
        file: null
    });
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] || null });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message || "Account created successfully!");
            }
        } catch (error) {
            console.error("Signup failed:", error);
            toast.error(error?.response?.data?.message || error.message || "Failed to create account.");
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto px-4'>
                <form onSubmit={submitHandler} className='w-full max-w-lg border border-gray-200 shadow-md rounded-xl p-6 my-10 bg-white'>
                    <h1 className='font-bold text-2xl mb-2 text-gray-800'>Create an Account</h1>
                    <p className='text-sm text-gray-500 mb-6'>Join thousands of employers and job seekers</p>

                    <div className='my-3'>
                        <Label htmlFor="fullname">Full Name</Label>
                        <Input
                            id="fullname"
                            type="text"
                            value={input.fullname}
                            name="fullname"
                            onChange={changeEventHandler}
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div className='my-3'>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="john@example.com"
                            required
                        />
                    </div>

                    <div className='my-3'>
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                            id="phoneNumber"
                            type="text"
                            value={input.phoneNumber}
                            name="phoneNumber"
                            onChange={changeEventHandler}
                            placeholder="9876543210"
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
                            placeholder="Create a strong password"
                            required
                        />
                    </div>

                    <div className='my-4'>
                        <Label className='mb-2 block'>I want to register as:</Label>
                        <RadioGroup className="flex items-center gap-6">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id="sr1"
                                    name="role"
                                    value="student"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer accent-[#6A38C2] w-4 h-4"
                                />
                                <Label htmlFor="sr1" className="cursor-pointer font-normal">Candidate / Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id="sr2"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer accent-[#6A38C2] w-4 h-4"
                                />
                                <Label htmlFor="sr2" className="cursor-pointer font-normal">Recruiter / Employer</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className='my-4'>
                        <Label htmlFor="profilePic">Profile Picture (Optional)</Label>
                        <Input
                            id="profilePic"
                            accept="image/*"
                            type="file"
                            onChange={changeFileHandler}
                            className="cursor-pointer mt-1"
                        />
                    </div>

                    {
                        loading ? (
                            <Button disabled className="w-full my-4 bg-[#6A38C2]">
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Creating account...
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full my-4 bg-[#6A38C2] hover:bg-[#5b30a6]">
                                Sign Up
                            </Button>
                        )
                    }
                    <div className='text-center mt-3'>
                        <span className='text-sm text-gray-600'>Already have an account? <Link to="/login" className='text-[#6A38C2] font-semibold hover:underline'>Login</Link></span>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup