import React, { useState } from "react";
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
} from "react-pro-sidebar";
import { Box, IconButton, Typography } from "@mui/material";
import { Link } from "react-router-dom";

//css
import '../index.css';

//icon 
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import PieChartRoundedIcon from '@mui/icons-material/PieChartRounded';
import HomeRepairServiceRoundedIcon from '@mui/icons-material/HomeRepairServiceRounded';
import BuildRoundedIcon from '@mui/icons-material/BuildRounded';
import CleaningServicesRoundedIcon from '@mui/icons-material/CleaningServicesRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import VillaRoundedIcon from '@mui/icons-material/VillaRounded';
import SummarizeRoundedIcon from '@mui/icons-material/SummarizeRounded';
import EqualizerSharpIcon from '@mui/icons-material/EqualizerSharp';
import GasMeterSharpIcon from '@mui/icons-material/GasMeterSharp';
import ElectricMeterSharpIcon from '@mui/icons-material/ElectricMeterSharp';
import MoveToInboxOutlinedIcon from '@mui/icons-material/MoveToInboxOutlined';
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';
import FeedIcon from '@mui/icons-material/Feed';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

const SideBar = () => {
  const [isCollapsed, setisCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [broken, setBroken] = useState(false);

  return (
    <div className="main-sidebar">
      <Sidebar
        collapsed={isCollapsed}
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
        onBreakPoint={setBroken}
        breakPoint="md"
        className="sidebar"
      >
        <div className="sidebar-main">
          <div className="sidebar-main-a">
            <Menu iconShape="square">
              {/* LOGO */}
              <MenuItem onClick={() => setisCollapsed(!isCollapsed)} icon={isCollapsed ? <FormatListBulletedIcon /> : undefined} className="sidebar-icon">
                {!isCollapsed && (
                  <Box className="sidebar-box">
                    <Typography>Dorm Web</Typography>
                    <IconButton onClick={() => setisCollapsed(!isCollapsed)}>
                      <FormatListBulletedIcon />
                    </IconButton>
                  </Box>
                )}
              </MenuItem>

              <Link to="/dashboard" className="menu-bars">
                <MenuItem icon={<PieChartRoundedIcon />}>
                  Dashboard
                </MenuItem>
              </Link>

              <SubMenu icon={<HomeRepairServiceRoundedIcon />} label="บริการต่างๆ">

                <Link to={"/repair"} className="menu-bars">
                  <MenuItem icon={<BuildRoundedIcon />}>
                    {" "}
                    เเจ้งซ่อม
                  </MenuItem>
                </Link>
                <Link to={"/clean"} className="menu-bars">
                  <MenuItem icon={<CleaningServicesRoundedIcon />}>
                    {" "}
                    ทำความสะอาด
                  </MenuItem>
                </Link>

                <Link to={"/security"} className="menu-bars">
                  <MenuItem icon={<AdminPanelSettingsRoundedIcon />}>
                    {" "}
                    รักษาความปลอดภัย
                  </MenuItem>
                </Link>

              </SubMenu>

              <Link to={"/room"} className="menu-bars">
                <MenuItem icon={<VillaRoundedIcon />}>ผังห้องพัก</MenuItem>
              </Link>

              <Link to={"/detail"} className="menu-bars">
                <MenuItem icon={<SummarizeRoundedIcon />}>รายละเอียดผู้เช่า</MenuItem>
              </Link>

              <SubMenu icon={<EqualizerSharpIcon />} label="จดมิเตอร์">

                <Link to={"/water"} className="menu-bars">
                  <MenuItem icon={<GasMeterSharpIcon />}>
                    {" "}
                    ค่าน้ำ
                  </MenuItem>
                </Link>

                <Link to={"/electricity"} className="menu-bars">
                  <MenuItem icon={<ElectricMeterSharpIcon />}>
                    {" "}
                    ค่าไฟฟ้า
                  </MenuItem>
                </Link>

              </SubMenu>

              <Link to={"/notifybill"} className="menu-bars">
                <MenuItem icon={<MoveToInboxOutlinedIcon />}>
                  แจ้งบิล
                </MenuItem>
              </Link>

              <Link to="/paybill" className="menu-bars">
                <MenuItem icon={<CurrencyExchangeOutlinedIcon />}>
                  จ่ายบิล
                </MenuItem>
              </Link>

              <Link to={"/news"} className="menu-bars">
                <MenuItem icon={<FeedIcon />}>
                  บอร์ดข่าวสาร
                </MenuItem>
              </Link>

              <Link to="/calendar" className="menu-bars">
                <MenuItem icon={<CalendarMonthIcon />}>
                  ปฏิทินหอพัก
                </MenuItem>
              </Link>

              <Link to="/personnel" className="menu-bars">
                <MenuItem icon={<AccountCircleRoundedIcon />}>
                  บุคลากร
                </MenuItem>
              </Link>

            </Menu>
          </div>
        </div>
      </Sidebar>
      <main>
        <div style={{ padding: "16px 2px ", color: "#44596e" }}>
          <div style={{ marginBottom: "16px" }}>
            {broken && (
              <IconButton onClick={() => setToggled(!toggled)}>
                <FormatListBulletedIcon />
              </IconButton>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
export default SideBar;