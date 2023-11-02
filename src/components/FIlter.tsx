import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Collapse,
  useMediaQuery,
  useTheme,
  Input,
  Chip,
  Typography,
  Slider,
} from "@mui/material";
import { ITransactionFilter } from "../services/ITransactionProps";
import { min } from "lodash";
import { DateTime } from "luxon";
import TransactionRepository from "../services/Dexie/DbService";

const Filter: React.FC<{
  maxDate: Date;
  minDate: Date;
  onFilterChange: (filters: ITransactionFilter) => void;
}> = ({ onFilterChange }) => {
  const [filterState, setFilterState] = useState<ITransactionFilter>({
    type: "all",
  });
  const [isFocused, setIsFocused] = useState(false);

  // console.log("inside prop", minDate, maxDate);
  const [animationText, setAnimationText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedDateRange, setSelectedDateRange] = useState({
    min: new Date(),
    max: new Date(),
  });

  const [dateRange, setDateRange] = useState({
    min: new Date(),
    max: new Date(),
  });
  console.log("selected Date range", selectedDateRange);
  const handleDateRangeChange = (start: Date, end: Date) => {
    // handle the date range change in filter state
    handleFilterChange(
      "startDate",
      DateTime.fromJSDate(start).toFormat("dd/MM/yyyy")
    );
    handleFilterChange(
      "endDate",
      DateTime.fromJSDate(end).toFormat("dd/MM/yyyy")
    );
  };

  useEffect(() => {
    const texts = [
      "This is your search bar",
      "Search your swiggy, amazon transactions",
      "Search by payment mode ie UPI, NEFT",
      "Search by Tags",
      "Search by Merchants",
    ];

    let timer; // Declare a variable to hold the timer reference

    if (!isFocused) {
      // Only proceed if search bar isn't focused
      // Start "typing" animation for a specific text
      if (currentIndex < texts[textIndex].length) {
        timer = setTimeout(() => {
          setAnimationText((prev) => prev + texts[textIndex][currentIndex]);
          setCurrentIndex((prev) => prev + 1);
        }, 75);
      } else {
        // When text is fully "typed", wait for a bit, then move to the next text or restart
        timer = setTimeout(() => {
          setAnimationText("");
          setCurrentIndex(0);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }, 1000);
      }
    }

    // This will run when the component re-renders or useEffect is re-invoked
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [animationText, currentIndex, textIndex, isFocused]);

  const handleFilterChange = (field: keyof ITransactionFilter, value: any) => {
    const newFilterState = { ...filterState, [field]: value };
    setFilterState(newFilterState);
    onFilterChange(newFilterState);
  };
  const handleChipClick = (value: string) => {
    handleFilterChange("type", value);
  };

  const transactionRepository = new TransactionRepository();

  console.log(
    "selected",
    selectedDateRange.min.getTime(),
    selectedDateRange.max.getTime()
  );
  useEffect(() => {
    transactionRepository.readTransactions({}).then((loadedTransactions) => {
      setDateRange({
        min: loadedTransactions[loadedTransactions.length - 1]?.date,
        max: loadedTransactions[0].date,
      });
      setSelectedDateRange({
        min: loadedTransactions[loadedTransactions.length - 1]?.date,
        max: loadedTransactions[0].date,
      });
    });
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      maxWidth={500}
      paddingTop="60px"
      margin="auto"
      marginBottom={2}
      marginTop={2}
    >
      {/* Search Bar and Filter Icon */}

      {/* Filter Options (Collapsed) */}

      <Box
        display="flex"
        flexDirection={isSmallScreen ? "column" : "row"}
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        width="100%"
      >
        <Box
          sx={{
            width: 300,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "0 auto",
          }}
        >
          <Typography id="range-slider" gutterBottom>
            Date Range
          </Typography>

          <Slider
            value={[
              selectedDateRange.min.getTime(),
              selectedDateRange.max.getTime(),
            ]}
            onChange={(event, newValue: number[]) => {
              setSelectedDateRange({
                min: new Date(newValue[0]),
                max: new Date(newValue[1]),
              });
              handleDateRangeChange(
                new Date(newValue[0]),
                new Date(newValue[1])
              );
            }}
            valueLabelDisplay="on"
            valueLabelFormat={(value) => new Date(value).toLocaleDateString()}
            min={dateRange.min.getTime()}
            max={dateRange.max.getTime()}
            sx={{ width: "100%" }}
          />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography>
              {selectedDateRange.min.toLocaleDateString()}
            </Typography>
            <Typography>
              {selectedDateRange.max.toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          style={{ margin: "8px", flexWrap: "wrap" }}
        >
          <Chip
            label="All"
            clickable
            color={filterState.type === "all" ? "primary" : "default"}
            onClick={() => handleChipClick("all")}
          />
          <Chip
            label="Income"
            clickable
            color={filterState.type === "income" ? "primary" : "default"}
            onClick={() => handleChipClick("income")}
            style={{ margin: "0 8px" }}
          />
          <Chip
            label="Expense"
            clickable
            color={filterState.type === "expense" ? "primary" : "default"}
            onClick={() => handleChipClick("expense")}
          />
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        marginBottom={2}
      >
        <TextField
          placeholder={animationText}
          onChange={(e) => handleFilterChange("remarks", e.target.value)}
          style={{ flex: 1, minWidth: "100px" }}
          onFocus={() => {
            setAnimationText("");
            setIsFocused(true);
          }} // Set focused state to true on focus
          onBlur={() => {
            // Reset to the first animation text and state on blur
            setIsFocused(false);
            setAnimationText("");
            setCurrentIndex(0);
            setTextIndex(0);
          }}
        />
      </Box>
    </Box>
  );
};

export default Filter;
