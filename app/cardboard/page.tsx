'use client';
import Image from "next/image";
import React, { useEffect, useState } from 'react';
import Link from "next/link";

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
            <Link href="/about" className="text-lg hover:underline">About</Link>
            <Link href="/" className="underline text-lg items-center">Projects</Link>
            <Link href="/experiences" className="text-lg hover:underline">Experiences</Link>
          </nav>
      </header>
    
    <main className="mt-30 flex flex-col items-center align-center gap-8 text-center">
      <div className="w-full max-w-4xl space-y-8 items-center justify-items-center">
          <h2 className="text-xl font-bold items-center align-center justify-items-center text-center mb-6">Upcycling Cardboard - Water proofing process</h2>
          <div className="flex justify-center">
            <Image
              src="/cardboard.jpeg"
              alt="Upcycling Cardboard Project"
              width={600}
              height={400}
              className="rounded-lg object-cover"
            />
          </div>
            <div className="flex-1 text-left">
              <br />
            <p className="text-gray-700 mb-4">This project focuses on the water proofing process for upcycling cardboard materials.
              This porject is on going development and more information will be available soon.
            </p>
            </div>
          
      </div>
      <iframe
        src="https://lel-nh.github.io/portfolio/"
        width={600}
        height={400}
        className="rounded-lg"
        style={{ border: "none" }}
      ></iframe>
    </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center mb-4">
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
          E-mail →
        </Link>
      </footer>
    </div>
  );
}