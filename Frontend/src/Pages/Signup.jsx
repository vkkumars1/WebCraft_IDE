import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import {Label} from "../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import Image from '../assets/1.jpg'; // Adjust the path as needed
import { User, Mail, Lock, Code } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios'
import { baseURL } from '../utils/constant';
import toast, { Toaster } from 'react-hot-toast';
export default function Signup() {
    const [username,setUsername] = useState("");
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const submitHandler = async(e)=>{
    e.preventDefault();
    // console.log(username," ",name," ",email," ",password);
    if (!email || !password || !name || !username) {
      toast.error("Please fill in all fields");
      return;
  }
    try{
      const response = await axios.post(
        `${baseURL}/api/signup`,
        {
          username,
          name,
          email,
          password,
        },
        { withCredentials: true }
      )
      if (response.data && response.data.user && response.data.user.name){

        localStorage.setItem("userName", JSON.stringify(response.data.user.name));
      }
        
        
        
    // console.log(response.data);
    toast.success('Login Now!', { duration: 2000 });
      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = "/login";
    }, 2000);
    } catch(err){
      console.error("Error:", err.response?.data?.message || err.message);
      toast.error('Signup failed! Please try again.');
    }

    // 
    setUsername("");
    setName("");
    setEmail("");
    setPassword("");
    }
   
  return (
   <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-indigo-600 via-purple-700 to-indigo-800">
  <Toaster position="top-center" reverseOrder={false} />
  
  {/* Signup Form */}
  <motion.div 
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className="w-full md:w-1/2 flex items-center justify-center p-8"
  >
    <Card className="w-full max-w-md bg-white bg-opacity-80 backdrop-blur-xl shadow-lg rounded-2xl p-8">
      <CardHeader className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <CardTitle className="text-5xl font-extrabold text-gray-800">
            <motion.span
              initial={{ display: 'inline-block' }}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ delay: 1, duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
              className="text-indigo-600"
            >
              WebCraft
            </motion.span>{' '}
            <motion.span
              initial={{ display: 'inline-block', opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-indigo-800"
            >
              IDE
            </motion.span>
          </CardTitle>
        </motion.div>
        <p className="text-gray-600 mt-2 text-lg">Sign up to start coding</p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={submitHandler} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="username" className="block text-sm text-gray-600">Username</Label>
            <Input
              onChange={(e)=> setUsername(e.target.value)}
              value={username}
              id="username"
              name="username"
              type="text"
              required
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-300"
              placeholder="Choose a username"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="name" className="block text-sm text-gray-600">Full Name</Label>
            <Input
              onChange={(e)=> setName(e.target.value)}
              value={name}
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-300"
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="email" className="block text-sm text-gray-600">Email address</Label>
            <Input
              onChange={(e)=> setEmail(e.target.value)}
              value={email}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-300"
              placeholder="you@example.com"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="password" className="block text-sm text-gray-600">Password</Label>
            <Input
              onChange={(e)=> setPassword(e.target.value)}
              value={password}
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-300"
              placeholder="Create a strong password"
            />
          </div>
          
          <Button
            type="submit"
            onClick={submitHandler}
            className="w-full mt-6 py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-semibold rounded-2xl transition-transform duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Sign Up
          </Button>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to='/login' className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-300 ease-in-out">
              Log In
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  </motion.div>

  {/* Background Image (visible only on desktop) */}
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="hidden md:block w-1/2 bg-cover bg-center relative overflow-hidden"
    style={{backgroundImage: `url(${Image})`}}
  >
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-center text-white"
      >
        <h2 className="text-5xl font-bold mb-4">WebCraft IDE</h2>
        <p className="text-xl mb-8">Code with power, create with ease</p>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
    <motion.div
      className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 1 }}
    />
  </motion.div>
</div>
  );
}

