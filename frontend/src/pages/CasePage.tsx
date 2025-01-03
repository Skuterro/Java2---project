import { useParams } from "react-router-dom";
import { Layout } from "../components/layout/Layout"
import { Wrapper } from "../components/layout/Wrapper"
import axios from "axios";
import { useEffect, useState } from "react";
import { Case } from "../models/case";
import { Item } from "../models/item";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { useUserBalance } from "../providers/UserBalanceProvider";

export const CasePage = () => {
  const{ caseId } = useParams();
  const {userBalance, setUserBalance} = useUserBalance();
  const [blowCase, setBlowCase] = useState<Case>();
  const [caseItems, setCaseItems] = useState<Item[]>([]);
  const [Opening, setIsOpening] = useState(false);
  const [itemCase, setItemRoll] = useState<any>([]);
  const winningItemId = 70;
  const [winningItem, setWinningItem] = useState<Item>();
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const handleFetchCase = async() => {
    const response = await axios.get(`${import.meta.env.VITE_CASES_API_URL}/${caseId}`);
    setBlowCase(response.data);
  }

  const handleFetchWinningItemIndex = async() => {
    const token = Cookies.get('token');
    const response = await axios.get(
      `${import.meta.env.VITE_CASES_API_URL}/${caseId}/open`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    generateCaseRoll(response.data.id);
  }

  const handleFetchItems = async() => {
    const response = await axios.get(`http://localhost:8080/cases/${caseId}/items`);
    setCaseItems(response.data);
  }

  const generateCaseRoll = (ID: string) => {

    const itemRoll = [];
    for(let i = 0; i < 100; i++){
        const random = Math.floor(Math.random() * caseItems.length);

        if(i==winningItemId){
            const WinningItem = caseItems.find((item:any) => item.id === ID);
            setWinningItem(WinningItem);
            if(winningItem){
              itemRoll.push({id:i, name:winningItem.name, image:winningItem.imageData});
            }
            continue
        }
        itemRoll.push({id:"", name:"", image:caseItems[random].imageData});
    }
    setItemRoll(itemRoll);
  }
  
  const itemWidth = 120
  const distance = -((winningItemId * itemWidth) - (window.innerWidth / 2 - itemWidth / 2));

  const handleSellItem = async(ID: string) => {
    const token = Cookies.get('token');
    await axios.get(`http://localhost:8080/user/sell/${ID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const handleOpenCaseClick = () => {
    handleFetchWinningItemIndex();   
    setIsOpening(true)
  }

  useEffect(() => {
    handleFetchCase();
    handleFetchItems();
  }, []);

  return (
    <Layout>
      <Wrapper>
        <section>
          <div className="flex flex-col items-center">
            {/* Sprawdzenie, czy blowCase jest załadowane */}
            {blowCase ? (
              <>
                <p className="text-white font-bold text-4xl my-5">{blowCase.name}</p>
                <img
                  src={`data:image/jpeg;base64,${blowCase.imageData}`}
                  alt={blowCase.name}
                  className="w-64 h-auto object-cover"
                />
                <p
                  className={`border-b-2 border-gray-500 mt-5 transition-all duration-500 ease-in-out ${
                    Opening ? "w-full" : "w-[20vw]"
                  }`}
                ></p>
                {!Opening ? (
                  <button
                    className="bg-green-900 border-2 border-green-500 font-bold text-white my-5 p-2 rounded-2xl hover:bg-green-500 transition-colors duration-300 ease-in-out"
                    onClick={() => {
                      handleOpenCaseClick()
                      setUserBalance(userBalance - blowCase.price)
                    }}
                  >
                    OPEN $ {blowCase?.price.toFixed(2)}
                  </button>
                ) : (
                  <div className="relative w-full h-full overflow-hidden my-2">
                    <div className="absolute z-50 h-full left-1/2 transform -translate-x-1/2 border-2 border-red-500"></div>
                    <motion.div
                      className="flex"
                      animate={{
                        x: distance,
                        opacity: 1,
                      }}
                      initial={{ opacity: 0 }}
                      transition={{
                        x: { type: "tween", duration: 5, ease: "easeOut" },
                        opacity: { type: "tween", duration: 1, ease: "easeOut" },
                      }}
                      onAnimationComplete={() => {
                        setIsOpening(false);
                        setIsModalVisible(true);
                      }}
                    >
                      {itemCase.map((item: any) => (
                        <div key={item.id} className="w-[120px] flex-shrink-0 flex flex-col items-center">
                          <img
                            src={`data:image/jpeg;base64,${item?.image}`}
                            alt={item?.name}
                            className="w-64 h-[120px] object-cover"
                          />
                        </div>
                      ))}
                    </motion.div>
                  </div>
                )}
                <p
                  className={`border-b-2 border-gray-500 transition-all duration-500 ease-in-out ${
                    Opening ? "w-full" : "w-0"
                  } ${Opening ? "mb-10" : "mb-1"}`}
                ></p>
              </>
            ) : (
              <p className="text-white">Loading...</p> // Komunikat ładowania, gdy blowCase jest undefined
            )}
          </div>
          <ul className="grid grid-cols-7 gap-4 list-none w-full mb-12">
            {caseItems.length === 0 && <span>Something went wrong...</span>}
            {caseItems.map((item, index) => (
              <motion.li
                key={item.id}
                className="bg-gradient-to-t from-gray-900 to-gray-800 flex flex-col items-center gap- rounded-xl p-2"
                custom={index}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
              >
                <img
                  src={`data:image/jpeg;base64,${item.imageData}`}
                  alt={item.name}
                  className="w-64 h-auto object-cover"
                />
                <p className="text-white">{item.name}</p>
              </motion.li>
            ))}
          </ul>
        </section>
        {isModalVisible && winningItem && blowCase && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gradient-to-t from-gray-900 to-gray-800 flex flex-col items-center rounded-2xl p-5">
              <h2 className="text-xl font-bold text-white mb-4">CONGRATULATIONS!</h2>
              <img
                src={`data:image/jpeg;base64,${winningItem.imageData}`}
                alt={winningItem.name}
                className="w-64 h-auto object-cover mb-2"
              />
              <p className="text-white text-xl font-bold mb-4">{winningItem.name}</p>
              <div className="flex space-x-4">
                <button
                  className="w-[8vw] bg-purple-900 font-bold text-gray-300 border-2 border-purple-500 rounded-2xl p-2 hover:bg-purple-500 hover:text-white transition-colors duration-300 ease-in-out"
                  onClick={() => setIsModalVisible(false)}
                >
                  CLOSE
                </button>
                <button
                  className="w-[8vw] bg-green-900 font-bold text-gray-300 border-2 border-green-500 rounded-2xl p-2 hover:bg-green-500 hover:text-white transition-colors duration-300 ease-in-out"
                  onClick={() => {
                    handleSellItem(winningItem.id);
                    setIsModalVisible(false);
                    setUserBalance(userBalance + blowCase.price)
                  }}
                >
                  SELL $ {winningItem.price}
                </button>
              </div>
            </div>
          </div>
        )}
      </Wrapper>
    </Layout>
  );
}