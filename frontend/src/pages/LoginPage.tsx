import { Layout } from "../components/layout/Layout";
import { Field, Form, Formik, ErrorMessage } from "formik";
import { FaRegEnvelope } from "react-icons/fa";
import { GiPadlock } from "react-icons/gi";
import axios from "axios";
import { useAuth } from "../providers/AuthProvider";
import * as Yup from "yup";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

interface LoginUserForm {
  username: string;
  password: string;
}

export const LoginPage = () => {
  const { loggedUser, setLoggedUser, loadUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (loggedUser != undefined && loggedUser.authenticated == true) {
      navigate("/");
    }
  }, [loggedUser]);

  const handleLoginClick = async ({ username, password }: LoginUserForm) => {
    console.log(import.meta.env.VITE_CASES_API_LOGIN, username, password);
    await axios
      .post(
        import.meta.env.VITE_CASES_API_LOGIN,
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        Cookies.set("token", response.data.token);
        loadUser();
        navigate("/");
      })
      .catch((error) => {
        console.error(t("login.serverError"), error.response.data.message);
      });
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required(t("validation.usernameRequired")),
    password: Yup.string().required(t("validation.passwordRequired")),
  });

  return (
    <Layout>
      <section className="bg-black h-[80vh] flex items-center justify-center">
        <div className="bg-gradient-to-t from-gray-900 to-gray-800 flex flex-col items-center gap-8 shadow-lg rounded-xl p-12">
          <h2 className="text-white font-bold text-2xl">{t("login.welcome")}</h2>
          <div className="flex">
            <p className="text-white mr-2">{t("login.noAccount")}</p>
            <a
              href="/register"
              className="text-purple-600 hover:text-purple-500 transition-colors duration-300 ease-in-out"
            >
              {t("login.signUp")}
            </a>
          </div>
          <Formik
            initialValues={{ username: "", password: "" }}
            onSubmit={handleLoginClick}
            validationSchema={validationSchema}
          >
            <Form>
              <div className="flex flex-col gap-1">
                <div className="flex items-center bg-gray-800 rounded-xl px-2 mb-2 w-full">
                  <FaRegEnvelope className="mr-2 ml-1 text-white " />
                  <Field
                    name="username"
                    type="username"
                    placeholder={t("login.username")}
                    className="bg-gray-800 p-2 border-none outline-none w-full placeholder-white text-white"
                  />
                </div>
                <div className="flex items-center bg-gray-800 rounded-xl px-2 mb-2 w-full">
                  <GiPadlock className="mr-2 ml-1 text-white" />
                  <Field
                    name="password"
                    type="password"
                    placeholder={t("login.password")}
                    className="bg-gray-800 p-2 border-none outline-none w-full placeholder-white text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="p-2 bg-purple-900 border-2 border-purple-500 text-white font-bold rounded-xl hover:bg-purple-500 transition-colors duration-300 ease-in-out"
                >
                  {t("login.button")}
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </section>
    </Layout>
  );
};