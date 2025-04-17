// pages/index.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Robot {
  id: number;
  name: string;
  type: string;
}

export default function Home() {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loadingRobots, setLoadingRobots] = useState(false);
  const [showRobots, setShowRobots] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadRobots = async () => {
    console.log("Loading robots...");
    setLoadingRobots(true);
    setShowRobots(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/robots", {
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch robots: ${res.status}`);
      }
      const data = await res.json();
      setRobots(data as Robot[]);
    } catch (error) {
      console.error("Error loading robots:", error);
    } finally {
      setLoadingRobots(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-400 border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/connect4.mp4" type="video/mp4" />
      </video>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900 opacity-60 z-0" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
        {/* Logo/Title */}
        <div className="mb-10">
          <div className="inline-block mb-4 p-2 bg-blue-600 bg-opacity-20 rounded-full">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
              <div className="text-white text-4xl font-bold">RG</div>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-500 bg-clip-text text-transparent">
            Robo Genesis
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-6"></div>
        </div>

        {/* Description */}
        <p className="mb-10 text-xl text-cyan-100 max-w-2xl mx-auto leading-relaxed">
        Step into the arena of strategy and style with Robo Genesis: Connect 4 Edition. Choose your robot avatar, set your difficulty, and battle an AI opponent in a fully animated, turn-based game. Every move counts — will your character outsmart the machine?

        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center">
          <Link href="/create-robot" legacyBehavior>
            <a className="relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold text-lg rounded-lg overflow-hidden group transition duration-300 hover:shadow-lg hover:shadow-blue-500/50">
              <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity"></span>
              <span className="relative flex items-center justify-center">
                <span className="mr-2">⚙️</span>
                Create Robot
              </span>
              <span className="absolute bottom-0 left-0 h-1 w-full bg-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </a>
          </Link>

          <button
            type="button"
            onClick={loadRobots}
            className="relative px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold text-lg rounded-lg overflow-hidden group transition duration-300 hover:shadow-lg hover:shadow-purple-500/50"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity"></span>
            <span className="relative flex items-center justify-center">
              <span className="mr-2">🤖</span>
              {loadingRobots ? "Loading..." : "View Robots"}
            </span>
            <span className="absolute bottom-0 left-0 h-1 w-full bg-pink-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </button>

          <Link
          href="/play"
          className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-lg transition"
        >
          Play Game
        </Link>
        </div>
      </div>

      {/* Robots List Section */}
      {showRobots && (
        <div className="relative z-10 w-full max-w-4xl mx-auto mt-12 mb-16">
          <div className="bg-gray-800 bg-opacity-80 backdrop-blur-md shadow-lg rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-500 bg-clip-text text-transparent">
              Robots List
            </h2>
            {loadingRobots ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-400 border-r-transparent"></div>
                <p className="text-white mt-4">Loading robots...</p>
              </div>
            ) : robots.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {robots.map((robot) => (
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
            ) : (
              <p className="text-center text-white">
                No robots found. Create one to get started!
              </p>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="absolute bottom-0 left-0 w-full text-center text-gray-400 text-sm z-10">
        <p>© 2025 Robo Genesis | Cloud Wars</p>
      </div>
    </div>
  );
}
