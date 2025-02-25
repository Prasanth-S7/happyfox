import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { Pagination, EffectCoverflow } from "swiper/modules";
import { Heart } from "lucide-react";

interface EventData {
    id: string;
    title: string;
    by?: string;
    avatar: string;
    date: string;
    link: string;
    category: string;
    poster: string;
}

interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
}

const Home = () => {
    const [events, setEvents] = useState<EventData[]>([]);
    const [postsData, setPostsData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        fetchEvents();
        fetchPosts();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get<{ data: EventData[] }>(
                `${import.meta.env.VITE_BACKEND_BASE_URL}api/v1/event/events`
            );
            console.log(response.data)
            setEvents(response.data.data);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    const fetchPosts = async () => {
        setIsLoading(true)
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}api/v1/post/all/16`)
        setPostsData(res.data)
        setIsLoading(false)
    }

    return (
        <div className="min-h-screen bg-black text-white px-4 py-6">
            <h1 className="text-3xl font-bold text-orange-500 mb-4">Home</h1>

            {/* Enhanced Events Carousel */}
            <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
            <Swiper
                effect="coverflow"
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={'auto'}
                coverflowEffect={{ rotate: 0, stretch: 0, depth: 120, modifier: 2.5 }}
                pagination={{ clickable: true }}
                modules={[Pagination, EffectCoverflow]}
                className="mb-6"
            >
                {events.length > 0 ? (
                    events.map((event) => (
                        <SwiperSlide key={event.id} className="w-64">
                            <div className="p-4 bg-gray-900 rounded-lg shadow-xl border border-gray-800 flex flex-col items-center text-center">
                                <img src={import.meta.env.VITE_BACKEND_BASE_URL + event.poster} alt={event.title} className="w-full h-40 object-cover rounded-md mb-3" />
                                <h3 className="text-lg font-bold text-orange-500 mb-1">{event.title}</h3>
                                {event.by && (
                                    <div className="flex items-center space-x-2 mb-1">
                                        <img src={event.avatar} alt={event.by} className="w-6 h-6 rounded-full border border-gray-700" />
                                        <p className="text-sm text-gray-400">by {event.by}</p>
                                    </div>
                                )}
                                <p className="text-sm text-gray-300 mb-1">{event.date}</p>
                                <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded-md">{event.category}</span>
                            </div>
                        </SwiperSlide>
                    ))
                ) : (
                    <p className="text-gray-400">No events found.</p>
                )}
            </Swiper>

            {/* Posts List View */}
            <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                    <div className="text-center py-8">Loading posts...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {postsData?.posts?.map((post) => (
                            <div
                                key={post.id}
                                className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg overflow-hidden hover:bg-zinc-800/70 transition-all duration-200 relative"
                            >
                                <div className="aspect-square w-full relative">
                                    <img
                                        src={`${import.meta.env.VITE_BACKEND_BASE_URL}${post.imageUrl?.slice(1)}`}
                                        alt={post.title}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-white">{post.title}</h3>
                                            <p className="text-sm text-zinc-400 mt-1">by {post.author.username}</p>
                                        </div>
                                        <span className="text-sm text-purple-400 font-medium">{post.votes} votes</span>
                                    </div>
                                    <p className="text-sm text-zinc-400 mt-2 line-clamp-2">{post.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
