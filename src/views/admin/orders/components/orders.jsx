import React, { useEffect, useState } from "react";
import { Box, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { allOrders,addBoughtCourse,updateOrderStatus,removeBoughtCourse,removeOrder } from "../../../../utils/orders/orders";
import { MaterialReactTable } from "material-react-table";
import moment from 'moment';
import ImageModal from "components/modal/imageModal";
import { ChakraProvider, useColorMode } from "@chakra-ui/react";

const theme = createTheme();
const OrdersTable = () => {
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');
  const [loadingStatusUpdate, setLoadingStatusUpdate] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();





  const fetchData = async () => {
    try {
      const response = await allOrders();
      setOrdersData(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 300); 

    return () => clearInterval(interval); 
  }, []);





  
  const updateOrderStatusLocally = (orderId, newStatus) => {
    setOrdersData(prevOrders => prevOrders.map(order => 
      order._id === orderId ? { ...order, status: newStatus } : order
    ));
  };
  


  

  const handleDelete = async (orderId) => {
    removeOrder(orderId)

  }


  const handleApprove = async (courseId, userId, orderId) => {
    try {
      setLoadingStatusUpdate(true); 
      await addBoughtCourse(userId, courseId);
      await updateOrderStatus(orderId, 'approved');
  
      updateOrderStatusLocally(orderId, 'approved');
      } catch (error) {
      console.error('Error handling approval:', error);
    } finally {
      setLoadingStatusUpdate(false); 
    }
  };
  
  const handelPending = async (courseId, userId, orderId) => {
    try {
      setLoadingStatusUpdate(true); 

      
      await removeBoughtCourse(userId, courseId);
      await updateOrderStatus(orderId, 'pending');
  
      updateOrderStatusLocally(orderId, 'pending');
      } catch (error) {
      console.error('Error handling approval:', error);
    } finally {
      setLoadingStatusUpdate(false); 
    }
  };
  




  //Image Modal 
  const handleViewImage = (imageUrl) => {
    setModalImageUrl(imageUrl);
    setModalOpen(true);
  };

  const handleCloseModal = () => {

    setModalImageUrl('');

    setModalOpen(false);
  };



  const customColumns = [
    {
      header: "Client Name",
      accessorKey: "userName",
      enableClickToCopy: true,
    },

    {
      header: "Status",
      accessorKey: "status",
      enableClickToCopy: true,
    },
    {
      header: "Actions",
      accessorKey: "actions",
      Cell: ({ row }) => {

  
        const renderDeleteButton = () => (
          <Box
            bgcolor="#FA1D1DE5" // Red color for delete
            color="white"
            p={1}
            borderRadius={3}
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={() => handleDelete( row.original._id)}
            style={{ cursor: "pointer",margin: 3 }}
          >
            <span style={{ fontSize: 12, marginLeft: 4 }}>Delete</span>
          </Box>
        );
        
        if (row.original.status === "pending") {
          return (
            <Box display="flex" alignItems="center" justifyContent="center">
            <Box display="flex" alignItems="center" justifyContent="center">
              {renderDeleteButton()}
            </Box>
              
              <Box
                bgcolor="#8bc34a" 
                color="white"
                p={1}
                borderRadius={3}
                display="flex"
                alignItems="center"
                justifyContent="center"
                onClick={() => handleApprove(row.original.courseId, row.original.userId, row.original._id)}
                style={{ cursor: "pointer" }}
              >
         
                <span style={{ fontSize: 12, marginLeft: 4 }}>Approve</span>
              </Box>
            </Box>
          );
        } else if (row.original.status === "approved") {
          return (
            <Box display="flex" alignItems="center" justifyContent="center">
                      {renderDeleteButton()}

              <Box
                bgcolor="#E4A909" 
                color="white"
                p={1}
                borderRadius={3}
                display="flex"
                alignItems="center"
                justifyContent="center"
                onClick={() => handelPending(row.original.courseId, row.original.userId, row.original._id)}
                style={{ cursor: "pointer" }}
              >
                <span style={{ fontSize: 12, marginLeft: 4 }}>Pending</span>
              </Box>
            </Box>
          );
        } else if (row.original.status === "pending") {
          return (
            <Box display="flex" alignItems="center" justifyContent="center">
              {renderDeleteButton()}
            </Box>
          );
        }
        return null; 
      },
    },


    {
      header: "Phone",
      accessorKey: "userPhone",
      enableClickToCopy: true,
    },
    {
      header: "Course Name",
      accessorKey: "courseName",
      enableClickToCopy: true,
    },
    {
      header: "Price",
      accessorKey: "coursePrice",
      Cell: ({ row }) => `$${row.original.coursePrice}`,
      enableClickToCopy: true,
    },
    {
      header: "Email",
      accessorKey: "userEmail",
      enableClickToCopy: true,
    },
    {
      header: "Pay-Screen",
      accessorKey: "image",
      enableClickToCopy: true,
      Cell: ({ row }) => (
        <IconButton onClick={() => handleViewImage(row.original.image)}>
          <VisibilityIcon />
        </IconButton>
      ),
    },
    {
      header: "Payment Method",
      accessorKey: "selectedItemData",
      enableClickToCopy: true,
    },
  
    {
      header: "Date",
      accessorKey: "date",
      minSize: 3,
      Cell: ({ row }) => {
        const parsedDate = moment(row.original.creationTime);
    




        if (parsedDate.isValid()) {
          const formattedCreationTime = parsedDate.format('D-M-YYYY : hh:mm A'); // Added 'a' for AM/PM format
    
          return <span>{formattedCreationTime}</span>;
        } else {
          return <span>Invalid Date</span>;
        }
      },
    },
  ];


  return (
    <ChakraProvider>

<ThemeProvider theme={theme}>
  <Box >

  <MaterialReactTable
  columns={customColumns}
  data={ordersData}
  loading={loadingStatusUpdate || loading}
  state={{
    isLoading: loadingStatusUpdate || loading,
  }}
  muiTableBodyCellProps={{
    sx: {
      backgroundColor: colorMode === "dark" ? '#111c44' : '#fff',
      color: colorMode === "dark" ? '#fff' : '#111c44',
    },
  }}
  muiBottomToolbarProps={{
    sx: {
      backgroundColor: colorMode === "dark" ? '#111c44' : '#fff',
    },
  }}
  muiTopToolbarProps={{
    sx: {
      backgroundColor: colorMode === "dark" ? '#111c44' : '#fff',
    },
  }}
  muiTablePaginationProps={{
    sx: {
      color: colorMode === "dark" ? '#fff' : '#111c44',
    },
  }}
  muiTablePaperProps={{
    elevation: 0,
    sx: {
      borderRadius: '0',
      border: '1px dashed #e0e0e0',
      backgroundColor: colorMode === "dark" ? '#111c44' : '#fff',
    },
  }}
  muiTableHeadProps={{
    sx: {
      backgroundColor: colorMode === "dark" ? '#111c44' : '#fff',
      '& .MuiTableCell-root.MuiTableCell-head': {
        backgroundColor: colorMode === "dark" ? '#111c44' : '#fff',
        color: colorMode === "dark" ? '#fff' : '#111c44',
      },
    },
  }}
  muiTableBodyProps={{
    sx: (theme) => ({
      '& tr:hover td': {
        backgroundColor: colorMode === "dark" ? '#111c44' : '#d9d9d9',
      },
    }),
  }}
/>


  </Box>
  <ImageModal open={modalOpen} handleClose={handleCloseModal} imageUrl={modalImageUrl} />
</ThemeProvider>
</ChakraProvider>

  
  );
};

export default OrdersTable;
