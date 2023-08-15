import React, { useState, useRef } from "react";
import { Button, Typography, Box, Input } from "@mui/material";
import image from "./uploadFile.png";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Layout from "./Layout";

import { TransactionExtractionFactory } from "../services/TransactionExtractionFactory";
import TransactionRepository from "../services/Dexie/DbService";

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

  const onUpload = async () => {
    if (selectedFile && selectedBank) {
      try {
        const extractor =
          TransactionExtractionFactory.getExtractor(selectedBank);
        const transactions = await extractor.extractFromXlsvFile(selectedFile);
        const repo = new TransactionRepository();
        repo.bulkInsert(transactions);
        console.log(transactions);
      } catch (error) {
        console.error("Failed to extract transactions:", error);
      }
    } else {
      alert("No file selected or bank not specified");
    }
  };
  const onPurge = async () => {
    const repository = new TransactionRepository();
    await repository.purgeDatabase();
  };

  return (
    <Layout selectedIcon={"add"}>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Typography
          variant="h4"
          style={{ color: "white", marginBottom: "5px" }}
        >
          Upload Transactions
        </Typography>
        <Typography style={{ color: "#B0B0B0", marginBottom: "20px" }}>
          Select your bank and upload the file to process transaction data.
        </Typography>
        <img
          src={image}
          alt="Upload graphic"
          style={{ marginBottom: "5px", height: "300px", width: "300px" }}
        />

        <FormControl sx={{ m: 1, minWidth: 240 }}>
          <InputLabel
            id="demo-simple-select-helper-label"
            style={{ color: "white" }}
          >
            Bank Name
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={selectedBank}
            label="SBI"
            onChange={handleBankChange}
            sx={{ color: "white", marginBottom: "5px" }}
          >
            <MenuItem value={"SBI"}>
              <em>SBI</em>
            </MenuItem>
            <MenuItem value={"ICICI"}>ICICI</MenuItem>
            <MenuItem value={"HDFC"}>HDFC</MenuItem>
            <MenuItem value={"AXIS"}>AXIS</MenuItem>
          </Select>
        </FormControl>
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          style={{ marginBottom: "5px" }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleFileButtonClick}
          >
            Choose File
          </Button>
          {selectedFile && (
            <Typography
              variant="body2"
              style={{ color: "white", marginLeft: 10 }}
            >
              {selectedFile.name}
            </Typography>
          )}
        </Box>
        <Button
          variant="contained"
          color="primary"
          style={{
            width: "calc(100% - 40px)",
            margin: "10px 20px",
          }}
          onClick={onUpload}
        >
          Upload
        </Button>
        <Button
          variant="contained"
          style={{
            width: "calc(100% - 40px)",
            margin: "10px 20px",
            color: "white",
            backgroundColor: "red",
          }}
          onClick={onPurge}
        >
          Purge Data
        </Button>
      </div>
    </Layout>
  );
}
