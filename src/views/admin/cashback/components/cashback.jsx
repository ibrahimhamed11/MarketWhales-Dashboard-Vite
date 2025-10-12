import React, { useEffect, useState } from "react";
import { Box, Tab, Tabs, IconButton } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  allPayments,
  allTradinAccounts,
  handleUpdateStatus,
  removeAccount,
  getCashbackProfitByAccountId,
  updatePaymentstatus,
  subtractFromWallet,
} from "../../../../utils/cashback/cashback";
import { MaterialReactTable } from "material-react-table";
import moment from "moment";
import { ChakraProvider, useColorMode } from "@chakra-ui/react";
import { Button } from "@mui/material"; // Ensure this import is included
import CashbackModal from "./CashbackModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Toast, { showToast } from "../../../../components/shared/toast";

const theme = createTheme();

const CashbackTable = () => {
  const [paymentsRequsts, setpaymentsRequsts] = useState([]);
  const [tradingAccounts, settradingAccounts] = useState([]);
  const [selectedCashbackProfitData, setSelectedCashbackProfitData] = useState(
    []
  );
  const [loading, setLoading] = useState(true);
  const [loadingStatusUpdate, setLoadingStatusUpdate] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [accountId, setAccountId] = useState("");

  const fetchData = async () => {
    try {
      const response = await allPayments();
      const tradinAccounts = await allTradinAccounts();
      setpaymentsRequsts(response);
      settradingAccounts(tradinAccounts);
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
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
    removeAccount(id);
  };
  const handleApprove = async (row) => {
    const status = "Approved";

    try {
      await updatePaymentstatus(row.original._id, status);
      await subtractFromWallet(row.original.accountId, row.original.amount);
    } catch (error) {
      console.error("Error updating payment status:", error.message);
    }
  };

  const handleCancel = async (row) => {
    const status = "Cancelled";

    try {
      await updatePaymentstatus(row.original._id, status);
    } catch (error) {
      console.error("Error updating payment status:", error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "#4CAF50";
      case "Pending":
        return "#FFC107";
      case "Cancelled":
        return "#FA1D1DE5";
      default:
        return "white";
    }
  };

  const handleViewPaymentsLog = async (id) => {
    try {
      setAccountId(id);
      const cashbackProfitData = await getCashbackProfitByAccountId(id);
      setSelectedCashbackProfitData(cashbackProfitData);
      setActiveTab(2);
    } catch (error) {
      console.error("Error fetching cashback profit data:", error);
    }
  };

  const paymentColumns = [
    {
      header: "Amount",
      accessorKey: "amount",
      Cell: ({ row }) => `$${row.original.amount.toFixed(2)}`,
    },
    {
      header: "Payment Method",
      accessorKey: "method",
      enableClickToCopy: true,
    },
    {
      header: "Status",
      accessorKey: "status",
      Cell: ({ row }) => (
        <span
          style={{
            backgroundColor: getStatusColor(row.original.status),
            padding: "5px",
            borderRadius: "3px",
            color: "white",
            minWidth: "80px",
            display: "inline-block",
            borderRadius: "10px", // Set the border radius to your preference
            textAlign: "center",
          }}
        >
          {row.original.status}
        </span>
      ),
    },

    {
      header: "Actions",
      accessorKey: "actions",
      Cell: ({ row }) => {
        if (row.original.status === "Pending") {
          return (
            <>
              <Box display="flex" alignItems="center" justifyContent="center">
                {/* First Button */}
                <Box
                  bgcolor="#8bc34a"
                  color="white"
                  p={1}
                  borderRadius={3}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  onClick={() => handleApprove(row)}
                  style={{ cursor: "pointer" }}
                  marginRight={1} // Adjust the spacing between buttons
                >
                  <span style={{ fontSize: 12, marginLeft: 4 }}>Approve</span>
                </Box>

                {/* Second Button */}
                <Box
                  bgcolor="#FA1D1DE5"
                  color="white"
                  p={1}
                  borderRadius={3}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  onClick={() => handleCancel(row)}
                  style={{ cursor: "pointer" }}
                >
                  <span style={{ fontSize: 12, marginLeft: 4 }}>Cancel</span>
                </Box>
              </Box>
            </>
          );
        } else if (row.original.status === "Approved") {
          return (
            <Box display="flex" alignItems="center" justifyContent="center">
              <Box
                bgcolor="#4CAF50"
                color="white"
                p={1}
                borderRadius={3}
                display="flex"
                alignItems="center"
                justifyContent="center"
                // style={{ cursor: "pointer" }}
              >
                <span style={{ fontSize: 12, marginLeft: 4 }}>
                  You have Approved
                </span>
              </Box>
            </Box>
          );
        } else if (row.original.status === "Cancelled") {
          return (
            <Box display="flex" alignItems="center" justifyContent="center">
              <Box
                bgcolor="#FA1D1DE5"
                color="white"
                p={1}
                borderRadius={3}
                display="flex"
                alignItems="center"
                justifyContent="center"
                // style={{ cursor: "pointer" }}
              >
                <span style={{ fontSize: 12, marginLeft: 4 }}>
                  You have Cancelled
                </span>
              </Box>
            </Box>
          );
        } else if (row.original.status === "pending") {
          return (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
            ></Box>
          );
        }
        return null;
      },
    },

    {
      header: "Notes",
      accessorKey: "notes",
    },
    {
      header: "User ID",
      accessorKey: "userId",
    },
    {
      header: "Date",
      accessorKey: "date",
      Cell: ({ row }) => moment(row.original.date).format("D-M-YYYY : hh:mm A"),
    },
  ];

  const tradinAccounts = [
    {
      header: "Account Number",
      accessorKey: "accountNumber",
      enableClickToCopy: true,
    },
    {
      header: "Company",
      accessorKey: "company",
    },
    {
      header: "User ID",
      accessorKey: "userId",
      enableClickToCopy: true,
    },
    {
      header: "CashBack Profit",
      accessorKey: "wallet",
      Cell: ({ row }) => `$${row.original.wallet.toFixed(2)}`,
    },

    {
      header: "Actions",
      accessorKey: "actions",
      Cell: ({ row }) => {
        const renderDeleteButton = () => (
          <Box
            bgcolor="#EF5555"
            color="white"
            p={1}
            borderRadius={3}
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={() => handleDelete(row.original._id)}
            style={{ cursor: "pointer", margin: 3 }}
          >
            <span style={{ fontSize: 12, marginLeft: 4 }}>Delete</span>
          </Box>
        );

        const renderPaymentsLog = () => (
          <Box
            bgcolor="#0CC7F1"
            color="white"
            p={1}
            borderRadius={3}
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={() => handleViewPaymentsLog(row.original._id)}
            style={{ cursor: "pointer", margin: 3 }}
          >
            <span style={{ fontSize: 12, marginLeft: 4 }}>Cashback</span>
          </Box>
        );

        if (row.original.status === "active") {
          return (
            <Box display="flex" alignItems="center" justifyContent="center">
              {renderDeleteButton()}
              {renderPaymentsLog()}

              <Box
                bgcolor="#E4A909"
                color="white"
                p={1}
                borderRadius={3}
                display="flex"
                alignItems="center"
                justifyContent="center"
                onClick={() =>
                  handleUpdateStatus(
                    row.original._id,
                    row.original.status === "active" ? "inactive" : "active"
                  )
                }
                style={{ cursor: "pointer" }}
              >
                <span style={{ fontSize: 12, marginLeft: 4 }}>
                  {row.original.status === "active" ? "Deactivate" : "Activate"}
                </span>
              </Box>
            </Box>
          );
        } else if (row.original.status === "inactive") {
          return (
            <Box display="flex" alignItems="center" justifyContent="center">
              {renderDeleteButton()}

              <Box
                bgcolor="#8bc34a"
                color="white"
                p={1}
                borderRadius={3}
                display="flex"
                alignItems="center"
                justifyContent="center"
                onClick={() => handleUpdateStatus(row.original._id, "active")}
                style={{ cursor: "pointer" }}
              >
                <span style={{ fontSize: 12, marginLeft: 4 }}>Activate</span>
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
      header: "Deposit Amount",
      accessorKey: "depositAmount",
      Cell: ({ row }) => `$${row.original.depositAmount.toFixed(2)}`,
      enableClickToCopy: true,
    },
    {
      header: "Date",
      accessorKey: "date",
      Cell: ({ row }) => moment(row.original.date).format("D-M-YYYY : hh:mm A"),
    },
  ];

  const cashbackProfitColumns = [
    {
      header: "From Date",
      accessorKey: "fromDate",
      Cell: ({ row }) => moment(row.original.fromDate).format("D-M-YYYY"),
      enableClickToCopy: true,
    },
    {
      header: "To Date",
      accessorKey: "toDate",
      Cell: ({ row }) => moment(row.original.toDate).format("D-M-YYYY"),
      enableClickToCopy: true,
    },
    {
      header: "Cash Amount",
      accessorKey: "cashamount",
      Cell: ({ row }) => `$${row.original.cashamount.toFixed(2)}`,
      enableClickToCopy: true,
    },
    {
      header: "Status",
      accessorKey: "status",
      enableClickToCopy: true,
    },
    // Add more columns if needed
  ];

  const renderTable = () => {
    if (activeTab === 0) {
      // Render payments table
      return (
        <MaterialReactTable
          columns={paymentColumns}
          data={paymentsRequsts}
          loading={loadingStatusUpdate || loading}
          state={{
            isLoading: loadingStatusUpdate || loading,
          }}
        />
      );
    } else if (activeTab === 1) {
      // Render Trading Accounts table
      return (
        <MaterialReactTable
          columns={tradinAccounts}
          data={tradingAccounts}
          loading={loadingStatusUpdate || loading}
          state={{
            isLoading: loadingStatusUpdate || loading,
          }}
        />
      );
    } else if (activeTab === 2) {
      // Render adding Cashback

      return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Box
            sx={{
              display: "flex", // Use flexbox for layout
              flexDirection: "column", // Stack items vertically
              alignItems: "flex-start", // Align items to the start
              p: 3, // Add padding to the container
            }}
          >
            <Button
              color="secondary"
              sx={{
                textTransform: "none", // Prevent text transformation to uppercase
                mb: 2, // Add margin bottom for spacing
              }}
              variant="contained"
              onClick={() => setOpenModal(true)}
            >
              Add Cashback
            </Button>

            <CashbackModal
              open={openModal} // Use openModal here
              onClose={() => setOpenModal(false)} // Change setModalOpen to setOpenModal
              accountId={accountId}
              fetchData={fetchData}
            />
          </Box>

          <MaterialReactTable
            columns={cashbackProfitColumns}
            data={selectedCashbackProfitData}
            loading={loadingStatusUpdate || loading}
            state={{
              isLoading: loadingStatusUpdate || loading,
            }}
            muiTableBodyProps={{
              sx: {
                "& tr:nth-of-type(even)": {
                  backgroundColor: "#f5f5f5", // Light gray background color
                },
                "& tr:hover td": {
                  backgroundColor: "#e0e0e0", // Lighter gray background color on hover
                },
              },
            }}
            muiTableHeadCellProps={{
              sx: {
                backgroundColor: "#e0e0e0", // Light gray background color for header cells
                color: "#000", // Black text color for header cells
              },
            }}
            muiTableBodyCellProps={{
              sx: {
                backgroundColor: "#f5f5f5", // Light gray background color for body cells
                color: "#000", // Black text color for body cells
              },
            }}
            muiBottomToolbarProps={{
              sx: {
                backgroundColor: "#b8e7fc", // Light gray background color for bottom toolbar
              },
            }}
            muiTopToolbarProps={{
              sx: {
                backgroundColor: "#b8e7fc", // Light gray background color for top toolbar
              },
            }}
            muiTablePaginationProps={{
              sx: {
                color: "#000", // Black text color for pagination
              },
            }}
          />
        </div>
      );
    }
  };

  return (
    <ChakraProvider>
      <ThemeProvider theme={theme}>
        <Box >
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
          >
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab
                label="Payments"
                style={{ textTransform: "none", minWidth: "300px" }}
              />
              <Tab
                label="Accounts"
                style={{ textTransform: "none", minWidth: "300px" }}
              />
            </Tabs>
          </Tabs>

          {renderTable()}
        </Box>
      </ThemeProvider>

      <ToastContainer />
      <Toast position="top-right" autoClose={3000} closeButton={false} />
    </ChakraProvider>
  );
};

export default CashbackTable;
