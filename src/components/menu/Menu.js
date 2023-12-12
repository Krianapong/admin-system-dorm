import React from 'react';
import { Link } from 'react-router-dom';
import "./Menu.css";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import AirlineSeatIndividualSuiteIcon from '@mui/icons-material/AirlineSeatIndividualSuite';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PieChartIcon from '@mui/icons-material/PieChart';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import ElectricMeterIcon from '@mui/icons-material/ElectricMeter';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const menuItems = [
  { text: 'Dashboard', icon: <PieChartIcon />, path: '/' },
  {
    text: 'บริการต่างๆ', icon: <AccountCircleIcon />,
    subitems: [
      { text: 'เเจ้งซ่อม', icon: <HomeRepairServiceIcon />, path: '/repair' },
      { text: 'ทำความสะอาด', icon: <CleaningServicesIcon />, path: '/clean' },
      { text: 'รักษาความปลอดภัย', icon: <PrivacyTipIcon />, path: '/security' },
    ]
  },
  { text: 'ผังห้องพัก', icon: <AirlineSeatIndividualSuiteIcon />, path: '/room' },
  { text: 'รายละเอียดผู้เช่า', icon: <AssignmentIcon />, path: '/detail' },
  {
    text: 'จดมิเตอร์', icon: <StackedLineChartIcon />,
    subitems: [
      { text: 'ค่าไฟ', icon: <ElectricMeterIcon />, path: '/electricity' },
      { text: 'ค่าน้ำ', icon: <AccountCircleIcon />, path: '/water' },
    ]
  },
  { text: 'แจ้งบิล', icon: <RequestQuoteIcon />, path: '/notifybill' },
  { text: 'จ่ายบิล', icon: <ShoppingCartIcon />, path: '/paybill' },
  { text: 'บอร์ดข่าวสาร', icon: <NewspaperIcon />, path: '/new' },
  { text: 'ปฏิทินหอพัก', icon: <CalendarMonthIcon />, path: '/calendar' },
  { text: 'บุคลากร', icon: <AccountCircleIcon />, path: '/personnel' },
];

const Menu = () => {
  const [openSubMenuIndex, setOpenSubMenuIndex] = React.useState(-1);
  const [selectedMenuIndex, setSelectedMenuIndex] = React.useState(-1);
  const handleSubMenuClick = (index) => {
    setOpenSubMenuIndex(openSubMenuIndex === index ? -1 : index);
    setSelectedMenuIndex(index);
  }

  return (
    <Drawer variant="permanent" sx={{ width: 250, flexShrink: 0 }}>
      <header className="menu-header">
        <h1>HoPak</h1>
      </header>
      <List>
        {menuItems.map((item, index) => (
          <div key={item.text}>
            {item.subitems ? (
              <>
                <ListItem button onClick={() => handleSubMenuClick(index)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
                <Collapse in={openSubMenuIndex === index} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subitems.map((subitem) => (
                      <ListItem
                        button
                        component={Link}
                        to={subitem.path}
                        key={subitem.text}
                      >
                        <ListItemIcon>{subitem.icon}</ListItemIcon>
                        <ListItemText primary={subitem.text} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItem
                button
                component={Link}
                to={item.path}
                key={item.text}
                selected={selectedMenuIndex === index} 
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            )}
          </div>
        ))}
      </List>
    </Drawer>
  );
};

export default Menu;
