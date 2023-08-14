import React, { useState } from "react";
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
} from "@mui/material";
import FilterIcon from "@mui/icons-material/FilterList";
import { ITransactionFilter } from "../services/ITransactionProps";

const Filter: React.FC<{
  onFilterChange: (filters: ITransactionFilter) => void;
}> = ({ onFilterChange }) => {
  const [filterState, setFilterState] = useState<ITransactionFilter>({
    type: "all",
  });
  const [showFilters, setShowFilters] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleFilterChange = (
    field: keyof ITransactionFilter,
    value: any
  ) => {
    const newFilterState = { ...filterState, [field]: value };
    setFilterState(newFilterState);
    onFilterChange(newFilterState);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      maxWidth={500}
      margin="auto"
      marginBottom={2}
      marginTop={2}
    >
      {/* Search Bar and Filter Icon */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
      >
        <TextField
          label="Search"
          onChange={(e) => handleFilterChange("remarks", e.target.value)}
          style={{ flex: 1, minWidth: "100px" }}
        />
        <IconButton onClick={() => setShowFilters(!showFilters)}>
          <FilterIcon />
        </IconButton>
      </Box>

      {/* Filter Options (Collapsed) */}
      <Collapse in={showFilters}>
        <Box
          display="flex"
          flexDirection={isSmallScreen ? "column" : "row"}
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          width="100%"
        >
          <FormControl
            style={{ margin: "8px" }} // Added margin
          >
            <InputLabel shrink htmlFor="startDate">
              Start Date
            </InputLabel>
            <Input
              type="date"
              id="startDate"
              value={filterState.startDate || ""}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
            />
          </FormControl>

          {/* End Date Filter */}
          <FormControl
            style={{ margin: "8px" }} // Added margin
          >
            <InputLabel shrink htmlFor="endDate">
              End Date
            </InputLabel>
            <Input
              type="date"
              id="endDate"
              value={filterState.endDate || ""}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
            />
          </FormControl>

          {/* Category Filter */}
          <TextField
            style={{ margin: "8px" }} // Added margin
            label="Category"
            value={filterState.category || ""}
            onChange={(e) => handleFilterChange("category", e.target.value)}
          />

          {/* Type Filter */}
          <FormControl
            style={{ margin: "8px" }} // Added margin
          >
            <InputLabel>Type</InputLabel>
            <Select
              value={filterState.type || "all"}
              onChange={(e) => handleFilterChange("type", e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </Select>
          </FormControl>

          {/* Apply Filters Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => onFilterChange(filterState)}
            style={{ margin: "8px" }} // Added margin
          >
            Apply Filters
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
};

export default Filter;
