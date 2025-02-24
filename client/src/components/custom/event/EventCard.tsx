
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EventData {
    id: string;
    title: string;
    by: string;
    avatar: string;
    date: string;
    link: string;
    category: string;
    poster: string
}

const EventCard = ({ event }: {event: EventData}) => {

    return (
        <Card className="relative lg:max-w-[350px] w-[100%] h-[290px] rounded-lg overflow-hidden border-none">
            <CardContent className="p-0 font-semibold">
                <a target="_" href={event.link}>
                    <img className="object-cover absolute top-0 left-0 right-0 bottom-0 z-10" src={`http://localhost:3000/${event.poster}`} alt="Test Image" />
                    <div className="absolute bottom-2 w-full z-20">
                        <div className="bg-background w-[95%] space-y-2 mx-auto rounded-md p-2 shadow-lg">
                            <p className="text-xl">{event.title}</p>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <Avatar className="h-7 w-7">
                                        <AvatarImage src={`http://localhost:3000/${event.avatar}`} alt={`${event.by}`} />
                                        <AvatarFallback className="bg-slate-200">{event.by}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-base">{event.by}</span>
                                </div>
                                <span className="text-muted-foreground">{event.date}</span>
                            </div>
                        </div>
                    </div>
                </a>
            </CardContent>
        </Card>
    )
}

export default EventCard;