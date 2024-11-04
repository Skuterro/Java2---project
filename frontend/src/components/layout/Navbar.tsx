import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { FaRegMessage } from "react-icons/fa6";
import { FaDropbox } from "react-icons/fa6";
import { FiBox } from "react-icons/fi";
import { MdCreate } from "react-icons/md";
import { ReactNode } from "react";

export const Navbar = () => {

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("");
  }

  return (
    <nav className="bg-black w-full flex items-center justify-between h-[5vh]">
      <div className="flex items-center ml-5">
        <FaDropbox className="text-purple-500 mr-2 text-4xl"/>
        <div className="flex flex-col text-3xl">
          <span className="text-white font-bold -mb-2">BLOW</span>
          <span className="text-white text-sm tracking-wider">CASE</span>
        </div>
      </div>
      <ul className="bg-black flex justify-center items-center text-lg gap-[20vh] -ml-[13vh]">
        <NavItem to="/" text="CREATE CASE"/>
        <NavItem to="/" text="CASES"/>
        <NavItem to="/" text="CONTACT"/>
      </ul>
      <div className="flex mr-5">
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
}

interface ListElementProps {
  children : React.ReactNode;
}

export const ListElement = ({ children } : ListElementProps) => {
  <li>

  </li>
}

export const NavItem = ({to, text}: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
        ? "px-2 text-white font-bold text-xl hover:text-purple-500 transition-colors duration-300 ease-in-out"
        : "px-2 text-gray-600 hover:text-black transition-colors duration-500 ease-in-out"
      }
    >
      {text}
    </NavLink>
  );
};
