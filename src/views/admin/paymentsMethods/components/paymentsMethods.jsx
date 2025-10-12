import React, { useEffect, useState } from "react";
import { Box, Button, IconButton, Modal, TextField, Tooltip, Typography, Autocomplete } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getAllPayments, addPaymentMethod, deletePaymentMethod } from "utils/other/paymentsMethod";
import { MaterialReactTable } from "material-react-table";
import DeleteIcon from '@mui/icons-material/Delete';
import Toast, { showToast } from '../../../../components/shared/toast';
import 'react-toastify/dist/ReactToastify.css';
import "./style.css";
import { labelOptions } from "staticData/paymentsMethods";
const theme = createTheme({
  typography: {
    fontFamily: "DroidArabic, sans-serif",
  },
});
const PaymentsMethods = () => {
  const [loggerData, setLoggerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [newMethod, setNewMethod] = useState({ label: '', value: '' });
  


  const fetchData = () => {
    setLoading(true);
    getAllPayments()
      .then((response) => {
        setLoggerData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching payment methods:", error);
        showToast('Failed to fetch payment methods.', 'error');
        setLoading(false);
      });
  };

  const handleAddMethod = () => {
    if (!newMethod.label || !newMethod.value) {
      showToast('Please fill in both fields.', 'warning');
      return;
    }
    addPaymentMethod(newMethod)
      .then(() => {
        showToast('Payment method added successfully!', 'success');
        fetchData();
        setOpenModal(false);
        setNewMethod({ label: '', value: '' });
      })
      .catch((error) => {
        console.error("Error adding payment method:", error);
        showToast('Failed to add payment method.', 'error');
      });
  };

  const handleDelete = (id) => {
    deletePaymentMethod(id)
      .then(() => {
        showToast('Payment method deleted successfully!', 'success');
        fetchData();
      })
      .catch((error) => {
        console.error("Error deleting payment method:", error);
        showToast('Failed to delete payment method.', 'error');
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const customColumns = [
    {
      header: 'Method Name',
      accessorKey: 'label',
      size: 30,
    },
    {
      header: 'Value',
      accessorKey: 'value',
      enableClickToCopy: true,
      size: 30,
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      size: 30,
      Cell: ({ row }) => (
        <Tooltip title="Delete entry">
          <IconButton color="error" onClick={() => handleDelete(row.original._id)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Toast position="top-right" autoClose={3000} closeButton={false} />
      <Box >
        {/* <Button 
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
          sx={{ textTransform: 'none', mt: 2, ml: 0 }} // Added marginTop and aligned left
        >
          Add Payment Method
        </Button> */}


        <MaterialReactTable
          columns={customColumns}
          data={loggerData}
          loading={loading}
          state={{ isLoading: loading }}

          renderTopToolbarCustomActions={() => (
            <Button
              color="secondary"
              onClick={() => setOpenModal(true)}
              variant="contained"
              sx={{ textTransform: "none" }}
            >
اصافة وسيلة دفع
            </Button>
          )}
          
        />

        {/* Modal for Adding Payment Method */}
        <Modal open={openModal} onClose={() => setOpenModal(false)} aria-labelledby="add-payment-method">
          <Box
            sx={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4, width: 400
            }}
          >
<Typography
  variant="h6"
  mb={2}
  id="add-payment-method"
  textAlign="center"
>
  اضافة وسيلة دفع جديده
</Typography>
            <Autocomplete
              options={labelOptions}
              renderInput={(params) => <TextField {...params} label="Method Name" />}
              value={newMethod.label}
              onChange={(event, value) => setNewMethod((prev) => ({ ...prev, label: value }))}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Value"
              value={newMethod.value}
              onChange={(e) => setNewMethod((prev) => ({ ...prev, value: e.target.value }))}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="secondary" onClick={handleAddMethod} fullWidth>
              حفظ
            </Button>
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
};

export default PaymentsMethods;
