import React, { createContext, useReducer } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
// import Formheader from "./components/Formheader";
// import Header from "./components/Header";
import SubmitForm from "./components/SubmitForm";
import CenteredTabs from "./components/Tabs";
import Templates from "./components/Templates";
import User_form from "./components/user_form";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Navbar from "./components/Navbar";
import Logout from "./components/Logout";
import { initialState, reducer } from "./reducer/userReducer";
import Quiz from "./components/Quiz";
import QuizWithAI from "./components/QuizWithAI";

export const UserContext = createContext();

const Routing = () => {
  return (
    <div className="app">
      <Router>
        <Routes>

          <Route exact path="/" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/user_form" element={<User_form />} />
          <Route exact path="/submitted" element={<SubmitForm />} />
          <Route exact path="/logout" element={<Logout />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/form/:id" element={<CenteredTabs />} />
          <Route exact path="/quiz" element={<Quiz />} />
          <Route exact path="/quizai" element={<QuizWithAI />} />

          <Route exact path="/temp" element={<Templates />} />
        </Routes>
      </Router>
    </div>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <UserContext.Provider value={{ state, dispatch }}>
        <Navbar />
        <Routing />
      </UserContext.Provider>
    </>
  );
};

export default App;