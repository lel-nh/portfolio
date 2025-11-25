"use client";
import Image from "next/image";
import { useState, useEffect } from 'react';

export default function Home() {
const dict_projects = [
  {
    titre: "IFT",
    description: "Description of the first experience",
    image: "/ift.png",
    lien: "/experiences/ift"
  },
  {
    titre: "Bryanthings", 
    description: "Description of the second experience",
    image: "/bryanthings.png",
    lien: "/experiences/bryanthings"
  }
];


const [offset, setOffset] = useState(0);

useEffect(() => {
  const handleScroll = () => setOffset(window.scrollY * 0.4); // vitesse du défilement
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);



  return (

    
    <div className="font-sanchez grid items-center justify-items-center min-h-screen gap-16">
      <header className="w-[60%] bg-[#000000]/60 text-white items-center justify-items-center justify align-center left-1/2 transform -translate-x-1/2 backdrop-blur-md shadow-md text-center fixed top-4 p-6 rounded-2xl font-bold sm:text-3xl">
        <nav className="relative flex justify-center font-bold gap-6">
            <a href="/about" className="text-lg hover:underline">About</a>
            <a href="/" className="text-lg items-center hover:underline">Projects</a>
            <a href="/experiences" className="underline text-lg hover:underline">Experiences</a>
          </nav>
      </header>
    
      <main className="mt-30 flex flex-col items-center gap-8 text-center">
        <div className="w-full max-w-4xl space-y-8">
          {dict_projects.map((project, index) => (
            <div key={index} className="shadow-bottom p-6">
              <h2 className="text-xl font-bold text-center mb-6">{project.titre}</h2>
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0">
                  <Image
                    src={project.image}
                    alt={project.titre}
                    width={200}
                    height={150}
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-gray-700 mb-4">{project.description}</p>
                  <a 
                    href={project.lien}
                    className="text-blue-600 hover:underline font-medium"
                    rel="noopener noreferrer"
                  >
                    more info
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/about"
          target="_blank"
          rel="noopener noreferrer"
        >
            <Image
            aria-hidden
            src="/person.svg"
            alt="person icon"
            width={16}
            height={16}
          />
          Lélian Nahon
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="mailto:lelian.nahon@edu.devinci.fr"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/email.png"
            alt="Email icon"
            width={16}
            height={16}
          />
          E-mail →
        </a>
      </footer>
    </div>
  );
}
