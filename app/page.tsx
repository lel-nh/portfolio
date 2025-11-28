"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from 'react';

export default function Home() {
const dict_projects = [
  {
    titre: "Mycelium-Based Leather",
    description: "Research project mushroom culture to grow vegan leather alternative.",
    image: "/myceliumLeather.png",
    lien: "/mycelium-leather"
  },
  {
    titre: "Mycelium-Based Off-Earth Construction", 
    description: "Exploration of mycelium as a sustainable material for construction on Mars.",
    image: "/myceliumMars.png",
    lien: "/mycelium-mars"
  },
  {
    titre: "Upcycling Cardboard - Waterproofing process",
    description: "Research on methods to enhance the water resistance of upcycled cardboard materials.", 
    image: "/cardboard.jpeg",
    lien : "/cardboard" 
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
      <header className="w-[60%] bg-[#000000]/60 items-center justify-items-center justify align-center left-1/2 transform -translate-x-1/2 backdrop-blur-md shadow-md text-center fixed top-4 p-6 rounded-2xl font-bold sm:text-3xl text-white">
        <nav className="relative flex justify-center font-bold gap-6">
            <Link href="/about" className="text-lg hover:underline">About</Link>
            <Link href="/" className="underline text-lg items-center">Projects</Link>
            <Link href="/experiences" className="text-lg hover:underline">Experiences</Link>
          </nav>
      </header>
    
      <main className="mt-30 flex flex-col items-center gap-8 text-center">
        <br />
        <div className="flex-col">
        <h1 className="text-2xl font-bold sm:text-4xl">Lélian Nahon</h1>
        <Image src="/profil.png" alt="Profile picture" width={150} height={150} className="rounded-full mx-auto" />
        <br />
        </div>
        <h2 className="text-l">Engineer-Manager Student | Msc Candidate | Creative Technologist</h2>
        <br />
        <p className="max-w-xl text-center">
            I am passionate about how innovation can make evolve technology help people in harmony with nature.
        </p>
        <br />
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
                  <Link 
                    href={project.lien}
                    className="text-blue-600 hover:underline font-medium"
                    rel="noopener noreferrer"
                  >
                    more info
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <Link
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
        </Link>
        <Link
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
          E-mail
        </Link>
                <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.linkedin.com/in/lelian-nh"
          target="_blank"
          rel="noopener noreferrer"
        >
         → LinkedIn 
        </Link>
      </footer>
    </div>
  );
}
