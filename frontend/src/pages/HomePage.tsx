import { useEffect, useState } from "react";
import { Layout } from "../components/layout/Layout";
import { useAuth } from "../providers/AuthProvider";
import { Case } from "../models/case";
import axios from "axios";
import { Wrapper } from "../components/layout/Wrapper";

interface CasesListProps {
  children : React.ReactNode;
}

interface CaseCardProps {
  name: string;
  image?: string | null;
  price: number;
}

const CaseCard = ({
  name,
  image,
  price, 
  onClick 
}: CaseCardProps & { onClick: () => void}) => {

  return (
    <li
      className="bg-black shadow-md rounded-lg cursor-pointer"
      onClick={onClick}
      
    >
      {image && (
        <img 
          src={`data:image/jpeg;base64,${image}`} 
          alt={name} 
          className=""
        />
      )}
      <h3 className="text-white text-lg font-semibold">
        {name}
      </h3>
      <p className="text-white">
        {price}$
      </p>
    </li>
  )
} 

const CasesList = ({ children }: CasesListProps) => {

  return(
    <ul className="grid grid-cols-3 gap-4 list-none w-auto">
      {children}
    </ul>
  )
}

export const HomePage = () => {
  const [cases, setCases] = useState<Case[]>([]);

  const handleFetchCases = async () => {
    console.log(import.meta.env.VITE_CASES_API_URL)
    const response = await axios.get(import.meta.env.VITE_CASES_API_URL);
    console.log(response.data);
    setCases(response.data);
  }

  useEffect(() => {
    handleFetchCases();
   
  }, []);

  return(
    <Layout>
      <Wrapper>
        <section >
          <div className="bg-black h-auto">
            <CasesList>
              {cases.length === 0 && (<span>Something went wrong...</span>)}
              {cases.map((dropCase) => (
                <CaseCard
                  name={dropCase.name}
                  image={dropCase.imageData}
                  price={dropCase.price}
                  onClick={() => {}}
                />
              ))}
            </CasesList>
          </div>
        </section>
      </Wrapper>
    </Layout>
  );
};

