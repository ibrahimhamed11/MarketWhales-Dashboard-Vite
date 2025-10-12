import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography, MenuItem, Grid } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { addCashbackMony } from 'utils/cashback/cashback';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Toast, { showToast } from "../../../../components/shared/toast"; // Importing showToast function


const CashbackModal = ({ open, onClose, accountId, fetchData }) => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [cashamount, setAmount] = useState('');
  const [status, setStatus] = useState('unpaid');

  const handleAddCashback = async (cashbackData) => {
    try {
      await addCashbackMony(accountId, cashbackData);
      fetchData(); 
      onClose();
    } catch (error) {
      console.error("Error adding cashback:", error);
    }
  };

  const handleSubmit = async () => {
    if (fromDate && toDate && cashamount) {
      const profitData = {
        fromDate: dayjs(fromDate).format("YYYY-MM-DD"),
        toDate: dayjs(toDate).format("YYYY-MM-DD"),
        cashamount: parseFloat(cashamount),
        status: status,
      };

      await handleAddCashback(profitData);

      showToast("تم اضافة الكاش باك للعميل بنجاح  ", "success");
      fetchData(); 

    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          bgcolor: 'background.paper',
          borderRadius: 3,
          maxWidth: 500,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: 24,
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Add Cashback
        </Typography>

        <Grid container spacing={2} direction="column">
          {/* From Date Picker */}
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="From Date"
                value={fromDate}
                onChange={(newValue) => setFromDate(newValue)}
                renderInput={(params) => (
                  <TextField {...params} fullWidth />
                )}
              />
            </LocalizationProvider>
          </Grid>

          {/* To Date Picker */}
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="To Date"
                value={toDate}
                onChange={(newValue) => setToDate(newValue)}
                renderInput={(params) => (
                  <TextField {...params} fullWidth />
                )}
              />
            </LocalizationProvider>
          </Grid>

          {/* Amount Input */}
          <Grid item xs={12}>
            <TextField
              label="Amount"
              type="number"
              value={cashamount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
            />
          </Grid>

          {/* Status Dropdown */}
          <Grid item xs={12}>
            <TextField
              label="Status"
              select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              fullWidth
            >
              <MenuItem value="unpaid">Unpaid</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
            </TextField>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              onClick={handleSubmit}
              fullWidth


              color="secondary"
              variant="contained"
              sx={{ textTransform: "none" }}
            >
              Add Cashback
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default CashbackModal;
