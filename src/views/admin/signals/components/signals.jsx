// CoursesTable.js
import React, { useEffect, useState } from "react";
import { Box, IconButton, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import TimerRoundedIcon from "@mui/icons-material/TimerRounded";
import LinkIcon from "@mui/icons-material/Link"; // Importing Link Icon
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  getAllsignals,
  deleteSignal,
  updateSignal,
  addSignal,
} from "../../../../utils/signals/signals";
import { MaterialReactTable } from "material-react-table";
import Modal from "components/modal/modal";
import moment from "moment";
const theme = createTheme();
const CoursesTable = () => {
  const signalsType = [
    "Buy",
    "Sell",
    "Buy Limit",
    "Sell Limit",
    "Buy Stop",
    "Sell Stop",
  ];
  const statusType = [
    "Pending",
    "Active",
    "Closed",
    "Profit",
    "Loss",
    "Expired",
  ];

  const [SignalsData, setSignalsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSignalId, setSelectedSignalId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newSignalData, setnewSignalData] = useState({
    pair: "",
    vip:false,
    signalType: "",
    action: "",
    entryPrice: null,
    takeProfit: null,
    stopLoss: null,
    status: "",
    result: 0,
    analysesLink: "",
    vip:false,
    signalType: "",

  });
  const [editSignalData, setEditSignalData] = useState({
    _id: "",
    pair: "",
    action: "",
    entryPrice: null,
    takeProfit: null,
    stopLoss: null,
    status: "",
    result: 0,
    analysesLink: "",
    vip:false,
    signalType: "",
  });

  const fetchSignals = async () => {
    try {
      const signals = await getAllsignals();
      const reversedSignals = signals.signals.reverse();
      setSignalsData(reversedSignals);
    } catch (error) {
      console.error("Error fetching signals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, []);
  

  const handleDelete = async (courseId) => {
    try {
      const updatedSignalData = SignalsData.filter(
        (course) => course._id !== courseId
      );
      setSignalsData(updatedSignalData);
      await deleteSignal(courseId);
    } catch (error) {
      console.error(`Error deleting Signal with ID ${courseId}:`, error);
    }
  };

  //-----------------------------Edit-------------------------------
  const handleEdit = (signalId) => {
    setSelectedSignalId(signalId);
    setIsEditModalOpen(true);
    const signalToEdit = SignalsData.find((signal) => signal._id === signalId);
    setEditSignalData({
      pair: signalToEdit.pair,
      action: signalToEdit.action,
      entryPrice: signalToEdit.entryPrice,
      takeProfit: signalToEdit.takeProfit,
      stopLoss: signalToEdit.stopLoss,
      status: signalToEdit.status,
      result: signalToEdit.result,
      date: signalToEdit.date,
      analysesLink: signalToEdit.analysesLink,
      vip: signalToEdit.vip,
      signalType: signalToEdit.signalType, 
    });
  };
  const handleSave = async () => {
    try {
  
      const response = await updateSignal(selectedSignalId, editSignalData);
      
      if (!response || !response.signal) {
        throw new Error('Update signal response is invalid.');
      }
  
      const updatedSignal = response.signal;
  
      setSignalsData((prevSignals) => {
        // Remove the existing signal from the previous state
        const updatedSignals = prevSignals.filter(signal => signal._id !== selectedSignalId);
        
        // Add the updated signal to the front of the array
        return [updatedSignal, ...updatedSignals];
      });
  
      setIsEditModalOpen(false);
    } catch (error) {
      console.error(`Error updating signal with ID ${selectedSignalId}:`, error);
      // Optionally, you can show an alert or message to the user here
    }
  };
  

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditSignalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "price" ? parseFloat(value) : value;

    // Update state using the setnewSignalData function
    setnewSignalData((prevSignalData) => ({
      ...prevSignalData,
      [name]: newValue,
    }));
  };
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };
  const handleSaveAddModal = async () => {
    try {
      // Convert relevant fields to numbers
      const formattedSignalData = {
        ...newSignalData,
        entryPrice: parseFloat(newSignalData.entryPrice),
        takeProfit: parseFloat(newSignalData.takeProfit),
        stopLoss: parseFloat(newSignalData.stopLoss),
      };

      const response = await addSignal(formattedSignalData);
      let newsignal = response.signal; // Use let to allow reassignment
      setSignalsData([...SignalsData, newsignal]);
      await fetchSignals();

      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding signal:", error);
    }
  };


  const vipOption = ["true", "false"];
  const departmentOption=["forex", "saudimarket","whalesfamily"];

  const addInputFields = [
    {
      label: "Pair Name",
      name: "pair",
      value: newSignalData.name,
      onChange: handleAddInputChange,
    },

    {
      label: "Action Type",
      name: "action",
      select: true,
      value: newSignalData.action,
      onChange: (event) =>
        setnewSignalData((prevState) => ({
          ...prevState,
          action: event.target.value,
        })),
      options: signalsType,
    },

    {
      label: "Entry Price",
      name: "entryPrice",
      value: newSignalData.entryPrice,
      onChange: handleAddInputChange,
    },
    {
      label: "Take Profit",
      name: "takeProfit",
      value: newSignalData.takeProfit,
      onChange: handleAddInputChange,
    },
    {
      label: "Stop Lose",
      name: "stopLoss",
      value: newSignalData.stopLoss,
      onChange: handleAddInputChange,
    },

    {
      label: "Status",
      name: "status",
      value: newSignalData.status,
      select: true,

      onChange: (event) =>
        setnewSignalData((prevState) => ({
          ...prevState,
          status: event.target.value,
        })),
      options: statusType,
    },



    {
      label: "VIP", // Type
      name: "vip",
      select: true,
      onChange: (event) =>
        setnewSignalData((prevState) => ({
          ...prevState,
          vip: event.target.value === "true", // Convert the string to a boolean
        })),
      options: vipOption,
    },
    {
      label: "Department", // Type
      name: "signalType",
      select: true,
      onChange: (event) =>
        setnewSignalData((prevState) => ({
          ...prevState,
          signalType: event.target.value,
        })),
      options: departmentOption,
    },

    
    


    
    {
      label: "Analyses Link",
      name: "analysesLink",
      value: newSignalData.analysesLink,
      onChange: handleAddInputChange,
    },
  ];

  const inputFields = [
    {
      label: "Pair Name",
      name: "pair",
      value: editSignalData.pair,
      onChange: handleInputChange,
    },
    {
      label: "Action Type",
      name: "action",
      select: true,
      value: editSignalData.action,
      onChange: (e) =>
        setEditSignalData((prev) => ({ ...prev, action: e.target.value })),
      options: signalsType,
    },
    
    {
      label: "Entry Price",
      name: "entryPrice",
      value: editSignalData.entryPrice,
      onChange: handleInputChange,
    },
    {
      label: "Take Profit",
      name: "takeProfit",
      value: editSignalData.takeProfit,
      onChange: handleInputChange,
    },
    {
      label: "Stop Loss",
      name: "stopLoss",
      value: editSignalData.stopLoss,
      onChange: handleInputChange,
    },
    {
      label: "Status",
      name: "status",
      select: true,
      value: editSignalData.status,
      onChange: (e) =>
        setEditSignalData((prev) => ({ ...prev, status: e.target.value })),
      options: statusType,
    },
    {
      label: "Result Points",
      name: "result",
      value: editSignalData.result,
      onChange: handleInputChange,
    },
    {
      label: "VIP", // Type
      name: "vip",
      select: true,
      value: editSignalData.vip,
      onChange: (event) =>
        setEditSignalData((prevState) => ({
          ...prevState,
          vip: event.target.value === "true", // Convert the string to a boolean
        })),
      options: vipOption,
    },
    {
      label: "Department", // Type
      name: "signalType",
      select: true,
      value: editSignalData.signalType,
      onChange: (event) =>
        setEditSignalData((prevState) => ({
          ...prevState,
          signalType: event.target.value,
        })),
      options: departmentOption,
    },

    
    



    {
      label: "Analyses Link",
      name: "analysesLink",
      value: editSignalData.analysesLink,
      onChange: handleInputChange,
    },
  ];


  const customColumns = [
    {
      header: "Pair Name",
      accessorKey: "pair",
      minSize: 3,
    },
    {
      header: "Type",
      accessorKey: "action",
      minSize: 3,
    },
    {
      header: "Actions",

      accessorKey: "actions",
      maxSize: 3,

      Cell: ({ row }) => (
        <>
          <IconButton
            onClick={() => handleDelete(row.original._id)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => handleEdit(row.original._id)}
          >
            <EditIcon />
          </IconButton>
        </>
      ),
    },
    {
      header: "VIP",
      accessorKey: "vip",
      Cell: ({ cell }) => (
          cell.getValue() ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />
      ), // Show checkmark if VIP
      maxSize: 3,

  },
    

    {
      header: "Department", 
      accessorKey: "signalType",
      maxSize: 3,

    
    },


    {
      header: "Status",
      accessorKey: "status",
      minSize: 3,

      Cell: ({ row }) => {
        const status = row.original.status;

        let statusColor;
        let statusIcon;
        let statusText;

        switch (status) {
          case "Pending":
            // statusColor = "#FFF59D"; // Light yellow
            statusIcon = <TimerRoundedIcon style={{ color: "#FFB300" }} />; // Amber
            statusText = "Pending";
            break;
          case "Active":
            // statusColor = "#C8E6C9"; // Light green
            statusIcon = (
              <CheckCircleRoundedIcon style={{ color: "#4CAF50" }} />
            ); // Green
            statusText = "Active";
            break;
          case "Closed":
            // statusColor = "#BBDEFB"; // Light blue
            statusIcon = (
              <CheckCircleRoundedIcon style={{ color: "#757575" }} />
            ); // Blue
            statusText = "Closed";
            break;
          case "Profit":
            // statusColor = "#C8E6C9"; // Light green (same as Active)
            statusIcon = (
              <CheckCircleRoundedIcon style={{ color: "#4CAF50" }} />
            ); // Green (same as Active)
            statusText = "Profit";
            break;
          case "Loss":
            // statusColor = "#FFCDD2"; // Light red
            statusIcon = <CancelRoundedIcon style={{ color: "#F44336" }} />; // Red
            statusText = "Loss";
            break;
          case "Expired":
            // statusColor = "#E0E0E0"; // Light grey
            statusIcon = <CancelRoundedIcon style={{ color: "#9E9E9E" }} />; // Grey
            statusText = "Expired";
            break;
          default:
            statusColor = "black";
            statusIcon = null;
            statusText = "Unknown";
            break;
        }

        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: statusColor,
              padding: "4px",
              borderRadius: "50px",
              width: "120px",
              height: "30px",
            }}
          >
            {statusIcon && (
              <div
                style={{
                  flex: "none",
                  marginRight: "8px",
                  alignItems: "center",
                }}
              >
                {statusIcon}
              </div>
            )}
            {statusText}
          </div>
        );
      },
    },
    {
      header: "Result",
      accessorKey: "result",
      minSize: 3,
      Cell: ({ row }) => {
        const result = row.original.result;

        let resultColor;
        let resultText;

        if (result < 0) {
          resultColor = "#FFCDD2"; // Light red
          resultText = <b style={{ color: "#F44336" }}>{result}</b>; // Red and bold
        } else if (result > 0) {
          resultColor = "#C8E6C9"; // Light green
          resultText = <b style={{ color: "#4CAF50" }}>{result}</b>; // Green and bold
        } else {
          resultColor = "#E0E0E0"; // Light gray
          resultText = <b style={{ color: "#757575" }}>{result}</b>; // Dark gray text
        }

        return (
          <div
            style={{
              backgroundColor: resultColor,
              padding: "4px",
              borderRadius: "10px",
              width: "60px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {resultText}
          </div>
        );
      },
    },

    {
      header: "Entry Price",
      accessorKey: "entryPrice",
      minSize: 3,
    },
    {
      header: "Take Profit",
      accessorKey: "takeProfit",
      minSize: 3,
    },
    {
      header: "Stop Lose",
      accessorKey: "stopLoss",
      minSize: 3,
    },

    {
      header: "Analyses Link",
      accessorKey: "analysesLink",
      Cell: ({ row }) => {
        const link = row.original.analysesLink;
        return (
          <IconButton
            onClick={() => window.open(link, "_blank")}
            color="primary"
          >
            <LinkIcon />
          </IconButton>
        );
      },
    },

    {
      header: "Date",
      accessorKey: "date",
      minSize: 3,

      Cell: ({ row }) => {
        const parsedDate = moment(row.original.creationTime);

        if (parsedDate.isValid()) {
          const formattedCreationTime = parsedDate.format("MMMM D, YYYY HH:mm");

          return <span>{formattedCreationTime}</span>;
        } else {
          return <span>Invalid Date</span>;
        }
      },
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <MaterialReactTable
          columns={customColumns}
          data={SignalsData}
          loading={loading}
          state={{
            isLoading: loading,
          }}
          renderTopToolbarCustomActions={() => (
            <Button
              color="secondary"
              onClick={handleOpenAddModal}
              variant="contained"
              sx={{ textTransform: "none" }}
            >
              Add Signal
            </Button>
          )}
        />
      </Box>

      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSave}
        inputFields={inputFields}
        modalName="Edit Signal"
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveAddModal}
        inputFields={addInputFields}
        modalName="Add Signal"
      />
    </ThemeProvider>
  );
};

export default CoursesTable;
