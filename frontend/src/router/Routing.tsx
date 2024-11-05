import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";

export const Routing = () => {
  return (
		<Router>
			<Routes>
        <Route path="/" Component={HomePage}/>
        <Route path="/login" Component={LoginPage}/>
      </Routes>
		</Router>
  );
};