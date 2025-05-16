import React from "react";

import { BrowserRouter as Router } from "react-router-dom";

import "./App.css";

import Layout from "./Layout/Layout";
import AllRoutes from "./Routes/Routes";
import { GoogleOAuthProvider } from "@react-oauth/google";

const googleOAuthClientID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;

const App = () => {
  return (
    <div className="App">
      <GoogleOAuthProvider clientId={googleOAuthClientID}>
        <Router>
          <Layout>
            <AllRoutes />
          </Layout>
        </Router>
      </GoogleOAuthProvider>
    </div>
  );
};

export default App;