import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SelectValue } from "@radix-ui/react-select";
import axios from 'axios';
// import { toast } from '@/components/ui/use-toast';

const AddEventForm = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        by: '',
        avatar: null,
        date: '',
        link: '',
        description: '',
        category: '',
        poster: null
    });

    const categories = [
        { name: 'Tech', id: 'tech' },
        { name: 'Cultural', id: 'cultural' },
        { name: 'Sports', id: 'sports' },
        { name: 'Academic', id: 'academic' }
    ];

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleFileChange = (e) => {
        const { id, files } = e.target;
        if (files && files[0]) {
            setFormData(prev => ({
                ...prev,
                [id]: files[0]
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });

            const response = await axios.post('http://localhost:3000/api/v1/event/events', formDataToSend)

            if(response.status == 201) {
                setFormData({
                    title: '',
                    by: '',
                    avatar: null,
                    date: '',
                    link: '',
                    description: '',
                    category: '',
                    poster: null
                });
            }
            
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white border p-6 rounded-lg shadow-md space-y-6">
                <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <Input 
                        id="title" 
                        placeholder="Event Title" 
                        value={formData.title}
                        onChange={handleInputChange}
                        className="focus:ring-orange-500 focus:border-orange-500"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="by" className="block text-sm font-medium text-gray-700">By</label>
                    <Input 
                        id="by" 
                        placeholder="Club Name" 
                        value={formData.by}
                        onChange={handleInputChange}
                        className="focus:ring-orange-500 focus:border-orange-500"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">Club Logo</label>
                    <Input 
                        type="file" 
                        id="avatar" 
                        onChange={handleFileChange}
                        className="focus:ring-orange-500 focus:border-orange-500"
                        accept="image/*"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                    <Input 
                        type="date" 
                        id="date" 
                        value={formData.date}
                        onChange={handleInputChange}
                        className="focus:ring-orange-500 focus:border-orange-500"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="link" className="block text-sm font-medium text-gray-700">Registration Link</label>
                    <Input 
                        type="url" 
                        id="link" 
                        placeholder="https://..." 
                        value={formData.link}
                        onChange={handleInputChange}
                        className="focus:ring-orange-500 focus:border-orange-500"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <Textarea 
                        id="description" 
                        placeholder="Event Description" 
                        value={formData.description}
                        onChange={handleInputChange}
                        className="focus:ring-orange-500 focus:border-orange-500 min-h-[100px]"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <Select 
                        value={formData.category}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                        <SelectTrigger className="focus:ring-orange-500 focus:border-orange-500">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map(category => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="poster" className="block text-sm font-medium text-gray-700">Event Poster</label>
                    <Input 
                        type="file" 
                        id="poster" 
                        onChange={handleFileChange}
                        className="focus:ring-orange-500 focus:border-orange-500"
                        accept="image/*"
                        required
                    />
                </div>

                <Button 
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={loading}
                >
                    {loading ? 'Creating Event...' : 'Create Event'}
                </Button>
            </form>
        </div>
    );
};

export default AddEventForm;