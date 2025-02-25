import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/config/config";
import Cookies from "js-cookie";

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const Logout = async () => {
    Cookies.set('token', '');
    window.location.reload();
  }

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_BACKEND_BASE_URL + "api/v1/user/self", {
          withCredentials: true,
        });
        setUserDetails(res.data);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      <div className="max-w-md mx-auto">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => navigate(-1)}
            className="flex items-center bg-orange-500 text-white "
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back</span>
          </Button>
          <h1 className="text-2xl font-bold">Profile</h1>
          <Button
            onClick={Logout}
            className="flex items-center bg-orange-500 text-white "
            aria-label="Go back"
          >
            <span>Logout</span>
          </Button>
        </div>

        {loading ? (
          <ProfileSkeleton />
        ) : (
          <>
            {/* Profile Card */}
            <Card className=" bg-black mb-6 text-white border-none">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-2 border-orange-500 shadow-lg">
                      <AvatarImage src="https://github.com/shadcn.png" alt={`${userDetails.firstName} ${userDetails.lastName}`} />
                      <AvatarFallback className="bg-orange-500 text-white text-xl">
                        {userDetails.firstName.charAt(0)}
                        {userDetails.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Badge className="absolute -bottom-2 right-0 bg-green-500 border-0 px-2 py-1 text-xs font-semibold">
                      Online
                    </Badge>

                  </div>
                  <h2 className="text-xl font-semibold mt-4">
                    {userDetails.firstName} {userDetails.lastName}
                  </h2>
                  <div className="mt-2 flex items-center">
                    <Badge className="bg-black text-orange-400 border-0">
                      {userDetails.xp} XP
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Details Card */}
            <Card className="bg-black border-none">
              <CardHeader>
                <h3 className="text-lg font-bold text-white">Details</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-800">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-white" />
                      <span>Email</span>
                    </div>
                    <span className="text-white text-sm">{userDetails.email}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-gray-800">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span>Joined</span>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {new Date(userDetails.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-2 text-orange-500" />
                      <span>Experience</span>
                    </div>
                    <span className="text-orange-500 font-medium">{userDetails.xp} XP</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

// Loading skeleton component
const ProfileSkeleton = () => (
  <>
    <div className="flex flex-col items-center mb-6 bg-gray-900 p-6 rounded-lg">
      <Skeleton className="h-24 w-24 rounded-full bg-gray-800" />
      <Skeleton className="h-6 w-32 mt-4 bg-gray-800" />
      <Skeleton className="h-4 w-16 mt-2 bg-gray-800" />
    </div>

    <div className="bg-gray-900 p-6 rounded-lg">
      <Skeleton className="h-6 w-24 mb-4 bg-gray-800" />
      <div className="space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-gray-800">
          <Skeleton className="h-4 w-16 bg-gray-800" />
          <Skeleton className="h-4 w-32 bg-gray-800" />
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-800">
          <Skeleton className="h-4 w-16 bg-gray-800" />
          <Skeleton className="h-4 w-24 bg-gray-800" />
        </div>
        <div className="flex justify-between items-center py-2">
          <Skeleton className="h-4 w-16 bg-gray-800" />
          <Skeleton className="h-4 w-12 bg-gray-800" />
        </div>
      </div>
    </div>
  </>
);

export default Profile;