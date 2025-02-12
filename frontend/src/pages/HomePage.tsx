import { useEffect, useState } from "react";
import { Layout } from "../components/layout/Layout";
import { Case } from "../models/case";
import axios from "axios";
import { Wrapper } from "../components/layout/Wrapper";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface CaseCardProps {
  name: string;
  image?: string | null;
  price: number;
  onClick: () => void;
  visible: boolean;
}

const CaseCard = ({ name, image, price, onClick, visible }: CaseCardProps) => {
  return (
    <li
      onClick={onClick}
      className={`
        bg-gradient-to-t from-gray-800 to-black rounded-3xl cursor-pointer
        flex items-center flex-col
        transform transition-all duration-500 ease-out
        hover:scale-95 active:scale-90
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}
      `}
    >
      {image && (
        <img
          src={`data:image/jpeg;base64,${image}`}
          alt={name}
          className="w-40 h-40 object-cover rounded-xl"
        />
      )}
      <h3 className="text-white text-lg font-semibold mt-2">{name}</h3>
      <p className="text-white font-bold">${price.toFixed(2)}</p>
    </li>
  );
};

const CasesList = ({ children }: { children: React.ReactNode }) => {
  return <ul className="grid grid-cols-3 gap-4 list-none w-auto">{children}</ul>;
};

export const HomePage = () => {
  const { t } = useTranslation();
  const [cases, setCases] = useState<Case[]>([]);
  const [maxPage, setMaxPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Po zmianie strony najpierw ukrywamy listę
    setIsVisible(false);

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_CASES_API_URL}?page=${currentPage}`
        );
        setCases(response.data.content);
        setMaxPage(response.data.totalPages);
      } catch (err) {
        setError(t("homepage.fetchError"));
      } finally {
        setLoading(false);
        // Pozwalamy Reactowi wyrenderować listę w stanie niewidocznym,
        // a dopiero w kolejnej "klatce" animujemy do stanu widocznego.
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      }
    };

    fetchData();
  }, [currentPage]);

  return (
    <Layout>
      <Wrapper>
        <section className="flex flex-col h-[80vh] justify-center">
          <div className="bg-black p-10">
            {loading && <p className="text-white"></p>}
            {error && <p className="text-red-500">{error}</p>}
            <CasesList>
              {cases.length === 0 && !loading && !error && (
                <span className="text-white">{t("homepage.noCases")}</span>
              )}
              {cases.map((dropCase) => (
                <CaseCard
                  key={dropCase.id}
                  name={dropCase.name}
                  image={dropCase.imageData}
                  price={dropCase.price}
                  onClick={() => navigate(`/case/${dropCase.id}`)}
                  visible={isVisible}
                />
              ))}
            </CasesList>
          </div>
        </section>
        <div className="flex justify-center gap-4 mt-4">
          <button
            className="bg-gradient-to-t from-gray-800 to-black rounded-2xl p-2 text-white font-bold"
            onClick={() => currentPage > 0 && setCurrentPage(currentPage - 1)}
            disabled={currentPage === 0}
          >
            &lt;
          </button>
          <button
            className="bg-gradient-to-t from-gray-800 to-black rounded-2xl p-2 text-white font-bold"
            onClick={() => maxPage > currentPage + 1 && setCurrentPage(currentPage + 1)}
            disabled={currentPage >= maxPage - 1}
          >
            &gt;
          </button>
        </div>
      </Wrapper>
    </Layout>
  );
};
