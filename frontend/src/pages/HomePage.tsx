import { useEffect, useState } from "react";
import { Layout } from "../components/layout/Layout";
import { Case } from "../models/case";
import axios from "axios";
import { Wrapper } from "../components/layout/Wrapper";
import { useNavigate } from "react-router-dom";

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
      className="bg-gradient-to-t from-gray-800 to-black rounded-3xl cursor-pointer flex items-center flex-col 
                 transform transition-transform duration-300 hover:scale-95 active:scale-90"
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
      <p className="text-white font-bold">
        $ {price.toFixed(2)}
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
  const [maxPage, setMaxPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const navigate = useNavigate();

  const handleFetchCases = async () => {
    const response = await axios.get(import.meta.env.VITE_CASES_API_URL + `?page=${currentPage}`);
    console.log(response.data);
    setCases(response.data.content);
    setMaxPage(response.data.totalPages); 
  }

  useEffect(() => {
    handleFetchCases();
   
  }, []);

  useEffect(() => {
    handleFetchCases();
  }, [currentPage]);

  return(
    <Layout>
      <Wrapper>
      <section className="flex flex-col h-[80vh] justify-between">          
        <div className="bg-black p-10">
            <CasesList>
              {cases.length === 0 && (<span>Something went wrong...</span>)}
              {cases.map((dropCase) => (
                <CaseCard
                  name={dropCase.name}
                  image={dropCase.imageData}
                  price={dropCase.price}
                  onClick={() => navigate(`/case/${dropCase.id}`)}
                />
              ))}
            </CasesList>
          </div>
          
          <div className="flex justify-center gap-4 mt-4">
            <button 
              className="bg-gradient-to-t from-gray-800 to-black rounded-2xl p-2 text-white font-bold"
              onClick={() => currentPage > 0 && setCurrentPage(currentPage - 1)}>
              &lt;
            </button>
            <button 
              className="bg-gradient-to-t from-gray-800 to-black rounded-2xl p-2 text-white font-bold"
              onClick={() => {maxPage > currentPage + 1 && setCurrentPage(currentPage + 1)}}
            >
              &gt;
            </button>
          </div>
        </section>
      </Wrapper>
    </Layout>
  );
};

