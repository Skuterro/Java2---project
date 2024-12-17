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
    const response = await axios.get(`http://localhost:8080/`);
    console.log(response.data);
    setBlowCase(response.data);
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
        </section>
      </Wrapper>
    </Layout>
  )
}