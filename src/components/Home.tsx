import React from "react";
import { BottomNavigation, BottomNavigationAction, Card } from "@mui/material";
import {
  Restore,
  Favorite,
  LocationOn,
  Home as HomeIcon,
} from "@mui/icons-material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import BasicTabs from "./TabPanel";
import Graph from "./Graph";
import Graph2 from "./Graph2";

export default function Home() {
  return (
    <div
      style={{
        height: "100vh",
        overflowY: "scroll",
      }}
    >
      <style>
        {`
          ::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TRAKK
          </Typography>
        </Toolbar>
      </AppBar>

      <Card
        variant="outlined"
        style={{
          width: "400px",
          height: "200px",
          backgroundColor: "#f0f0f0",
          color: "black",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <span>account balance</span>
        <span style={{ fontWeight: 700, fontSize: "32px" }}>USD 100000.00</span>
        <span>available balance</span>
        <span style={{ fontWeight: 700, fontSize: "32px" }}>USD 80000.00</span>
      </Card>

      <BasicTabs />

      <h2>Expense Overview</h2>
      <Graph />
      <Graph2 />
      <BottomNavigation
        showLabels
        style={{ position: "fixed", width: "100%", bottom: 0 }}
        value={"recents"}
      >
        <BottomNavigationAction
          label="Recents"
          value="recents"
          icon={<HomeIcon />}
        />
        <BottomNavigationAction label="Favorites" icon={<Favorite />} />
        <BottomNavigationAction label="Nearby" icon={<LocationOn />} />
      </BottomNavigation>
    </div>
  );
}
