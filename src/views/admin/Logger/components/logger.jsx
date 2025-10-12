import React, { useEffect, useState } from "react";
import { Box, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getAll } from "utils/other/logger";
import { MaterialReactTable } from "material-react-table";
import { format } from 'date-fns'; // Ensure you import format from date-fns
import Toast from '../../../../components/shared/toast'; // Importing showToast function
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme(); 

const Logger = () => {
  const [loggerData, setLoggerData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true); // Set loading to true when fetching data
    getAll()
      .then((response) => {
        // Sort the data by timestamp in descending order
        const sortedData = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setLoggerData(sortedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching permissions:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(); // Fetch data when the component mounts
  }, []);

  const customColumns = [
    {
      header: 'Level',
      accessorKey: 'level',
      size: 30,
    },
    {
      header: 'Message',
      accessorKey: 'message',
      enableClickToCopy: true,
      size: 30,
    },
    {
      header: 'User Id',
      accessorKey: 'userId',
      size: 30,
    },
    {
      header: 'IP Address',
      accessorKey: 'userIp',
      size: 30,
    },
    {
      header: 'Date and Time',
      accessorKey: 'timestamp',
      size: 30,
      Cell: ({ cell }) => (
        // Format the date for display
        <span>{format(new Date(cell.getValue()), 'yyyy-MM-dd HH:mm:ss')}</span>
      ),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Toast position="top-right" autoClose={3000} closeButton={false} />
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Button 
                color="secondary"
                variant="contained"
                sx={{ textTransform: "none" }}


          onClick={fetchData} 
          style={{ marginTop: '16px', marginBottom: '16px' }} // Added marginTop for spacing
        >
          Refresh
        </Button>
        <MaterialReactTable
          columns={customColumns}
          data={loggerData}
          loading={loading}
          state={{
            isLoading: loading
          }}
        />
      </Box>
    </ThemeProvider>
  );
};

export default Logger;
