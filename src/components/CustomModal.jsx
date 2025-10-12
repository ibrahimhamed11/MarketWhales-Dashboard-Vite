import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, IconButton, Typography } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

const CustomModal = ({ isOpen, onClose, title, children }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: {
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: "1.25rem",
          color: "#333",
          borderBottom: "1px solid #ddd",
          paddingBottom: "10px",
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent
        sx={{
          paddingTop: "10px",
          color: "#555",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {children}
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "flex-end",
          padding: "10px 20px",
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          color="error"
          startIcon={<CancelIcon />}
          sx={{
            padding: "8px 20px",
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            backgroundColor: "#f44336",
            '&:hover': {
              backgroundColor: "#d32f2f",
            }
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomModal;
