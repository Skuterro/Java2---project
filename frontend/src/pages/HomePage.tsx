import { useEffect, useState } from "react";
import { Layout } from "../components/layout/Layout";
import { useAuth } from "../providers/AuthProvider";
import { Case } from "../models/case";
import axios from "axios";

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
      <h3 className="text-lg font-semibold">
        {name}
      </h3>
      <p>
        {price}$
      </p>
    </li>
  )
} 

const CasesList = ({ children }: CasesListProps) => {

  return(
    <ul className="grid grid-cols-3 gap-4 list-none p-0">
      {children}
    </ul>
  )
}

export const HomePage = () => {
  const { loggedUser } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);

  const handleFetchCases = async () => {
    const response = await axios.get("...");
    setCases(response.data);
  }

  useEffect(() => {
    handleFetchCases();
    if(loggedUser == undefined){
      
    }
    console.log("User:", loggedUser);    
  }, []);

  return(
    <Layout>
      <section className="bg-black h-[80vh]">
        <div>
          <CasesList>
            {cases.length === 0 && (<span>Something went wrong...</span>)}
            {cases.map((dropCase) => (
              <CaseCard
                name={dropCase.name}
                image={dropCase.image}
                price={dropCase.price}
                onClick={() => {}}
              />
            ))}
          </CasesList>
        </div>
      </section>
    </Layout>
  );
};

