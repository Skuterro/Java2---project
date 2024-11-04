import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { HomePage } from "../pages/HomePage";

export const Routing = () => {
  return (
		<Router>
			<Routes>
        <Route path="/" Component={HomePage}/>
			</Routes>
		</Router>
  );
};