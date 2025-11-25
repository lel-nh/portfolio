"use client";
import Image from "next/image";
import { useState, useEffect } from 'react';

export default function Home() {
  return (
    <div className="font-sanchez grid items-center justify-items-center min-h-screen gap-16">
      <header className="w-[60%] bg-[#000000]/60 items-center justify-items-center justify align-center left-1/2 transform -translate-x-1/2 backdrop-blur-md shadow-md text-center fixed top-4 p-6 rounded-2xl font-bold sm:text-3xl text-white">
        <nav className="relative flex justify-center font-bold gap-6">
            <a href="/about" className="text-lg hover:underline">About</a>
            <a href="/" className="text-lg items-center hover:underline">Projects</a>
            <a href="/experiences" className="underline text-lg hover:underline">Experiences</a>
          </nav>
      </header>
    
     <main className="mt-30 flex flex-col items-center align-center gap-8 text-center">
           <div className="w-full max-w-4xl space-y-8 items-center justify-items-center">
               <h2 className="text-xl font-bold items-center align-center justify-items-center text-center mb-6">Institute for Future Technologies</h2>
               <div className="flex justify-center">
                 <Image
                   src="/ift.png"
                   alt="Institute for Future Technologies"
                   width={200}
                   height={200}
                   className="rounded-lg object-cover"
                 />
               </div>
                 <div className="flex-1 text-left">
                   <br />
                 <p className="text-gray-700 mb-4">I am a student at the Institute for Future Technologies (IFT), where I work on a wide range of innovative projects both independently and within multidisciplinary teams. My experience spans biomaterials engineering, off-earth construction concepts, Martian regolith simulant research, and human-centered experimental design. This environment allows me to explore emerging technologies while contributing to research, prototyping, and creative development across diverse fields. </p>
                 </div>
               
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