import { FaArrowUp } from "react-icons/fa6";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-black to-gray-800 rounded-t-3xl h-[20vh] -mt-6">
      <div className="flex justify-center items-center h-full">
        <button className="bg-gray-800 w-[70px] h-[70px] rounded-2xl hover:bg-purple-500 transition-colors duration-300 ease-in-out group">
          <FaArrowUp className="text-purple-500 font-bold text-4xl ml-4 group-hover:text-black transition-colors duration-300 ease-in-out"/>
        </button>
      </div>
    </footer>
  );
};