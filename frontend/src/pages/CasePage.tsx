import { useParams } from "react-router-dom";
import { Layout } from "../components/layout/Layout"
import { Wrapper } from "../components/layout/Wrapper"
import axios from "axios";
import { useEffect, useState } from "react";
import { Case } from "../models/case";
import { Item } from "../models/item";
import { motion } from "framer-motion";

export const CasePage = () => {
  const [blowCase, setBlowCase] = useState<Case>();
  const [caseItems, setCaseItems] = useState<Item[]>([]);
  const{ caseId } = useParams();

  const [itemCase, setItemRoll] = useState<any>([]);
  const winningItemId = 70;
  const [winningItemIndex, setWinningItemIndex] = useState<String>("");
  const [isAnimating, setIsAnimating] = useState(false);

  const [Opening, setIsOpening] = useState(false);

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

  const handleFetchItems = async() => {
    const response = await axios.get(`http://localhost:8080/cases/${caseId}/items`);
    setCaseItems(response.data);

    //TUTAJ BEDZIE GET DO WYGRYWAJĄCEGO ID
    setWinningItemIndex("0e2dbc61-0770-4777-985a-94d64f7eb423")
  }

  const generateCaseRoll = async () => {

    const itemRoll = [];
    for(let i = 0; i < 100; i++){
        const random = Math.floor(Math.random() * caseItems.length);

        if(i==winningItemId){
            const winningItem= caseItems.find((item:any) => item.id === winningItemIndex);
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

  const handleOpenCaseClick = () => {
    generateCaseRoll();
    setIsOpening(!Opening)
  }

  useEffect(() => {
    handleFetchCase();
    handleFetchItems();
  }, []);

  return(
    <Layout>
      <Wrapper>
        <section >
          <div className="flex flex-col items-center">
            <p className="text-white font-bold text-4xl my-5">{blowCase?.name}</p>
            <img 
              src={`data:image/jpeg;base64,${blowCase?.imageData}`} 
              alt={blowCase?.name} 
              className="w-64 h-auto object-cover"
            />
            <p className={`border-b-2 border-gray-500 mt-5 transition-all duration-500 ease-in-out ${Opening ? 'w-full' : 'w-[20vw]'}`}></p>
            {!Opening ? (
              <button 
              className="bg-green-900 border-2 border-green-500 font-bold text-white my-5 p-2 rounded-2xl hover:bg-green-500 transition-colors duration-300 ease-in-out"
              onClick={() => handleOpenCaseClick()}
              >
                OPEN $ {blowCase?.price} 
              </button>
            ) : (
              <div className="relative w-full h-full overflow-hidden my-2">
                <div 
                  className="absolute z-50 h-full left-1/2 transform -translate-x-1/2 border-2 border-red-500"
                ></div>
                <motion.div
                  className="flex"
                  animate={{ 
                    x: distance, 
                    opacity: 1    
                  }} 
                  initial={{ opacity: 0 }}
                  transition={{ 
                    x: { type: 'tween', duration: 5, ease: 'easeOut' },
                    opacity: { type: 'tween', duration: 1, ease: 'easeOut' }
                  }}
                  onAnimationComplete={() => setIsAnimating(false)}
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
            <p className={`border-b-2 border-gray-500 transition-all duration-500 ease-in-out ${Opening ? 'w-full' : 'w-0'} ${Opening ? 'mb-10' : 'mb-1'}`}></p>
          </div>     
          <ul className="grid grid-cols-7 gap-4 list-none w-full mb-12">
            {caseItems.length === 0 && (<span>Something went wrong...</span>)}
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
      </Wrapper>
    </Layout>
  )
}