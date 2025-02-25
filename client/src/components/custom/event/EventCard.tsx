import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

const EventCard = ({ event }: { event: EventData }) => {
    const organizerName = event.by || "Unknown Organizer";
    console.log(event)

    return (
        <Card className="relative lg:max-w-[350px] w-[100%] h-[290px] rounded-lg overflow-hidden border-none group transition-transform duration-300 hover:scale-105 hover:shadow-2xl bg-black/90">
            <CardContent className="p-0 font-semibold">
                <a target="_" href={event.link}>
                    <img
                        className="object-cover absolute top-0 left-0 right-0 bottom-0 z-10 transition-opacity duration-300 group-hover:opacity-70"
                        src={`http://localhost:3000/${event.poster}`}
                        alt="Event Poster"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-15"></div>

                    <div className="absolute bottom-2 w-full z-20 border-orange-300 rounded-md">
                        <div className="bg-black/80 backdrop-blur-sm w-[95%] space-y-2 mx-auto rounded-md p-3 shadow-lg border border-white/10 hover:border-orange-500/50 transition-colors duration-300">
                            <p className="text-xl font-bold text-white group-hover:text-orange-500 transition-colors duration-300">
                                {event.title}
                            </p>

                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <Avatar className="h-7 w-7 border-2 border-orange-500 group-hover:border-orange-600 transition-colors duration-300">
                                        <AvatarImage
                                            src={`http://localhost:3000/${event.avatar}`}
                                            alt={organizerName}
                                        />
                                        <AvatarFallback className="bg-slate-800 text-white">
                                            {organizerName[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-base text-white group-hover:text-orange-500 transition-colors duration-300">
                                        {organizerName}
                                    </span>
                                </div>
                                <span className="text-sm text-orange-500 group-hover:text-orange-400 transition-colors duration-300">
                                    {event.date}
                                </span>
                            </div>
                        </div>
                    </div>
                </a>
            </CardContent>
        </Card>
    );
};

export default EventCard;