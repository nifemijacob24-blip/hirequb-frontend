import React, { useState, useEffect } from 'react';
import JobFeedBody from './body'; 

const CategoryView = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const pathParts = window.location.pathname.split('/');
    const slug = pathParts[pathParts.length - 1];

    const formatCategoryTitle = (slugText) => {
        return slugText
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    useEffect(() => {
        const fetchCategoryJobs = async () => {
            try {
                const apiUrl = process.env.REACT_APP_API_URL;
                const response = await fetch(`${apiUrl}/api/jobs/category/${slug}`);
                
                if (!response.ok) {
                    throw new Error('This job category could not be found.');
                }
                
                const data = await response.json();
                setJobs(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryJobs();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-lg text-slate-600">Loading {formatCategoryTitle(slug)} jobs...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-lg text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Remote {formatCategoryTitle(slug)} Jobs
                </h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                    Apply to the latest {formatCategoryTitle(slug).toLowerCase()} roles from top remote companies.
                </p>
            </div>
            
            <div className="flex flex-col space-y-4">
                {jobs.length === 0 ? (
                    <p className="text-slate-600">No jobs found in this category right now.</p>
                ) : (
                    jobs.map((job) => (
                        <JobFeedBody
                            key={job.id}
                            jobId={job.id}
                            title={job.title}
                            company={job.company_token || 'Confidential'}
                            location={job.location}
                            department={job.department}
                            url={job.apply_url}
                            isPremium={true}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default CategoryView;