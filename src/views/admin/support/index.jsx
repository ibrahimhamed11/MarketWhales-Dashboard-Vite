import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { getAllTickets } from '../../../utils/tickets/tickets'; 
import VipIcon from "@mui/icons-material/VerifiedUser"; // Import VIP icon
import { IconButton } from "@mui/material";
import RegularIcon from "@mui/icons-material/Person"; // Regular icon
import { getUserTickets, updateTicket ,deleteTicket} from "../../../utils/tickets/tickets"; 
import Moment from 'moment'; 
import SendIcon from '@mui/icons-material/Send'; 
import './support.css'; 
import { Autocomplete } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // Import Delete icon

const TicketsTable = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [replyInput, setReplyInput] = useState('');
  const [replyError, setReplyError] = useState('');
  const [selectedType, setSelectedType] = useState('support'); 
  const [selectedStatus, setSelectedStatus] = useState('InProgress'); 
  const [attachments, setattachments] = useState(null);
  const theme = createTheme({
    typography: {
      fontFamily: 'DroidArabic, sans-serif',
    },
  });

 
  useEffect(() => {
    getAllTickets()
      .then((response) => {
        const sortedTickets = response.tickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort tickets by creation date
        setTickets(sortedTickets);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tickets:", error);
        setLoading(false);
      });
  }, []);






  const handleOpen = async (userId, ticketId) => {
    try {
      const response = await getUserTickets(userId); 

      if (response && response.tickets && response.tickets.length > 0) {
        const filteredTicket = response.tickets.find((ticket) => ticket._id === ticketId);
        setSelectedTicket(filteredTicket);
        setOpenDialog(true);
      } else {
        console.error("Ticket not found or user has no tickets.");
      }
    } catch (error) {
      console.error("Error fetching ticket details:", error);
    }
  };


  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleReplySubmit = async () => {
    if (replyInput.trim() === '') {
      setReplyError('يرجى إضافة رد  ');
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('message', replyInput);
      formData.append('type', selectedType);
      formData.append('status', selectedStatus);
      if (attachments) {
        formData.append('file', attachments);
      }
  
      const updatedTicket = { ...selectedTicket };
      updatedTicket.status = selectedStatus;
      const replyData = { message: replyInput, type: selectedType };
      if (attachments) {
        replyData.attachments = [attachments.name];
      }
      updatedTicket.replies.push(replyData);
      setSelectedTicket(updatedTicket);
      const updatedTickets = tickets.map((ticket) =>
        ticket._id === selectedTicket._id ? updatedTicket : ticket
      );
      setTickets(updatedTickets);
  
      await updateTicket(selectedTicket._id, formData);
      setReplyInput('');
      setReplyError('');
      setattachments(null);
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };
  
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setattachments(file);
  };
  

  const handleReplyInput = (e) => {
    setReplyInput(e.target.value);
    setReplyError('');
  };


  const handleDeleteTicket = async (ticketId) => {
    try {
      await deleteTicket(ticketId); // Call delete function from utils
      setTickets((prevTickets) => prevTickets.filter((ticket) => ticket._id !== ticketId)); // Remove ticket from state
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return { bgcolor: 'green' };
      case 'InProgress':
        return { bgcolor: 'orange' };
      case 'WaitingForCustomer':
        return { bgcolor: 'gold' };
      case 'Closed':
        return { bgcolor: 'black' };
      default:
        return { bgcolor: 'gray' };
    }
  };

  const getStatusTextInArabic = (status) => {
    switch (status) {
      case 'Open':
        return 'مفتوحة';
      case 'Closed':
        return 'مغلقة';
      case 'InProgress':
        return 'قيد الانتظار';
        case 'WaitingForCustomer':
          return 'قيد الانتظار';
      default:
        return status;
    }
  };
  


  
  const statusOptions = ['Open', 'InProgress', 'WaitingForCustomer', 'Closed'];




  const renderReplies = (replies) => {
    if (!Array.isArray(replies) || replies.length === 0) {
      return <Typography variant="body2">لا يوجد رسايل.</Typography>;
    }
  
  
    return (
<Box Height="600px"mt={3}>
        {replies.map((reply) => (
          <Box
            key={reply._id}
            mt={2}
            display="flex"
            flexDirection="column"
            alignItems={reply.type === 'user' ? 'flex-start' : 'flex-end'}
          >
            <Box
              bgcolor={reply.type === 'user' ? '#EAEAEA' : '#007AFF'}
              color={reply.type === 'user' ? '#000' : '#FFF'}
              p={2}
              borderRadius="10px"
              maxWidth="70%"
            >
              <Typography variant="body1" color="inherit">
                {reply.message}
              </Typography>
              {reply.attachments && reply.attachments.length > 0 && (
                <Box mt={1}>
                  {reply.attachments.map((attachment) => (
                    

                    <>
                    <Typography variant="body1" color="inherit">
                    {attachment}
                  </Typography>


                    <img
                      key={attachment}

                      
                      src={ `https://market-whales.onrender.com/${attachment}` }
                      alt="Attachment"
                      style={{ maxWidth: '100%', borderRadius: '5px', marginTop: '5px' }}
                    />

</>
                  ))}
                </Box>
              )}
              <Typography variant="body2" color="inherit" textAlign="right" mt={1}>
                {Moment(reply.createdAt).format('MMMM DD, YYYY - hh:mm A')}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    );
  };
  

  const customColumns = [
    {
      header: "الموضوع",
      accessorKey: "subject",
    },



    {
      header: "بريد العميل",
      accessorKey: "userEmail",
      enableClickToCopy: true,
    },
    {
      header: "الوقت والتاريخ",
      accessorKey: "createdAt",
      Cell: ({ row }) => (
        <Typography variant="body2">
          {Moment(row.original.createdAt).format('MMMM DD, YYYY - hh:mm A')}
        </Typography>
      ),
    },
    {
      header: "رقم التذكره",
      accessorKey: "ticketNumber",
    },

    {
      header: "VIP",
      accessorKey: "vip",
      Cell: ({ row }) => (
        <IconButton
          sx={{
            bgcolor: row.original.vip ? "gold" : "lightgray",
            borderRadius: "15px",
            textTransform: "none",
            minWidth: "60px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {row.original.vip ? (
            <>
               <Typography variant="body2" sx={{ ml: 1,marginRight:1 }}>
                VIP
              </Typography>
              <VipIcon sx={{ color: "black" }} />
           
            </>
          ) : (
            <>

              <RegularIcon sx={{ color: "black" }} />
        
            </>
          )}
        </IconButton>
      ),
    },
    
    {
      header: "حالة التذكره",
      accessorKey: "status",
      Cell: ({ row }) => (
        <Button
          variant="contained"
          sx={{
            ...getStatusColor(row.original.status),
            borderRadius: '15px',
            textTransform: 'none',
            minWidth: '120px',
            '&:hover': {
              bgcolor: getStatusColor(row.original.status).bgcolor,
            },
          }}
          onClick={() => handleOpen(row.original.userId, row.original._id)} 
        >
          {getStatusTextInArabic(row.original.status)}
        </Button>
        
      ),

      
    },
    {
      header: "العمليات",
      accessorKey: "actions",
      Cell: ({ row }) => (
        <Box display="flex" justifyContent="space-between">
          <IconButton onClick={() => handleOpen(row.original.userId, row.original._id)}>
            <SendIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteTicket(row.original._id)}>
            <DeleteIcon color="error" />
          </IconButton>
        </Box>
      ),
    },
    
  ];

  return (
    <ThemeProvider theme={theme}>
        <Box marginTop='50px'>
          <MaterialReactTable
            columns={customColumns}
            data={tickets}
            loading={loading}
            state={{
              isLoading: loading,
            }}
          />

<Dialog
  open={openDialog}
  onClose={handleCloseDialog}
  sx={{
    minWidth: '1200px',
    maxWidth: '130vw',
    minHeight: 'calc(100vh - 80px)',
    maxHeight: 'calc(100vh - 40px)',
    borderRadius: '20px', 
  }}
>
  {selectedTicket && (
    <>
      <DialogTitle>{selectedTicket.subject}</DialogTitle>
      <DialogContent sx={{ overflowY: 'auto' }}>
        
      <TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>

      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>Ticket Number</TableCell>
        <TableCell>
          <span style={{ backgroundColor: 'yellow', fontSize: '1.2em', fontWeight: 'bold', padding: '0.2em' }}>
            {selectedTicket.ticketNumber}
          </span>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>message</TableCell>
        <TableCell>{selectedTicket.message}</TableCell>
      </TableRow>


      <TableRow>
        <TableCell>Subject</TableCell>
        <TableCell>{selectedTicket.subject}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>User Email</TableCell>
        <TableCell>{selectedTicket.userEmail}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>



        <Box mt={3}>
          {renderReplies(selectedTicket.replies)}
        </Box>

        
        <Box mt={2} display="flex" alignItems="center">
          <TextField
            label="اضف رد"
            variant="outlined"
            size="small"
            fullWidth
            multiline
            rows={5}
            value={replyInput}
            onChange={handleReplyInput}
            required
            error={replyError !== ''}
            helperText={replyError}
            sx={{
              '& .MuiInputLabel-root': {
                direction: 'rtl',
              },
              '& .MuiOutlinedInput-root': {
                direction: 'rtl',
              },
            }}
          />
          <IconButton
            color="primary"
            onClick={handleReplySubmit}
            sx={{ ml: 1, p: 1, borderRadius: '50%' }}
          >
            <SendIcon />
          </IconButton>
        </Box>


        <Box mt={2}>

        <Box mt={2} mb={2}>

        <input type="file" accept="image/*" onChange={handleImageChange} />

        </Box>


          <Autocomplete
            options={statusOptions}
            value={selectedStatus}
            onChange={(event, newValue) => setSelectedStatus(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="تغيير حالة التذكره"
                variant="outlined"
                size="small"
                fullWidth
                required
                error={!selectedStatus}
                helperText={!selectedStatus && 'يرجى تحديد الحالة'}
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCloseDialog}
          sx={{
            textTransform: 'none', 
            fontSize: 'small', 
            bgcolor: 'red', 
            color: 'white',
            '&:hover': {
              bgcolor: 'red', 
            },
          }}
        >
          اغلاق
        </Button>
      </DialogActions>
    </>
  )}
</Dialog>



        </Box>
      </ThemeProvider>
  );
};

export default TicketsTable;
