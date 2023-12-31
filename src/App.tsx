import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Home from "./components/Home";
import { Container } from "@mui/material";
import UploadFile from "./components/UploadFile";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Search from "./components/Search";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "rgb(161, 163, 247)" },
  },
  typography: {
    fontFamily: "Inter, sans-serif", // Specify the "Inter" font here
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div>
        <Container style={{ padding: "0px" }}>
          <Router>
            <Routes>
              <Route path="/" Component={Home} />
              <Route path="/home" Component={Home} />
              <Route path="/upload" Component={UploadFile} />
              <Route path="/search" Component={Search} />
            </Routes>
          </Router>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;

// function App() {
//   return (
//     <ThemeProvider theme={darkTheme}>
//       <CssBaseline />
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//           width: "100vw",
//         }}
//       >
//         <Container maxWidth="md">
//           <Router>
//             <Routes>
//               <Route path="/home" component={Home} />
//               <Route path="/intro" component={LandingPage} />
//               <Route path="/upload-file" component={UploadFile} />
//             </Routes>
//           </Router>
//         </Container>
//       </div>
//     </ThemeProvider>
//   );
// }
