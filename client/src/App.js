import React from "react";
import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/home/home";
import Login from "./pages/login/login";
import SignInForm from "./pages/misc/SignInForm";
import SignUpForm from "./pages/misc/SignUpForm";
import PublicProfile from "./pages/public/Profile";
import Sell from "./pages/public/Sell"
import PublicLogin from "./pages/public/PublicLogin";

import BuyersLogin from "./pages/buyers/BuyersLogin";
import BuyersProfile from "./pages/buyers/BuyersProfile";

import CenterLogin from "./pages/centers/CenterLogin";
import CenterProfile from "./pages/centers/CenterProfile";

//import Signup from "./pages/Signup";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/misc/signin" element={<SignInForm />}></Route>
          <Route path="/misc/signup" element={<SignUpForm />}></Route>
          
          <Route path="/public/login" element={<PublicLogin />}></Route>
          <Route path="/public/profile" element={<PublicProfile />}></Route>
          <Route path="/public/sell" element={<Sell />}></Route>

          <Route path="/buyers/login" element={<BuyersLogin />}></Route>
          <Route path="/buyers/profile" element={<PublicProfile />}></Route>
          <Route path="/buyers/sell" element={<Sell />}></Route>

          <Route path="/center/login" element={<CenterLogin />}></Route>
          <Route path="/center/profile" element={<CenterProfile />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;