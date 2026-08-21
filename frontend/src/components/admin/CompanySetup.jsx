import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import useGetCompanyById from '@/hooks/useGetCompanyById'

const CompanySetup = () => {
    const params = useParams();
    useGetCompanyById(params.id);
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });
    const { singleCompany } = useSelector(store => store.company);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            setLoading(true);
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message || "Company updated successfully!");
                navigate("/admin/companies");
            }
        } catch (error) {
            console.error("Company update error:", error);
            toast.error(error?.response?.data?.message || error.message || "Failed to update company.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (singleCompany) {
            setInput({
                name: singleCompany?.name || "",
                description: singleCompany?.description || "",
                website: singleCompany?.website || "",
                location: singleCompany?.location || "",
                file: null
            });
        }
    }, [singleCompany]);

    return (
        <div className='min-h-screen bg-gray-50/50 pb-12'>
            <Navbar />
            <div className='max-w-xl mx-auto my-8 px-4'>
                <form onSubmit={submitHandler} className='bg-white border border-gray-200 shadow-sm rounded-2xl p-8'>
                    <div className='flex items-center gap-4 mb-6'>
                        <Button 
                            type="button"
                            onClick={() => navigate("/admin/companies")} 
                            variant="outline" 
                            className="flex items-center gap-2 text-gray-600 font-semibold"
                        >
                            <ArrowLeft className='w-4 h-4' />
                            <span>Back</span>
                        </Button>
                        <div>
                            <h1 className='font-bold text-2xl text-gray-900'>Company Details</h1>
                            <p className='text-xs text-gray-500'>Update your company information and brand</p>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <div className='sm:col-span-2'>
                            <Label htmlFor="name">Company Name</Label>
                            <Input
                                id="name"
                                type="text"
                                name="name"
                                value={input.name}
                                onChange={changeEventHandler}
                                className="my-1.5"
                                required
                            />
                        </div>
                        <div className='sm:col-span-2'>
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                className="my-1.5"
                            />
                        </div>
                        <div>
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                type="text"
                                name="website"
                                value={input.website}
                                onChange={changeEventHandler}
                                placeholder="https://company.com"
                                className="my-1.5"
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
                                placeholder="e.g. Bangalore, India"
                                className="my-1.5"
                            />
                        </div>
                        <div className='sm:col-span-2'>
                            <Label htmlFor="logo">Company Logo</Label>
                            <Input
                                id="logo"
                                type="file"
                                accept="image/*"
                                onChange={changeFileHandler}
                                className="my-1.5 cursor-pointer"
                            />
                        </div>
                    </div>
                    {
                        loading ? (
                            <Button disabled className="w-full my-6 bg-[#6A38C2]">
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Updating...
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full my-6 bg-[#6A38C2] hover:bg-[#5b30a6]">
                                Save Changes
                            </Button>
                        )
                    }
                </form>
            </div>
        </div>
    )
}

export default CompanySetup