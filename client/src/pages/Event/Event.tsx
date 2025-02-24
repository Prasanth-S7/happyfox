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
            const res = await axios.get('http://localhost:3000/api/v1/event/events');
            if(res.status === 200) {
                const data = res.data.data;
                setEvents(data);
            }
        } catch (error) {
            console.error(error);
        }
    }

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
    }

    return(
        <div className="p-4">
            <div className="flex flex-wrap gap-2 mb-6">
                {filterOptions.map(({ id, name }) => (
                    <button
                        key={id}
                        onClick={() => setSelectedCategory(id)}
                        className={`px-4 py-2 rounded-full transition-colors ${
                            selectedCategory === id
                                ? 'bg-orange-500 text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-accent'
                        }`}
                    >
                        {name}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFilteredEvents().map(event => (
                    <EventCard 
                        key={event.id} 
                        event={event} 
                    />
                ))}
            </div>

            {getFilteredEvents().length === 0 && (
                <div className="text-center text-muted-foreground py-12">
                    No events found in this category
                </div>
            )}
        </div>
    )
}

export default EventPage;