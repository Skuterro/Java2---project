import { Layout } from "../components/layout/Layout"
import { Field, Form, Formik} from "formik";
import { FaRegEnvelope, FaRegUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import axios, { AxiosError } from 'axios';
import { useAuth } from "../providers/AuthProvider";
import * as Yup from "yup";
import Cookies from "js-cookie";
import { User } from "../models/user";
import { RegisterRequest, RegisterResponse } from "../models/apiTypes";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useState } from "react";


export const RegistePage = () => {
  const {loggedUser, setLoggedUser} = useAuth();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if(loggedUser != undefined && loggedUser.authenticated == true){
      navigate("/");
    }
  },[loggedUser]);

  const handleLoginClick = async ({email, password, username}: RegisterRequest) => {
    try{
      setLoading(true);
      const response = await axios.post<RegisterResponse>(import.meta.env.VITE_REGISTER_API_URL, {
        username,
        email,
        password
      }, {
        withCredentials: true
      });

      Cookies.set("token", response.data.token, {expires: 1});

      const user:User = {
        email: response.data.email,
        username: response.data.username,
        role: "user",
        balance: response.data.balance
      };
      setLoggedUser(user);
      navigate("/");
    }
    catch(error){
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
  
        if (axiosError.response) {
          console.error("Błąd serwera:", axiosError.response.status, axiosError.response.data);
          /*
          {password: 'Hasło musi mieć od 8 do 20 znaków.', username: 'Nazwa użytkownika musi mieć od 3 do 20 znaków.'}
          */
          const errors:any = axiosError.response.data;
          for (const key in errors) {
            console.log(`${key}: ${errors[key]}`);
            //toast.error(errors[key]);
          }
        } else if (axiosError.request) {
          console.error("Brak odpowiedzi od serwera. Sprawdź połączenie.");
        } else {
          console.error("Wystąpił błąd:", axiosError.message);
        }
      } else {
        console.error("Nieoczekiwany błąd:", error);
      }
    }

    setLoading(false);
  }

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string().required("Emailis required"),
    password: Yup.string().required("Password is required"),
  });

  return(
    <Layout>
      <section className="bg-black h-[80vh] flex items-center justify-center">
        <div className="bg-gradient-to-t from-gray-900 to-gray-800 flex flex-col items-center gap-8 shadow-lg rounded-xl p-12">
          <h2 className="text-white font-bold text-2xl">Welcome!</h2>
          <div className="flex">
            <p className="text-white mr-2">You have account?</p>
            <a 
              href="/login"
              className="text-purple-600 hover:text-purple-500 transition-colors duration-300 ease-in-out"  
            >
              Sign in!
            </a>            
          </div>
          <Formik <RegisterRequest>
          initialValues={{ username:'', email: '', password: '' }}
          onSubmit={handleLoginClick}
          validationSchema={validationSchema}
        >
          <Form>
            {
              loading ? 
                <div className="text-white">Loading...</div>
              :
              <div className="flex flex-col gap-1">
              <div className="flex items-center bg-gray-800 rounded-xl px-2 mb-2 w-full">
                <FaRegUser className="mr-2 ml-1 text-white "  />
                <Field
                  name="username"
                  type="text"
                  placeholder="Username"
                  className="bg-gray-800 p-2 border-none outline-none w-full placeholder-white text-white"
                />
              </div>
              <div className="flex items-center bg-gray-800 rounded-xl px-2 mb-2 w-full">
                <FaRegEnvelope className="mr-2 ml-1 text-white "  />
                <Field
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="bg-gray-800 p-2 border-none outline-none w-full placeholder-white text-white"
                />
              </div>
              
              <div className="flex items-center bg-gray-800 rounded-xl px-2 mb-2 w-full">   
                <RiLockPasswordLine className="mr-2 ml-1 text-white"/>
                <Field
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="bg-gray-800 p-2 border-none outline-none w-full placeholder-white text-white"
                />
                
              </div>
              <button
                type="submit"
                className="p-2 bg-purple-900 text-white font-bold rounded-xl hover:bg-purple-500 transition-colors duration-300 ease-in-out"
              >
                Register
              </button>
            </div>
            }
           
          </Form>
        </Formik>
        </div>
      </section>
    </Layout>
  )  
}