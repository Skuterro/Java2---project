import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { FaBoxOpen } from "react-icons/fa";
import { IconType } from "react-icons";
import { FiBox } from "react-icons/fi";
import { FiMessageSquare } from "react-icons/fi";
import { IoCreateOutline } from "react-icons/io5";
import { useUserBalance } from "../../providers/UserBalanceProvider";
import { useTranslation } from "react-i18next";

export const Navbar = () => {
  const { userBalance } = useUserBalance(); 
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/userProfile");
  }

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <nav className="bg-black w-full flex flex-row items-center justify-between h-[8vh] border-b-2 border-gray-500 relative">
      <div className="flex items-center ml-5">
        <FaBoxOpen className="text-purple-500 mr-2 text-4xl"/>
        <div className="flex flex-col text-3xl">
          <span className="select-none text-white font-bold -mb-2">BLOW</span>
          <span className="select-none text-white text-sm tracking-wider">CASE</span>
        </div>
      </div>
      <ul className="absolute left-1/2 transform -translate-x-1/2 flex justify-center items-center text-lg gap-[20vh]">
        <NavItem to="/CreateCase" text={t("create_case")} icon={IoCreateOutline} />
        <NavItem to="/" text={t("cases")} icon={FiBox}/>
        <NavItem to="/Contact" text={t("contact")} icon={FiMessageSquare}/>
      </ul>
      <div className="flex mr-5 gap-10">
        <button className="text-white font-bold border-2 rounded-xl p-2 bg-green-900 border-green-500 w-auto hover:bg-green-500 transition-colors duration-300 ease-in-out">
          $ {userBalance.toFixed(2)}        
        </button>
        <button 
          className="text-3xl text-white hover:text-purple-500 transition-colors duration-300 ease-in-out"
          onClick={() => changeLanguage(i18n.language === "en" ? "pl" : "en")}
        >
          🌐
        </button>

        <button 
          className="text-3xl text-white hover:text-purple-500 transition-colors duration-300 ease-in-out" 
          onClick={handleNavigate}
        >
          <FiUser/> 
        </button>
      </div>
    </nav>
  );
};

interface NavItemProps {
  to: string;
  text: string;
  icon: IconType;
}

export const NavItem = ({to, text, icon:Icon}: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
        ? "flex items-center px-2 text-white font-bold text-xl hover:text-purple-500 transition-colors duration-300 ease-in-out"
        : "flex px-2 text-gray-600 hover:text-purple-500 transition-colors duration-500 ease-in-out"
      }
    >
      {text}
      <Icon className="text-2xl ml-2"/>
    </NavLink>
  );
};
