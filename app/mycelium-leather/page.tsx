"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from 'react';

export default function Home() {
  return (
    <div className="font-sanchez grid items-center justify-items-center min-h-screen gap-16">
      <header className="w-[60%] bg-[#000000]/60 items-center justify-items-center justify align-center left-1/2 transform -translate-x-1/2 backdrop-blur-md shadow-md text-center fixed top-4 p-6 rounded-2xl font-bold sm:text-3xl text-white">
        <nav className="relative flex justify-center font-bold gap-6">
            <Link href="/about" className="text-lg hover:underline">About</Link>
            <Link href="/" className="underline text-lg items-center">Projects</Link>
            <Link href="/experiences" className="text-lg hover:underline">Experiences</Link>
          </nav>
      </header>
    
     <main className="mt-30 flex flex-col items-center align-center gap-8 text-center">
           <div className="w-full max-w-4xl space-y-8 items-center justify-items-center">
               <h2 className="text-xl font-bold items-center align-center justify-items-center text-center mb-6">Mycelium-Based Leather</h2>
               <div className="flex justify-center">
                 <Image
                   src="/myceliumLeather.png"
                   alt="Mycelium-Based Leather Project"
                   width={600}
                   height={400}
                   className="rounded-lg object-cover"
                 />
               </div>
                 <div className="flex-1 text-left">
                   <br />
                 <p className="text-gray-700 mb-4">The rising demand for sustainable materials is encouraging the fashion industry to explore innovative alternatives to traditional leather. [1] Among these, mycelium-based leather is a promising solution, offering an environmentally-friendly, biodegradable substitute for animal-based products. Mycelium, the vegetative part of fungi, has structural properties that make it a viable candidate for the manufacture of durable, flexible materials. This project investigates the cultivation and chemical processing of mycelium to produce a leather-like material suitable for fashion accessories. By detailing each step, from substrate preparation to prototyping, this research paper contributes to a sustainable approach to materials science, offering prospects for future applications of mycelium in different sectors such as fashion.  </p>
                 </div>
               
           </div>
     <div className="w-full aspect-[9/16] rounded-md overflow-hidden">
                 <object
                     data="/myceliumLeather.pdf"
                     type="application/pdf"
                     width={2000}
                     height={1200}
                     className="w-full h-[1200px] rounded-md overflow-hidden"
                     aria-label="Resume PDF"
                 >
                     <div className="p-6 text-center">
                         <p className="mb-3">PDF preview is not available in your browser.</p>
                         <Link
                             href="/resume.pdf"
                             target="_blank"
                             rel="noopener noreferrer"
                             className="px-4 py-2 bg-cyan-500/70 hover:bg-cyan-500 rounded-md text-white text-sm"
                         >
                             Open PDF
                         </Link>
                     </div>
                 </object>
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
          href="www.linkedin.com/in/lelian-nh"
          target="_blank"
          rel="noopener noreferrer"
        >
         → LinkedIn 
        </Link>
      </footer>
    </div>
  );
}
