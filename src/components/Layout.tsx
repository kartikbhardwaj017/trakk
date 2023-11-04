import { useNavigate } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {
  Home as HomeIcon,
  UploadFile,
  People,
  Search,
} from "@mui/icons-material";
import { TrakkLogo } from "../assets/TrakkLogo";
import { useState, useEffect } from "react";
import OnlyMobile from "./OnlyMobile";

export default function Layout({ children, selectedIcon }) {
  const navigate = useNavigate();
  const [width, setWidth] = useState<number>(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;

  return (
    <div
      style={{
        height: "100vh",
        overflowY: "scroll",
        overflowX: "hidden",
        width: "100%",
      }}
    >
      <style>
        {`
          ::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <AppBar
        position="fixed"
        style={{
          width: "100%",
          margin: "auto",
          zIndex: "100",
          fontFamily: "inter",
        }}
      >
        <Toolbar style={{ backgroundColor: "#121212" }}>
          <div style={{ marginRight: "5px" }}>
            <TrakkLogo />
          </div>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 700 }}
          >
            Trakk
          </Typography>
        </Toolbar>
      </AppBar>
      {isMobile ? children : <OnlyMobile />}

      <BottomNavigation
        showLabels
        style={{
          height: "60px",
          position: "fixed",
          width: "100%",
          bottom: 0,
          left: 0,
          right: 0,
          margin: 0,
          padding: 0,
        }}
        value={selectedIcon}
      >
        <BottomNavigationAction
          label="Home"
          value="Home"
          icon={<HomeIcon />}
          onClick={() => navigate("/home")}
        />
        <BottomNavigationAction
          label="add"
          value="add"
          icon={<UploadFile />}
          onClick={() => navigate("/upload")}
        />
        <BottomNavigationAction
          label="Search"
          value="Search"
          icon={<Search />}
          onClick={() => navigate("/search")}
        />
      </BottomNavigation>
    </div>
  );
}
