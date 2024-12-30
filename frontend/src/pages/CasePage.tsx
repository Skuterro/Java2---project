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
            <p className="w-[20vw] border-b-2 border-gray-500 mt-5"></p>
            <button className="bg-green-900 border-2 border-green-500 font-bold text-white my-5 p-2 rounded-2xl hover:bg-green-500 transition-colors duration-300 ease-in-out">
              OPEN $ {blowCase?.price} 
            </button>    
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