import { useParams } from "react-router-dom";
import { Layout } from "../components/layout/Layout"
import { Wrapper } from "../components/layout/Wrapper"
import axios from "axios";
import { useEffect, useState, useRef } from "react"; 
import { Case } from "../models/case";
import { Item } from "../models/item";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { useUserBalance } from "../providers/UserBalanceProvider";
import { useTranslation } from "react-i18next"; 
import { useLayoutEffect } from "react";

export const CasePage = () => {
  const { t } = useTranslation();
  const { caseId } = useParams();
  const { userBalance, setUserBalance } = useUserBalance();
  const [rollKey, setRollKey] = useState(0); 

  const [blowCase, setBlowCase] = useState<Case>();
  const [caseItems, setCaseItems] = useState<Item[]>([]);
  const [Opening, setIsOpening] = useState(false);
  const [itemCase, setItemRoll] = useState<any>([]);
  
  const winningItemId = 170;
  
  const [winningItem, setWinningItem] = useState<Item>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [droppedUserItem, setDroppedUserItem] = useState();

  const containerRef = useRef<HTMLDivElement>(null);

  const [distance, setDistance] = useState(0);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
      },
    }),
  };

  const handleFetchCase = async () => {
    const response = await axios.get(`${import.meta.env.VITE_CASE_API_URL}/${caseId}`);
    setBlowCase(response.data);
  };

  const handleFetchWinningItemIndex = async () => {
    const token = Cookies.get("token");
    const response = await axios.get(
      `${import.meta.env.VITE_CASE_API_URL}/open/${caseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setDroppedUserItem(response.data.userItemId);
    generateCaseRoll(response.data.itemId);
  };

  const handleFetchItems = async () => {
    const response = await axios.get(`http://localhost:8080/cases/${caseId}/items`);
    setCaseItems(response.data);
  };

  const generateCaseRoll = (ID: string) => {
    const itemRoll = [];
    setRollKey((prev) => prev + 1); 

    for (let i = 0; i < 200; i++) {
      const random = Math.floor(Math.random() * caseItems.length);

      if (i === winningItemId) {
        const foundWinner = caseItems.find((item: any) => item.id === ID);
        setWinningItem(foundWinner);
        itemRoll.push({
          id: i,
          name: foundWinner?.name,
          image: foundWinner?.imageData,
        });
      } else {
        itemRoll.push({
          id: `dummy-${i}`,
          name: "",
          image: caseItems[random]?.imageData,
        });
      }
    }
    setItemRoll(itemRoll);
  };

  const itemWidth = 100;

  useLayoutEffect(() => {
    if (Opening && containerRef.current && itemCase.length > 0) {
      const parentWidth = containerRef.current.offsetWidth || 0;
      const itemCenter = winningItemId * itemWidth + itemWidth / 2;
      const computedDistance = (parentWidth / 2) - itemCenter;
      setDistance(computedDistance);
    }
  }, [Opening, itemCase]);

  const handleSellItem = async () => {
    const token = Cookies.get("token");
    await axios.get(`http://localhost:8080/useritem/${droppedUserItem}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  // Po kliknięciu "Open"
  const handleOpenCaseClick = () => {
    handleFetchWinningItemIndex();
    setIsOpening(true);
    if (blowCase?.price) {
      setUserBalance(userBalance - blowCase.price);
    }
  };

  useEffect(() => {
    handleFetchCase();
    handleFetchItems();
  }, []);

  return (
    <Layout>
      <Wrapper>
        <section className="flex flex-col h-[80vh] justify-center items-center">
          <div className="flex flex-col items-center">
            {/* Jeśli blowCase jeszcze się nie załadował, wyświetl np. "Loading..." */}
            {blowCase?.name ? (
              <>
                <p className="text-white font-bold text-4xl my-5">
                  {blowCase.name}
                </p>
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

                {/* Główny przycisk do otwierania kejsa */}
                {!Opening ? (
                  <button
                    className="bg-green-900 border-2 border-green-500 font-bold text-white my-5 p-2 rounded-2xl hover:bg-green-500 transition-colors duration-300 ease-in-out"
                    onClick={handleOpenCaseClick}
                  >
                    {t("casePage.open")} $ {blowCase?.price.toFixed(2)}
                  </button>
                ) : (
                  /* Kontener z karuzelą - tu wpinamy ref */
                  <div
                    ref={containerRef}
                    className="relative w-full h-full overflow-hidden"
                  >
                    {/* Czerwona linia na środku kontenera */}
                    <div className="absolute z-50 h-full left-1/2 transform -translate-x-1/2 border-2 border-red-500"></div>
                    
                    <motion.div
                      key={rollKey}
                      initial={{ x: 0, opacity: 0 }}  
                      className="flex"
                      animate={{
                        x: distance,
                        opacity: 1,
                      }}
                      transition={{
                        x: { type: "tween", duration: 5, ease: "circOut" },
                        opacity: { type: "tween", duration: 1, ease: "circOut" },
                      }}
                      onAnimationComplete={() => {
                        setIsOpening(false);
                        setIsModalVisible(true);
                      }}
                    >
                      {itemCase.map((item: any, index: any) => (
                        <div
                          key={index}
                          className="w-[100px] flex-shrink-0 flex flex-col items-center"
                        >
                          <img
                            src={`data:image/jpeg;base64,${item?.image}`}
                            alt={item?.name}
                            className="w-64 h-auto object-cover"
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
              <p className="text-white">{t("casePage.loading")}</p>
            )}
          </div>

          {/* Lista wszystkich przedmiotów w kejsie (pokazujemy poniżej) */}
          <ul className="flex flex-wrap gap-4 justify-center">
            {caseItems.length === 0 && <span>{t("casePage.somethingWentWrong")}</span>}
            {caseItems.map((item, index) => (
              <motion.li
                key={item.id}
                className="bg-gradient-to-t from-gray-900 to-gray-600 flex flex-col items-center gap-2 rounded-xl p-2 w-[15%] h-auto"
                custom={index}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
              >
                <img
                  src={`data:image/jpeg;base64,${item.imageData}`}
                  alt={item.name}
                  className="w-25 h-auto object-cover"
                />
                <p className="text-white">{item.name}</p>
              </motion.li>
            ))}
          </ul>
        </section>

        {/* Modalne okno z wygrywającym przedmiotem */}
        {isModalVisible && winningItem && blowCase && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gradient-to-t from-gray-900 to-gray-800 flex flex-col items-center rounded-2xl p-5">
              <h2 className="text-xl font-bold text-white mb-4">
                {t("casePage.congratulations")}
              </h2>
              <img
                src={`data:image/jpeg;base64,${winningItem.imageData}`}
                alt={winningItem.name}
                className="w-64 h-auto object-cover mb-2"
              />
              <p className="text-white text-xl font-bold mb-4">
                {winningItem.name}
              </p>
              <div className="flex space-x-4">
                <button
                  className="w-[8vw] bg-purple-900 font-bold text-gray-300 border-2 border-purple-500 rounded-2xl p-2 hover:bg-purple-500 hover:text-white transition-colors duration-300 ease-in-out"
                  onClick={() => setIsModalVisible(false)}
                >
                  {t("casePage.close")}
                </button>
                <button
                  className="w-[8vw] bg-green-900 font-bold text-gray-300 border-2 border-green-500 rounded-2xl p-2 hover:bg-green-500 hover:text-white transition-colors duration-300 ease-in-out"
                  onClick={() => {
                    handleSellItem();
                    setIsModalVisible(false);
                    setUserBalance(userBalance + winningItem.price);
                  }}
                >
                  {t("casePage.sell")} $ {winningItem.price}
                </button>
              </div>
            </div>
          </div>
        )}
      </Wrapper>
    </Layout>
  );
};
