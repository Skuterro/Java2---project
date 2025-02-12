import { Layout } from "../components/layout/Layout"
import { useAuth } from "../providers/AuthProvider"
import { Wrapper } from "../components/layout/Wrapper";
import { useState, useEffect } from "react";
import { Item } from "../models/item";
import axios from "axios";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { useUserBalance } from "../providers/UserBalanceProvider";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";

export const UserProfile = () => {
  const {loggedUser, handleLogout} = useAuth();
  const {userBalance, setUserBalance} = useUserBalance();
  const [userItems, setUserItems] = useState<any>([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleUpload = (event:any) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file); 
    }
  };

  const handleSave = async () => {
    if(isLoading){
      return;
    }
    setIsLoading(true);
    if (!selectedImage) {
      alert("No image selected!");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage); // Dodaj obraz do formData

    try {
      const response = await axios.post(`http://localhost:8080/image/${loggedUser?.userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Image uploaded successfully!");
      console.log("Server response:", response.data);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image!");
    }
    setIsLoading(false);
  };

  const token = Cookies.get("token");

  const handleFetchItems = async (sortBy: string = "createdAt", direction: string = "desc") => {   
    const response = await axios.get(`http://localhost:8080/useritem/details?sortBy=${sortBy}&direction=${direction}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    setUserItems(response.data);
  }

  const handleSellItem = async(ID: string) => {
    await axios.get(`http://localhost:8080/useritem/${ID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    handleFetchItems();
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
        <section className="mb-10">
          <div className="flex flex-row mt-10 mb-4 gap-4">
            <div className="flex flex-col items-center w-1/2 bg-gradient-to-t from-gray-900 to-gray-800 rounded-3xl">
              <img 
                  className="w-[50%] h-[60%] my-10"
                  src={`http://localhost:8080/image/${loggedUser?.imageId}`} 
                  alt="profile photo" />
              <div className="flex flex-row justify-center gap-10">
              <input
                type="file"
                accept="image/*"
                id="file-upload"
                className="hidden"
                onChange={handleUpload}
              />
              <label
                htmlFor="file-upload"
                className="text-center cursor-pointer w-[8vw] bg-purple-900 font-bold text-gray-300 border-2 border-purple-500 rounded-2xl p-2 hover:bg-purple-500 hover:text-white transition-colors duration-300 ease-in-out"
              >
                {t("profile.upload")}
              </label>                
              <button onClick={handleSave} className="w-[8vw] bg-purple-900 font-bold text-gray-300 border-2 border-purple-500 rounded-2xl p-2 hover:bg-purple-500 hover:text-white transition-colors duration-300 ease-in-out">
                {t("profile.save")}
              </button>
              </div>
            </div>
            <div className="flex flex-col w-1/2 bg-gradient-to-t from-gray-900 to-gray-800 rounded-3xl">
              <ul className="ml-10 mt-10 text-2xl text-gray-300 font-bold">
                <li className="mb-8">{t("profile.username")}: {loggedUser?.username}</li>
                <li className="mb-8">{t("profile.email")}: {loggedUser?.email}</li>
                <li className="mb-8">{t("profile.casesOpened")}: </li>
                <li className="mb-8">{t("profile.allTimeProfit")}: </li>
              </ul>
              <div className="flex justify-center items-center h-full">
                <button 
                  className="w-[8vw] font bg-red-900 font-bold text-gray-300 border-2 border-red-500 rounded-2xl p-2 hover:bg-red-500 hover:text-white transition-colors duration-300 ease-in-out"
                  onClick={handleLogout}
                >
                  {t("profile.logout")}
                </button>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-t from-gray-900 to-gray-800 w-full flex flex-col rounded-3xl ">
          <div className="flex gap-4 mb-4 w-full justify-center">
            <button
              onClick={() => handleFetchItems("createdAt", "asc")}
              className="bg-blue-800 text-white p-2 rounded"
            >
              Sortuj po dacie (rosnąco)
            </button>
            <button
              onClick={() => handleFetchItems("createdAt", "desc")}
              className="bg-blue-800 text-white p-2 rounded"
            >
              Sortuj po dacie (malejąco)
            </button>
            <button
              onClick={() => handleFetchItems("price", "asc")}
              className="bg-green-800 text-white p-2 rounded"
            >
              Sortuj po cenie (rosnąco)
            </button>
            <button
              onClick={() => handleFetchItems("price", "desc")}
              className="bg-green-800 text-white p-2 rounded"
            >
              Sortuj po cenie (malejąco)
            </button>
          </div>
            <div className="w-full flex justify-center"><h2 className="text-gray-300 font-bold p-4">{t("profile.recentDrops")}</h2></div>
            <div className="grid grid-cols-7 gap-4 list-none w-full p-2">
              {userItems.length === 0 && (<span></span>)}
              {userItems.map((item:any, index:any) => (
                <motion.li
                  key={item.id}
                  className="bg-gradient-to-t from-gray-900 to-gray-700 flex flex-col items-center gap-2 rounded-xl p-2 relative group ransition justify-between"
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={itemVariants}
                >
                  <p className="text-white font-bold">{item.itemName}</p>
                  <img
                    src={`data:image/jpeg;base64,${item.image}`}
                    alt={item.name}
                    className="w-64 h-auto object-cover rounded-lg group-hover:opacity-40 transition duration-300"
                  />
                  <div className="flex flex-col justify-center items-center">
                    <p className="text-green-400 font-bold">$ {item.price}</p>
                    <p className="text-white font-bold">{new Date(item.createdAt).toISOString().split("T")[0]}</p>
                    <p className="text-white font-bold">{format(new Date(item.createdAt), "HH:mm")}</p>
                  </div>
                   <button
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-900 border-2 border-red-500 
                    text-gray-300 font-bold py-2 px-4 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 hover:bg-red-500 hover:text-white"
                    onClick={() => {
                      handleSellItem(item.id);
                      setUserBalance(userBalance + item.price)
                    }}
                  >
                    {t("profile.sell")}
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