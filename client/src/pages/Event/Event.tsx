// @ts-nocheck
import EventCard from "@/components/custom/event/EventCard";
import { useEffect, useState } from "react";
import axios from "axios";

const EventPage = () => {
    const [events, setEvents] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { name: 'Tech', id: 'tech' },
        { name: 'Cultural', id: 'cultural' },
        { name: 'Sports', id: 'sports' },
        { name: 'Academic', id: 'academic' }
    ];

    const filterOptions = [
        { name: 'All', id: 'all' },
        ...categories
    ];

    const fetchEvents = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}api/v1/event/events`);
            if (res.status === 200) {
                const data = res.data.data;
                setEvents(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const getFilteredEvents = () => {
        const filtered = selectedCategory === 'all'
            ? events
            : events.filter(event => event.category === selectedCategory);

        return [...filtered].sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    };

    return (
        <div className="p-4 bg-black" style={{ minHeight: 'calc(100vh - 115px)' }}>
            <div className="mb-6">
                <div className="flex flex-wrap   overflow-x-auto gap-2 pb-2 snap-x snap-mandatory scrollbar-hide">
                    {filterOptions.map(({ id, name }) => (
                        <button
                            key={id}
                            onClick={() => setSelectedCategory(id)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full transition-colors snap-center ${
                                selectedCategory === id
                                    ? 'bg-orange-500 text-white font-semibold'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            {name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-black">
                {getFilteredEvents().map(event => (
                    <EventCard
                        key={event.id}
                        event={event}
                    />
                ))}
            </div>

            {getFilteredEvents().length === 0 && (
                <div className="text-center text-gray-400 py-12">
                    No events found in this category
                </div>
            )}
        </div>
    );
};

export default EventPage;