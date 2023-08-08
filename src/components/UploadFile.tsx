import React, { useState, useRef } from "react";
import { Button, Typography, Box, Input } from "@mui/material";
import { Image } from "@mui/icons-material";
import image from "./uploadFile.png";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

export default function LandingPage() {
  const [selectedBank, setSelectedBank] = useState("");

  const handleBankChange = (event: SelectChangeEvent) => {
    setSelectedBank(event.target.value as string);
  };
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
  };
  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h3">File Processor</Typography>
      <Typography>Upload your file to extract transaction data</Typography>
      <img src={image} alt="Graphic  " />

      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-helper-label">Bank Name</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={selectedBank}
          label="SBI"
          onChange={handleBankChange}
          sx={{ color: "white" }}
        >
          <MenuItem value={15}>
            <em>SBI</em>
          </MenuItem>
          <MenuItem value={10}>ICICI</MenuItem>
          <MenuItem value={20}>HDFC</MenuItem>
          <MenuItem value={30}>AXIS</MenuItem>
        </Select>
        <FormHelperText>Choose Bank name </FormHelperText>
      </FormControl>
      <Box display="flex" alignItems="center" gap={2}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }} // Hide the default file input
        />{" "}
        {/* Styled file picker button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleFileButtonClick}
        >
          Choose File
        </Button>
        {selectedFile && (
          <span style={{ marginLeft: 10 }}>{selectedFile.name}</span>
        )}
      </Box>
      <Button
        variant="contained"
        style={{
          width: "calc(100% - 20px)",
          margin: "10px",
        }}
      >
        Upload
      </Button>
    </div>
  );
}
