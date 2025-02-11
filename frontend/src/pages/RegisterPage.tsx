import { Layout } from "../components/layout/Layout";
import { Field, Form, Formik } from "formik";
import { FaRegEnvelope, FaRegUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import axios, { AxiosError } from "axios";
import { useAuth } from "../providers/AuthProvider";
import * as Yup from "yup";
import { RegisterRequest, RegisterResponse } from "../models/apiTypes";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const RegisterPage = () => {
  const { loggedUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (loggedUser && loggedUser.authenticated) {
      navigate("/");
    }
  }, [loggedUser]);

  const handleRegister = async ({ email, password, username }: RegisterRequest) => {
    try {
      setLoading(true);
      await axios.post<RegisterResponse>(
        import.meta.env.VITE_REGISTER_API_URL,
        { username, email, password },
        { withCredentials: true }
      );

      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        if (axiosError.response) {
          console.error("Server error:", axiosError.response.status, axiosError.response.data);

          const errors: any = axiosError.response.data;
          for (const key in errors) {
            console.log(`${key}: ${errors[key]}`);
          }
        } else if (axiosError.request) {
          console.error("No response from server.");
        } else {
          console.error("Unexpected error:", axiosError.message);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }

    setLoading(false);
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required(t("validation.usernameRequired")),
    email: Yup.string().required(t("validation.emailRequired")),
    password: Yup.string().required(t("validation.passwordRequired")),
  });

  return (
    <Layout>
      <section className="bg-black h-[80vh] flex items-center justify-center">
        <div className="bg-gradient-to-t from-gray-900 to-gray-800 flex flex-col items-center gap-8 shadow-lg rounded-xl p-14">
          <h2 className="text-white font-bold text-2xl">{t("register.welcome")}</h2>
          <div className="flex">
            <p className="text-white mr-2">{t("register.haveAccount")}</p>
            <a
              href="/login"
              className="text-purple-600 hover:text-purple-500 transition-colors duration-300 ease-in-out"
            >
              {t("register.signIn")}
            </a>
          </div>
          <Formik<RegisterRequest>
            initialValues={{ username: "", email: "", password: "" }}
            onSubmit={handleRegister}
            validationSchema={validationSchema}
          >
            <Form>
              {loading ? (
                <div className="text-white">{t("register.loading")}</div>
              ) : (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center bg-gray-800 rounded-xl px-2 mb-2 w-full">
                    <FaRegUser className="mr-2 ml-1 text-white" />
                    <Field
                      name="username"
                      type="text"
                      placeholder={t("register.username")}
                      className="bg-gray-800 p-2 border-none outline-none w-full placeholder-white text-white"
                    />
                  </div>
                  <div className="flex items-center bg-gray-800 rounded-xl px-2 mb-2 w-full">
                    <FaRegEnvelope className="mr-2 ml-1 text-white" />
                    <Field
                      name="email"
                      type="email"
                      placeholder={t("register.email")}
                      className="bg-gray-800 p-2 border-none outline-none w-full placeholder-white text-white"
                    />
                  </div>

                  <div className="flex items-center bg-gray-800 rounded-xl px-2 mb-2 w-full">
                    <RiLockPasswordLine className="mr-2 ml-1 text-white" />
                    <Field
                      name="password"
                      type="password"
                      placeholder={t("register.password")}
                      className="bg-gray-800 p-2 border-none outline-none w-full placeholder-white text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="p-2 bg-purple-900 text-white border-2 border-purple-500 font-bold rounded-xl hover:bg-purple-500 transition-colors duration-300 ease-in-out"
                  >
                    {t("register.button")}
                  </button>
                </div>
              )}
            </Form>
          </Formik>
        </div>
      </section>
    </Layout>
  );
};
