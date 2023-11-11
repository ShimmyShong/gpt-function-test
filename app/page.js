'use client'

import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import OpenAI from 'openai'
import 'dotenv/config'
import responseLogic from './utils/responseLogic'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [userInputValue, setUserInputValue] = useState('')
  const [userInput, setUserInput] = useState('')
  const [chatLog, setChatLog] = useState([])
  const chatBoxRef = useRef(null);


  useEffect(() => {
    // automatically scrolls chat box to bottom when new message is sent
    if (chatBoxRef) {
      chatBoxRef.current.addEventListener('DOMNodeInserted', event => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
      });
    }
  }, [chatLog])

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true)
    try {
      setChatLog(await responseLogic(userInputValue))

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="mx-auto py-4">
        {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
        <div className="mx-auto">
          <div className='mt-6 py-5 overflow-auto w-full h-[30rem] bg-white shadow-sm ring-1 ring-inset ring-gray-300' ref={chatBoxRef}>
            {chatLog.map((chat, index) => {
              if (chat.role === "user") {
                return <div key={index} className=' text-right pl-8 pb-4 text-green-500'>
                  {chat.content}
                </div>
              } else if (chat.role === "assistant") {
                return <div key={index} className='text-left pr-8 pb-4 text-red-500'>
                  {chat.content}
                </div>
              }
            })}</div>
          {loading && <div className="loading-indicator absolute translate-y-[-1.1rem]">
            Stranger is typing...
          </div>}
          <div>
            <div className="mt-2">
              <form onSubmit={(e) => handleSubmit(e) & setUserInput('')} autoComplete='off' className='flex flex-row gap-3'>
                <button
                  type="button"
                  className=" bg-white text-black py-2 px-8 hover:bg-slate-50 shadow-sm ring-1 ring-inset ring-gray-300"
                >
                  Disconnect
                </button>
                <input
                  type="text"
                  name="text"
                  id="text"
                  onChange={(e) => setUserInput(e.target.value) & setUserInputValue(e.target.value)}
                  value={userInput}
                  className="block w-full border-0 p-[2rem] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <button
                  type="submit"
                  className=" bg-white text-black py-2 px-8 hover:bg-slate-50 shadow-sm ring-1 ring-inset ring-gray-300"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
