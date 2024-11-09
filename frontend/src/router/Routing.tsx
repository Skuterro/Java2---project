import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { RegistePage } from "../pages/RegisterPage";

export const Routing = () => {
  return (
		<Router>
			<Routes>
        <Route path="/" Component={HomePage}/>
        <Route path="/login" Component={LoginPage}/>
        <Route path="/register" Component={RegistePage}/>
      </Routes>
		</Router>
  );
};