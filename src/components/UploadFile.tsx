import React, { useState, useRef, useEffect } from "react";
import { Button, Typography, Box, Input, Alert, Link } from "@mui/material";
import image from "./EmptyTransaction2.svg";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Layout from "./Layout";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";

import { TransactionExtractionFactory } from "../services/TransactionExtractionFactory";
import TransactionRepository from "../services/Dexie/DbService";

export default function LandingPage() {
  const [selectedBank, setSelectedBank] = useState("");
  const [runTour, setRunTour] = useState(false);

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
        repo.insertUnique(transactions);
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

  const steps: Step[] = [
    {
      target: ".bank-select",
      content: "First, select your bank from this dropdown.",
      placement: "bottom",
    },
    {
      target: ".file-choose-button",
      content: "Click here to choose the file from your system.",
      placement: "bottom",
    },
    {
      target: ".upload-button",
      content: "After selecting the file, click here to upload it.",
      placement: "bottom",
    },
    {
      target: ".purge-button",
      content: "Use this button to clear all data from the database.",
      placement: "bottom",
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    //@ts-ignore
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false);
      localStorage.setItem("tourCompleted", "true");
    }
  };

  useEffect(() => {
    // Check if the tour has already been completed
    const tourCompleted = localStorage.getItem("tourCompleted") === "true";
    if (!tourCompleted) {
      // If not, start the tour
      setRunTour(true);
    }
  }, []);
  return (
    <Layout selectedIcon={"add"}>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
          justifyContent: "center",
          justifyItems: "center",
        }}
      >
        <Typography
          variant="h4"
          style={{ color: "white", marginBottom: "5px", paddingTop: "60px" }}
          fontWeight="700"
        >
          Upload Transactions
        </Typography>

        <img
          src={image}
          alt="Upload graphic"
          style={{ marginBottom: "5px", height: "300px", width: "300px" }}
        />
        <Typography style={{ color: "#B0B0B0", marginBottom: "20px" }}>
          Select your bank and upload the file to process transaction data.
        </Typography>

        <FormControl sx={{ m: 1, minWidth: 240 }} className="bank-select">
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
          <Alert style={{ color: "white" }} severity="info">
            <Link
              style={{ color: "white" }}
              href="https://heliotrope-patch-6dc.notion.site/Trakk-Uploading-Bank-statements-5654aad42d384225b2775ae7d915aa6d"
              target="_blank"
              rel="noopener noreferrer"
            >
              Which file to upload?
            </Link>
          </Alert>
        </FormControl>

        <Box
          flexDirection="column"
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
            style={{ backgroundColor: "white" }}
            onClick={handleFileButtonClick}
            className="file-choose-button"
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
          style={{
            width: "calc(100% - 40px)",
            margin: "10px 20px",
            backgroundColor: "white",
          }}
          onClick={onUpload}
          className="upload-button"
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
          className="purge-button"
        >
          Purge Data
        </Button>
      </div>
      <div style={{ height: "60px" }}></div>
      <Joyride
        continuous
        run={runTour}
        steps={steps}
        callback={handleJoyrideCallback}
        showSkipButton
        styles={{
          options: {
            arrowColor: "rgb(99, 102, 241)",
            primaryColor: "rgb(99, 102, 241)",
            spotlightShadow: "0 0 15px rgba(125, 233, 155, 1)", // Example: blue shadow with some blur
            zIndex: 10000,
          },
        }}
      />
    </Layout>
  );
}
