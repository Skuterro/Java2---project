import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { CasePage } from "../pages/CasePage";
import { CaseOpeningPage } from "../pages/CaseOpeningPage";

export const Routing = () => {
  return (
	<Router>
		<Routes>
			<Route path="/" Component={HomePage}/>
			<Route path="/login" Component={LoginPage}/>
			<Route path="/register" Component={RegisterPage}/>
			<Route path="/case/:caseId" Component={CasePage}/>
			<Route path="/register" Component={RegisterPage}/>
			<Route path="/caseopening" Component={CaseOpeningPage}/>
	  </Routes>
	</Router>
  );
};