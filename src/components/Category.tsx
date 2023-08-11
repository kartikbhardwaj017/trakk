import React from "react";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import FlightIcon from "@mui/icons-material/Flight";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import MovieIcon from "@mui/icons-material/Movie";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import TrainIcon from "@mui/icons-material/Train";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SendIcon from "@mui/icons-material/Send";

// ... add more imports as needed

const categoryIcons = {
  groceries: <LocalGroceryStoreIcon />,
  travel: <FlightIcon />,
  food: <RestaurantIcon />,
  entertainment: <MovieIcon />,
  shopping: <ShoppingCartIcon />,
  utilities: <FlashOnIcon />,
  health: <LocalHospitalIcon />,
  transport: <TrainIcon />,
  send: <SendIcon />,
  other: <MoreHorizIcon />, // Added "Other" category
  // ... add more categories as needed
};

export const getCategoryIcon = (category) => {
  return categoryIcons[category] || <MoreHorizIcon />; // Returns the "Other" icon if the category is not found
};
