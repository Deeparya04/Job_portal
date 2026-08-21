import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal, Building } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const [filterCompany, setFilterCompany] = useState(companies || []);
    const navigate = useNavigate();

    useEffect(() => {
        if (!companies) return;
        const filtered = companies.filter((company) => {
            if (!searchCompanyByText) return true;
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
        });
        setFilterCompany(filtered);
    }, [companies, searchCompanyByText]);

    const getInitials = (name) => {
        if (!name) return "C";
        return name.slice(0, 2).toUpperCase();
    };

    return (
        <div className='bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm'>
            <Table>
                <TableCaption className="pb-4">A list of your registered company profiles</TableCaption>
                <TableHeader className="bg-gray-50">
                    <TableRow>
                        <TableHead className="font-bold">Logo</TableHead>
                        <TableHead className="font-bold">Company Name</TableHead>
                        <TableHead className="font-bold">Location</TableHead>
                        <TableHead className="font-bold">Date Registered</TableHead>
                        <TableHead className="text-right font-bold">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        !filterCompany || filterCompany.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                    No registered companies found. Click "New Company" to add one.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filterCompany.map((company) => (
                                <TableRow key={company._id} className="hover:bg-gray-50">
                                    <TableCell>
                                        <Avatar className="h-9 w-9 border border-gray-200">
                                            <AvatarImage src={company?.logo} alt={company?.name} />
                                            <AvatarFallback className="bg-purple-50 text-purple-700 font-bold text-xs">
                                                {getInitials(company?.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-semibold text-gray-900">{company?.name}</TableCell>
                                    <TableCell className="text-gray-600">{company?.location || "N/A"}</TableCell>
                                    <TableCell className="text-gray-500">{company?.createdAt?.split("T")?.[0] || "Recently"}</TableCell>
                                    <TableCell className="text-right">
                                        <Popover>
                                            <PopoverTrigger className="p-1 rounded-md hover:bg-gray-100">
                                                <MoreHorizontal className="w-5 h-5 text-gray-600" />
                                            </PopoverTrigger>
                                            <PopoverContent className="w-32 p-2" align="end">
                                                <button 
                                                    onClick={() => navigate(`/admin/companies/${company._id}`)} 
                                                    className='flex items-center gap-2 p-1.5 w-full hover:bg-purple-50 text-purple-700 rounded-md text-sm font-medium transition'
                                                >
                                                    <Edit2 className='w-4 h-4' />
                                                    <span>Edit Info</span>
                                                </button>
                                            </PopoverContent>
                                        </Popover>
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

export default CompaniesTable