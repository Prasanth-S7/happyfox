import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)} // Go back to the previous page
          className="flex items-center text-orange-500 hover:text-orange-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>
        <h1 className="text-2xl font-bold">Profile</h1>
        <div /> {/* Empty div for spacing */}
      </div>

      <div className="flex flex-col items-center">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold">John Doe</h2>
        <p className="text-sm text-gray-400">Online</p>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4">Details</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Email</span>
            <span className="text-gray-400">john.doe@example.com</span>
          </div>
          <div className="flex justify-between">
            <span>Joined</span>
            <span className="text-gray-400">January 2023</span>
          </div>
          <div className="flex justify-between">
            <span>Karma</span>
            <span className="text-orange-500">1.2K</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;