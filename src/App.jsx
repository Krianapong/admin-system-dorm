import React from "react";
import "./App.css";
import SideBar from "./layout/SideBar";
import SignIn from "./page/Sign_In";
import Dashboard from "./page/admin/dashboard/Dashboard";
import Calender from "./page/admin/calendar/Calender";
import Personnel from "./page/admin/personnel/Personnel";
// import Water from "./page/admin/water/Water";
// import Electricity from "./page/admin/electricity/Electricity";
import Detail from "./page/admin/detail/Detail";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import News from "./page/admin/news/New";
import Room from "./page/admin/room/Room";

function App() {
  return (
    <>
      <Router>
        <SideBar />
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/news" element={<News />} />
          <Route path="/calender" element={<Calender />} />
          <Route path="/personnel" element={<Personnel />} />
          <Route path="/detail" element={<Detail />} />
          <Route path="/rooms" element={<Room />} />
          {/* <Route path="/water" element={<Water />} /> */}
          {/* <Route path="/electricity" element={<Electricity />} /> */}

        </Routes>
      </Router>
    </>
  );
}

export default App;
