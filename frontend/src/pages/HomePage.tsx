import { useEffect } from "react";
import { Layout } from "../components/layout/Layout";
import { useAuth } from "../providers/AuthProvider";

export const HomePage = () => {
  const { loggedUser } = useAuth();

  useEffect(() => {
    if(loggedUser == undefined){
      
    }
    console.log("User:", loggedUser);    
  }, []);

  return(
    <Layout>
      <section className="bg-black h-[80vh]">

      </section>
    </Layout>
  );
};