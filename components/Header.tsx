'use client'

import Image from 'next/image'
import React from 'react'
import logo from '@/images/Trello_logo.png'
import { HiMagnifyingGlass, HiUserCircle } from "react-icons/hi2";
import Avatar from 'react-avatar';


const Header = () => {
  return (
    <header>
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
        <Image src={logo} width={200} height={200} alt="logo" />

        <div className="flex items-center space-x-5 flex-1 justify-end w-full">
          <form className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial">
            <HiMagnifyingGlass className="h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="flex-1 outline-none p-2"
            />
            <button type="submit" hidden>
              Search
            </button>
          </form>

          <Avatar
            githubHandle="Virendra-khorwal"
            size="50"
            round={true}
            className="mr-5"
          />
        </div>
      </div>
      <div className="flex items-center justify-center px-5 md:py-5">
        <p className="flex items-center text-sm font-light pr-5 shadow-xl rounded-xl w-fit bg-white italic max-w-3xl text-[#0055D1] p-5">
          <HiUserCircle className="inline-block h-10 w-10 text-[#0055D1] mr-1" />
          GPT is summarising your tasks for the day...
        </p>
      </div>
    </header>
  );
}

export default Header