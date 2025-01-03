import { Layout } from "../components/layout/Layout"
import { useAuth } from "../providers/AuthProvider"
import { Wrapper } from "../components/layout/Wrapper";
import profile_img from "../images/Bez tytułu.png"
import { useState, useEffect } from "react";
import { Item } from "../models/item";
import axios from "axios";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { useUserBalance } from "../providers/UserBalanceProvider";

export const UserProfile = () => {
  const {loggedUser, handleLogout} = useAuth();
  const {userBalance, setUserBalance} = useUserBalance();
  const [userItems, setUserItems] = useState<Item[]>([]);
  const token = Cookies.get("token");

  const handleFetchItems = async() => {   
    const response = await axios.get("http://localhost:8080/user/items", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
  });
    setUserItems(response.data);
  }

  const handleSellItem = async(ID: string) => {
    await axios.get(`http://localhost:8080/user/sell/${ID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i : number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1, 
      },
    }),
  };

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
            <div className="grid grid-cols-7 gap-4 list-none w-full p-2">
              {userItems.length === 0 && (<span></span>)}
              {userItems.map((item, index) => (
                <motion.li
                  key={item.id}
                  className="bg-gradient-to-t from-gray-900 to-gray-700 flex flex-col items-center gap-2 rounded-xl p-2 relative group ransition"
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={itemVariants}
                >
                  <p className="text-white font-bold">{item.name}</p>
                  <img
                    src={`data:image/jpeg;base64,${item.imageData}`}
                    alt={item.name}
                    className="w-64 h-auto object-cover rounded-lg group-hover:opacity-40 transition duration-300"
                  />
                  <p className="text-white font-bold">$ {item.price}</p>
                  <button
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-900 border-2 border-red-500 
                    text-gray-300 font-bold py-2 px-4 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 hover:bg-red-500 hover:text-white"
                    onClick={() => {
                      handleSellItem(item.id);
                      setUserBalance(userBalance + item.price)
                    }}
                  >
                    SELL
                  </button>
                </motion.li>
              ))}
            </div>
          </div>
        </section>
      </Wrapper>
    </Layout>
  )
}