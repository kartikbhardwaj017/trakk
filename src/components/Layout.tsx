import { useNavigate } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Home as HomeIcon, UploadFile, People } from "@mui/icons-material";

export default function Layout({ children, selectedIcon }) {
  const navigate = useNavigate();

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
        style={{ width: "100%", margin: "auto", zIndex: "100" }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TRAKK
          </Typography>
        </Toolbar>
      </AppBar>
      {children}

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
          label="Community"
          value="Community"
          icon={<People />}
          onClick={() => navigate("/community")}
        />
      </BottomNavigation>
    </div>
  );
}
