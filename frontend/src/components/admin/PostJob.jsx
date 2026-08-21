import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate, Link } from 'react-router-dom'
import { Loader2, Plus, ArrowLeft } from 'lucide-react'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'

const PostJob = () => {
    useGetAllCompanies();
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "Full Time",
        experience: "",
        position: 1,
        companyId: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { companies } = useSelector(store => store.company);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (value) => {
        setInput({ ...input, companyId: value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!input.companyId) {
            toast.error("Please select a company to post this job.");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message || "Job posted successfully!");
                navigate("/admin/jobs");
            }
        } catch (error) {
            console.error("Post job error:", error);
            toast.error(error?.response?.data?.message || error.message || "Failed to post job.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='min-h-screen bg-gray-50/50 pb-12'>
            <Navbar />
            <div className='max-w-3xl mx-auto my-8 px-4'>
                <Button 
                    onClick={() => navigate("/admin/jobs")} 
                    variant="ghost" 
                    className="mb-4 text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className='w-4 h-4 mr-2' /> Back to Jobs
                </Button>

                <div className='p-8 bg-white border border-gray-200 shadow-sm rounded-2xl'>
                    <h1 className='font-bold text-2xl text-gray-900 mb-2'>Post a New Job Opportunity</h1>
                    <p className='text-sm text-gray-500 mb-6'>Provide detailed information to attract the right candidates</p>

                    <form onSubmit={submitHandler}>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            <div>
                                <Label htmlFor="title">Job Title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    name="title"
                                    value={input.title}
                                    onChange={changeEventHandler}
                                    placeholder="e.g. Frontend Developer"
                                    className="my-1.5"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="companySelect">Company</Label>
                                {
                                    companies && companies.length > 0 ? (
                                        <div className='my-1.5'>
                                            <Select onValueChange={selectChangeHandler} value={input.companyId}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a Company" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {
                                                            companies.map((company) => (
                                                                <SelectItem key={company._id} value={company._id}>
                                                                    {company.name}
                                                                </SelectItem>
                                                            ))
                                                        }
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ) : (
                                        <div className='my-1.5'>
                                            <Link to="/admin/companies/create">
                                                <Button type="button" variant="outline" className="w-full text-xs flex items-center justify-center gap-1 border-dashed text-purple-700 border-purple-300">
                                                    <Plus className='w-3.5 h-3.5' /> Register Company First
                                                </Button>
                                            </Link>
                                        </div>
                                    )
                                }
                            </div>
                            <div className='sm:col-span-2'>
                                <Label htmlFor="description">Job Description</Label>
                                <Input
                                    id="description"
                                    type="text"
                                    name="description"
                                    value={input.description}
                                    onChange={changeEventHandler}
                                    placeholder="Describe responsibilities, team, and projects"
                                    className="my-1.5"
                                    required
                                />
                            </div>
                            <div className='sm:col-span-2'>
                                <Label htmlFor="requirements">Requirements / Skills</Label>
                                <Input
                                    id="requirements"
                                    type="text"
                                    name="requirements"
                                    value={input.requirements}
                                    onChange={changeEventHandler}
                                    placeholder="React, Redux, Tailwind, Node.js (comma separated)"
                                    className="my-1.5"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="salary">Salary (LPA)</Label>
                                <Input
                                    id="salary"
                                    type="number"
                                    name="salary"
                                    value={input.salary}
                                    onChange={changeEventHandler}
                                    placeholder="e.g. 12"
                                    className="my-1.5"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    type="text"
                                    name="location"
                                    value={input.location}
                                    onChange={changeEventHandler}
                                    placeholder="e.g. Bangalore / Remote"
                                    className="my-1.5"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="jobType">Job Type</Label>
                                <Input
                                    id="jobType"
                                    type="text"
                                    name="jobType"
                                    value={input.jobType}
                                    onChange={changeEventHandler}
                                    placeholder="e.g. Full Time / Part Time"
                                    className="my-1.5"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="experience">Experience Level (Years)</Label>
                                <Input
                                    id="experience"
                                    type="number"
                                    name="experience"
                                    value={input.experience}
                                    onChange={changeEventHandler}
                                    placeholder="e.g. 2"
                                    className="my-1.5"
                                />
                            </div>
                            <div className='sm:col-span-2'>
                                <Label htmlFor="position">No. of Open Positions</Label>
                                <Input
                                    id="position"
                                    type="number"
                                    name="position"
                                    value={input.position}
                                    onChange={changeEventHandler}
                                    min="1"
                                    className="my-1.5"
                                    required
                                />
                            </div>
                        </div> 
                        {
                            loading ? (
                                <Button disabled className="w-full my-6 bg-[#6A38C2]">
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Posting job...
                                </Button>
                            ) : (
                                <Button type="submit" disabled={!companies || companies.length === 0} className="w-full my-6 bg-[#6A38C2] hover:bg-[#5b30a6]">
                                    Post Job
                                </Button>
                            )
                        }
                    </form>
                </div>
            </div>
        </div>
    )
}

export default PostJob