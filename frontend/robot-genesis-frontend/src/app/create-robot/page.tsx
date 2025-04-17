"use client";

import { useState } from "react";

export default function CreateRobotAndView() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [robots, setRobots] = useState([]);
  const [loadingRobots, setLoadingRobots] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:5000/robot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type }),
      });
      const data = await res.json();
      setMessage(data.message);
      loadRobots();
    } catch (error) {
      setMessage("Error creating robot");
      console.error(error);
    }
  };
  

  const loadRobots = async () => {
    console.log("Starting to load robots");
    setLoadingRobots(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/robots", {
        cache: "no-store",
      });
      console.log("Response status:", res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response:", errorText);
        throw new Error(`Failed to fetch robots: ${res.status} ${errorText}`);
      }
      
      const data = await res.json();
      console.log("Robots data received:", data);
      setRobots(data);
    } catch (error) {
      console.error("Error in loadRobots:", error);
    } finally {
      setLoadingRobots(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-start p-4 space-y-8">
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/robots.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900 opacity-60 z-0" />

      {/* Create Robot Form */}
      <div className="relative z-10 bg-white bg-opacity-80 backdrop-blur-sm shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
          Create a New Robot
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Robot Name:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter robot name"
              className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Robot Type:
            </label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              placeholder="Enter robot type"
              className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
            />
          </div>
          <button
            type="submit"
            
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-200"
          >
            Create Robot
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-green-400 font-medium">
            {message}
          </p>
        )}
      </div>



      {/* Robots List */}
      {robots.length > 0 && (
        <div className="relative z-10 bg-gray-800 bg-opacity-80 backdrop-blur-md shadow-lg rounded-lg p-8 max-w-4xl w-full">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-500 bg-clip-text text-transparent">
            Robots List
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {robots.map((robot: any) => (
              <div
                key={robot.id}
                className="bg-gray-900 rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-200"
              >
                <h3 className="text-2xl font-semibold mb-4 text-white">
                  {robot.name}
                </h3>
                <p className="text-lg text-gray-300">Type: {robot.type}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
