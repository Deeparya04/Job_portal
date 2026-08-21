import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: "job",
    initialState: {
        allJobs: [],
        allAdminJobs: [],
        singleJob: null, 
        searchJobByText: "",
        allAppliedJobs: [],
        searchedQuery: "",
        selectedFilters: {
            location: [],
            role: [],
            jobType: [],
            salary: []
        },
    },
    reducers: {
        setAllJobs: (state, action) => {
            state.allJobs = action.payload;
        },
        setSingleJob: (state, action) => {
            state.singleJob = action.payload;
        },
        setAllAdminJobs: (state, action) => {
            state.allAdminJobs = action.payload;
        },
        setSearchJobByText: (state, action) => {
            state.searchJobByText = action.payload;
        },
        setAllAppliedJobs: (state, action) => {
            state.allAppliedJobs = action.payload;
        },
        setSearchedQuery: (state, action) => {
            state.searchedQuery = action.payload;
        },
        setSelectedFilters: (state, action) => {
            state.selectedFilters = action.payload;
        },
        toggleFilter: (state, action) => {
            const { category, value } = action.payload;
            if (!state.selectedFilters[category]) {
                state.selectedFilters[category] = [];
            }
            const index = state.selectedFilters[category].indexOf(value);
            if (index > -1) {
                state.selectedFilters[category].splice(index, 1);
            } else {
                state.selectedFilters[category].push(value);
            }
        },
        clearAllFilters: (state) => {
            state.selectedFilters = {
                location: [],
                role: [],
                jobType: [],
                salary: []
            };
            state.searchedQuery = "";
        }
    }
});

export const {
    setAllJobs, 
    setSingleJob, 
    setAllAdminJobs,
    setSearchJobByText, 
    setAllAppliedJobs,
    setSearchedQuery,
    setSelectedFilters,
    toggleFilter,
    clearAllFilters
} = jobSlice.actions;

export default jobSlice.reducer;