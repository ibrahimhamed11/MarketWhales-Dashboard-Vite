import React, { useEffect, useState } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getAll, updateStatus, deleteWhalesFamily } from "utils/other/whalesFamily";
import { updateUser } from "../../../../utils/user/users";
import { MaterialReactTable } from "material-react-table";
import { format } from "date-fns";
import Toast from "../../../../components/shared/toast";
import "react-toastify/dist/ReactToastify.css";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/HourglassEmpty";

const theme = createTheme();

const Logger = () => {
  const [loggerData, setLoggerData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    getAll()
      .then((response) => {
        const sortedData = response.data.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setLoggerData(sortedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching logger data:", error);
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    deleteWhalesFamily(id)
      .then(() => {
        setLoggerData((prevData) => prevData.filter((entry) => entry._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting entry:", error);
      });
  };

  const handleStatusChange = async (id, currentStatus, userId, isVIP) => {
    const newStatus = currentStatus === "Approved" ? "Pending" : "Approved";

    try {
      // Update the status of the logger entry
      await updateStatus(id, newStatus);

      // Update the VIP status of the user
      const vipStatus = newStatus === "Approved" ? true : false;
      await updateUser(userId, { vip: vipStatus });

      // Update the local state
      setLoggerData((prevData) =>
        prevData.map((entry) =>
          entry._id === id
            ? { ...entry, status: newStatus, vip: vipStatus }
            : entry
        )
      );
    } catch (error) {
      console.error("Error updating status or VIP:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const customColumns = [
    {
      header: "Name",
      accessorKey: "name",
      size: 30,
    },
    {
      header: "Email",
      accessorKey: "email",
      enableClickToCopy: true,
      size: 30,
    },
    {
      header: "Reason To Join",
      accessorKey: "reasonToJoin",
      size: 30,
    },
    {
      header: "Method To Join",
      accessorKey: "methodToJoin",
      size: 30,
    },
    {
      header: "Remaining Days",
      accessorKey: "remainingDays",
      size: 30,
    },
    {
      header: "Status",
      accessorKey: "status",
      size: 30,
      Cell: ({ cell, row }) => (
        <Tooltip
          title={`Change status to ${
            cell.getValue() === "Approved" ? "Pending" : "Approved"
          }`}
        >
          <IconButton
            color={cell.getValue() === "Approved" ? "success" : "warning"}
            onClick={() =>
              handleStatusChange(
                row.original._id,
                cell.getValue(),
                row.original.userId._id,
                row.original.vip
              )
            }
            style={{ display: "flex", alignItems: "center", gap: "5px" }}
          >
            {cell.getValue() === "Approved" ? <CheckCircleIcon /> : <PendingIcon />}
            <Typography
              variant="body2"
              style={{
                color: cell.getValue() === "Approved" ? "green" : "orange",
              }}
            >
              {cell.getValue()}
            </Typography>
          </IconButton>
        </Tooltip>
      ),
    },
    {
      header: "Date and Time",
      accessorKey: "createdAt",
      size: 30,
      Cell: ({ cell }) => (
        <span>{format(new Date(cell.getValue()), "yyyy-MM-dd HH:mm:ss")}</span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
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
        <MaterialReactTable
          columns={customColumns}
          data={loggerData}
          loading={loading}
          state={{
            isLoading: loading,
          }}
        />
      </Box>
    </ThemeProvider>
  );
};

export default Logger;
