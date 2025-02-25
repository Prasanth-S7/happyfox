import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "@/config/config";

const cardContent = {
  title: "Welcome Back",
  description: "Please enter your details to sign in to your account.",
};

const CardBody = ({ className = "p-4" }) => {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    const res = await axios.post(import.meta.env.VITE_BACKEND_BASE_URL+'api/v1/user/login', formData, {
        withCredentials: true,
        headers:{
            'content-type': 'application/json'
        }
    });
    if(res.status === 200){
      toast.success("Login successfull");
      navigate("/")
    }
    else if(res.status === 400){
        toast.error("Invalid username or password")
    }
    else{
        toast.error("Login failed");
    }
  };

  const inputClasses = "bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-400 focus:ring-green-400/20 focus:border-green-400/20";

  return (
    <div className={cn("text-start w-full max-w-md mx-auto", className)}>
      <h3 className="text-2xl font-bold mb-2 text-white tracking-tight text-center">
        {cardContent.title}
      </h3>
      <p className="text-zinc-400 mb-8 text-sm text-center">
        {cardContent.description}
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <Input
              type="email"
              placeholder="Email"
              className={inputClasses}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Mail className="absolute right-3 top-2.5 h-5 w-5 text-zinc-400" />
          </div>
          <div className="relative">
            <Input
              type="password"
              placeholder="Password"
              className={inputClasses}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <Lock className="absolute right-3 top-2.5 h-5 w-5 text-zinc-400" />
          </div>
        </div>
        <Button 
          type="submit" 
          className="w-full bg-orange-500 hover:bg-orange-600 text-black font-medium transition-all duration-300 ease-out hover:scale-[1.02] cursor-pointer"
        >
          Sign In
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
      <div className="w-full">
        <Link className="text-center block mt-5 text-orange-500 text-sm underline underline-offset-2" to="/sign-up">Create Account</Link>
      </div>
    </div>
  );
};

export const LoginCard = () => {
  const Ellipses = () => {
    const sharedClasses =
      "rounded-full outline outline-8 dark:outline-gray-950 sm:my-6 md:my-8 size-1 my-4 outline-gray-50 bg-orange-500";
    return (
      <div className="absolute z-0 grid h-full w-full items-center gap-8 lg:grid-cols-2">
        <section className="absolute z-0 grid h-full w-full grid-cols-2 place-content-between">
          <div className={`${sharedClasses} -mx-[2.5px] animate-pulse`}></div>
          <div className={`${sharedClasses} -mx-[2px] place-self-end animate-pulse delay-100`}></div>
          <div className={`${sharedClasses} -mx-[2.5px] animate-pulse delay-200`}></div>
          <div className={`${sharedClasses} -mx-[2px] place-self-end animate-pulse delay-300`}></div>
        </section>
      </div>
    );
  };

  const Container = ({ children }: { children: React.ReactNode }) => (
    <div className="relative mx-auto w-full max-w-xl rounded-lg sm:px-6 md:px-8">
      <div className="absolute left-0 top-4 -z-0 h-px w-full bg-zinc-700/50 sm:top-6 md:top-8"></div>
      <div className="absolute bottom-4 left-0 z-0 h-px w-full bg-zinc-700/50 sm:bottom-6 md:bottom-8"></div>
      <div className="relative w-full border-x border-zinc-700/50 backdrop-blur-xl">
        <Ellipses />
        <div className="relative z-20 mx-auto py-8">{children}</div>
      </div>
    </div>
  );

  return (
    <div className="px-4">
      <Container>
        <div className="p-3 w-full center">
          <CardBody />
        </div>
      </Container>
    </div>
  );
};

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black font-satoshi">
      <LoginCard />
    </div>
  );
};

export default LoginPage;