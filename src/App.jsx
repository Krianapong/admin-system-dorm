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
} from "react-router-dom";
import News from "./page/admin/news/New";
import Room from "./page/admin/room/Room";
import Paybill from "./page/admin/paybill/Paybill";
import Notifybill from "./page/admin/notifybill/Notifybill";
import Water from "./page/admin/water/Water";
import Electricity from "./page/admin/electricity/Electricity";
import { Box, CssBaseline } from "@mui/material";
import HeaderBar from "./layout/HeaderBar";

function App() {
  return (
    <>
      <div
        className="app"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CssBaseline />
        <Router>
          <SideBar />
          <main className="content">
            <HeaderBar />
            
            <div className="content_body">
              <Box m="20px">
                <Routes>
                  <Route path="/" element={<SignIn />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/calendar" element={<Calender />} />
                  <Route path="/personnel" element={<Personnel />} />
                  <Route path="/detail" element={<Detail />} />
                  <Route path="/rooms" element={<Room />} />
                  <Route path="/water" element={<Water />} />
                  <Route path="/electricity" element={<Electricity />} />
                  <Route path="/paybill" element={<Paybill />} />
                  <Route path="/notifybill" element={<Notifybill />} />
                </Routes>
              </Box>
            </div>
          </main>
        </Router>
      </div>
    </>
  );
}

export default App;
