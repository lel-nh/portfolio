'use client';
import Image from "next/image";
import React, { useEffect, useState } from 'react';

export default function Page() {

const image = "/project3.jpg";

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
            <a href="/" className="underline text-lg items-center">Projects</a>
            <a href="/experiences" className="text-lg hover:underline">Experiences</a>
          </nav>
      </header>
    
    <main className="mt-30 flex flex-col items-center align-center gap-8 text-center">
      <div className="w-full max-w-4xl space-y-8 items-center justify-items-center">
          <h2 className="text-xl font-bold items-center align-center justify-items-center text-center mb-6">Mycelium-Based Off-Earth Construction</h2>
          <div className="flex justify-center">
            <Image
              src="/myceliumMars.png"
              alt="Mycelium-Based Off-Earth Construction Project"
              width={600}
              height={400}
              className="rounded-lg object-cover"
            />
          </div>
            <div className="flex-1 text-left">
              <br />
            <p className="text-gray-700 mb-4">The fungus is a living being that rules in its own right. Fungians have been around for some time, for 2.4 billion years according to some estimates. Almost indomitable, this living being knows how to adapt remarkably to its environment. Necessary for life on Earth mushrooms are not close to us surprised by their characteristics and potential.

Having worked with this species in the context of scientific research around the design of non-animal leather, materials from mycelium to make objects, I have learned from this species and wonder how far these application capabilities are extended. 

The potential of colonization, speed of execution and construction could lead to real advantages in space exploration, especially around Mars.
How well can fungi grow in the Martian Regolith ?

During this study we will make sure to ask moral/ethical questions about the use of living being for useful purposes.
            </p>
            </div>
          
      </div>
<div className="w-full aspect-[9/16] rounded-md overflow-hidden">
            <object
                data="/myceliumMars.pdf"
                type="application/pdf"
                width={2000}
                height={1200}
                className="w-full h-[1200px] rounded-md overflow-hidden"
                aria-label="Resume PDF"
            >
                <div className="p-6 text-center">
                    <p className="mb-3">PDF preview is not available in your browser.</p>
                    <a
                        href="/resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-cyan-500/70 hover:bg-cyan-500 rounded-md text-white text-sm"
                    >
                        Open PDF
                    </a>
                </div>
            </object>
          </div>
    </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center mb-4">
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