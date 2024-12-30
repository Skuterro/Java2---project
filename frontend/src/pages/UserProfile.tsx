import { Layout } from "../components/layout/Layout"
import { useAuth } from "../providers/AuthProvider"
import { Wrapper } from "../components/layout/Wrapper";
import profile_img from "../images/Bez tytułu.png"
import { useState, useEffect } from "react";
import { Item } from "../models/item";
import axios from "axios";
import { li, ul } from "framer-motion/client";

export const UserProfile = () => {
  const {loggedUser, handleLogout} = useAuth();
  const [userItems, setUserItems] = useState<Item[]>([]);
  
  const handleFetchItems = async() => {
    const response = await axios.get("");
    setUserItems(response.data);
  }

    useEffect(() => {
      handleFetchItems();
    }, []);

  return(
    <Layout>
      <Wrapper>
        <section>
          <div className="flex flex-row mt-10 mb-4 gap-4">
            <div className="flex flex-col items-center w-1/2 bg-gradient-to-t from-gray-900 to-gray-800 rounded-3xl">
              <img 
                className="w-[50%] h-[60%] my-10"
                src={profile_img} 
                alt="profile photo" />
              <div className="flex flex-row justify-center gap-10">
                <button className="w-[8vw] bg-purple-900 font-bold text-gray-300 border-2 border-purple-500 rounded-2xl p-2 hover:bg-purple-500 hover:text-white transition-colors duration-300 ease-in-out">UPLOAD</button>
                <button className="w-[8vw] bg-purple-900 font-bold text-gray-300 border-2 border-purple-500 rounded-2xl p-2 hover:bg-purple-500 hover:text-white transition-colors duration-300 ease-in-out">SAVE</button>
              </div>
            </div>
            <div className="flex flex-col w-1/2 bg-gradient-to-t from-gray-900 to-gray-800 rounded-3xl">
              <ul className="ml-10 mt-10 text-2xl text-gray-300 font-bold">
                <li className="mb-8">USERNAME: {loggedUser?.username}</li>
                <li className="mb-8">EMAIL: {loggedUser?.email}</li>
                <li className="mb-8">CASES OPENED: </li>
                <li className="mb-8">ALL-TIME PROFIT: </li>
              </ul>
              <div className="flex justify-center items-center h-full">
                <button 
                  className="w-[8vw] font bg-red-900 font-bold text-gray-300 border-2 border-red-500 rounded-2xl p-2 hover:bg-red-500 hover:text-white transition-colors duration-300 ease-in-out"
                  onClick={handleLogout}
                >
                  LOGOUT
                </button>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-t from-gray-900 to-gray-800 w-full flex flex-col rounded-3xl ">
            <p className="text-gray-300 font-bold p-4">YOUR RECENT DROPS:</p>
            <div className="grid grid-cols-7 gap-4 list-none w-full">
              {userItems.length === 0 && (<span>You have no items</span>)}

            </div>
          </div>
        </section>
      </Wrapper>
    </Layout>
  )
}