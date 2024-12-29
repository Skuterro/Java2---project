import { useParams } from "react-router-dom";
import { Layout } from "../components/layout/Layout"
import { Wrapper } from "../components/layout/Wrapper"
import axios from "axios";
import { useEffect, useState } from "react";
import { Case } from "../models/case";
import { Item } from "../models/item";

export const CasePage = () => {
  const [blowCase, setBlowCase] = useState<Case>();
  const [caseItems, setCaseItems] = useState<Item[]>([]);
  const{ caseId } = useParams();
 //zrob geta do skrzynki (backend juz napisales - chyba dobrze)
  const handleFetchCase = async() => {
    console.log(`${import.meta.env.VITE_CASES_API_URL}/${caseId}`);
    const response = await axios.get(`${import.meta.env.VITE_CASES_API_URL}/${caseId}`);
    console.log(response.data);
    setBlowCase(response.data);
  }

  const handleFetchItems = async() => {
    //console.log(`${import.meta.env.VITE_CASES_API_URL}/${caseId}`);
    const response = await axios.get(`http://localhost:8080/cases/${caseId}/items`);
    console.log(response.data);
    setCaseItems(response.data);
  }

  useEffect(() => {
    handleFetchCase();
    handleFetchItems();
  }, []);

  return(
    <Layout>
      <Wrapper>
        <section>
          <div className="flex flex-col items-center">
            <img 
              src={`data:image/jpeg;base64,${blowCase?.imageData}`} 
              alt={blowCase?.name} 
              className="w-64 h-auto object-cover"
              />
            <p className="text-white">{blowCase?.name}</p>
            <p className="text-white">{blowCase?.price}$</p>      
          </div>     
          <div className="grid grid-cols-3 gap-4 list-none w-auto">
            {caseItems.length === 0 && (<span>Something went wrong...</span>)}
            {caseItems.map((item) => (
              <li key={item.id} className="bg-gradient-to-t from-gray-900 to-gray-800 flex flex-col items-center gap-8 shadow-lg rounded-xl p-12">
                <img 
                  src={`data:image/jpeg;base64,${item.imageData}`} 
                  alt={item.name} 
                  className="w-64 h-auto object-cover"
                />
                <p className="text-white">{item.name}</p>
                <p className="text-white">{item.price}$</p>
              </li>
            ))}
          </div>     
        </section>
      </Wrapper>
    </Layout>
  )
}