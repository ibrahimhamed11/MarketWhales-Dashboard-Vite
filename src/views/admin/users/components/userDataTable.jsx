// UserDataTable.js
import React, { useEffect, useState } from "react";
import { Box,Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getAllUsers, deleteUser, updateUser,addUser,blockUser } from "../../../../utils/user/users";
import { MaterialReactTable } from "material-react-table";
import Modal from "components/modal/modal";
import { format } from 'date-fns';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star'; // VIP icon
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import 'react-toastify/dist/ReactToastify.css';
import Toast,{ showToast } from '../../../../components/shared/toast'; // Importing showToast function
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
const theme = createTheme(); 




const UserDataTable = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedUserData, setEditedUserData] = useState({
    name: "",
    email: "",
    role: "",
    address:"",
    phone:"",
    tradingExperienceYears:"",
  });


  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        const sortedUsers = users.data.sort(
          (a, b) => new Date(b.registrationDate) - new Date(a.registrationDate)
        );
        setUserData(sortedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);
  
  
  const handleDelete = async (userId) => {
    try {
      const updatedUserData = userData.filter(user => user._id !== userId);
      setUserData(updatedUserData);
      // console.log(`User with ID ${userId} has been deleted`);
      await deleteUser(userId); 
    } catch (error) {
      console.error(`Error deleting user with ID ${userId}:`, error);
    }
  }
  const handleEdit = (userId) => {
    setSelectedUserId(userId);
    setIsEditModalOpen(true);
    const userToEdit = userData.find(user => user._id === userId);
    setEditedUserData({
      // name: userToEdit.name,
      // email: userToEdit.email,
      role: userToEdit.role,
      // address:userToEdit.address,
      // phone:userToEdit.phone,
      // tradingExperienceYears:userToEdit.tradingExperienceYears
    });
  }





  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  }
  const handleUpdateSave = async () => {
    try {
      const updatedUserData = await updateUser(selectedUserId, editedUserData);
      setUserData(userData.map(user =>
        user._id === selectedUserId ? updatedUserData.updatedUser : user
      ));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error(`Error updating user with ID ${selectedUserId}:`, error);
    }
  }
   
  
const handleVIPToggle = async (userId, isVIP) => {
  try {
    const updatedUser = await updateUser(userId, { vip: !isVIP });
    setUserData(userData.map(user =>
      user._id === userId ? updatedUser.updatedUser : user
    ));
    showToast(
      `User ${!isVIP ? 'promoted to' : 'removed from'} VIP successfully!`,
      'success'
    );
  } catch (error) {
    console.error(`Error toggling VIP status for user with ID ${userId}:`, error);
  }
};

  
  const handleSelectChange = (e) => {
    const value = e.target.value;
    setEditedUserData({
      ...editedUserData,
      role: value
    });
  }

  const generateRoleOptions = (currentRole, allRoles) => {
    return [currentRole, ...allRoles.filter(role => role !== currentRole)];
  };

  const handleBlockUser = async (userId, isBlocked) => {
    try {
      const updatedUser = await blockUser(userId, !isBlocked); // Toggle block status
  
      // Update only the `isBlocked` field for the specific user
      setUserData(prevUserData =>
        prevUserData.map(user =>
          user._id === userId
            ? { ...user, isBlocked: !isBlocked } // Update the isBlocked field only
            : user
        )
      );
  
      console.log(`User ${!isBlocked ? 'blocked' : 'unblocked'} successfully!`);
  
      // Display a toast message based on the new block status
      showToast(
        `تم ${!isBlocked ? 'حظر' : 'إلغاء حظر'} هذا العميل بنجاح!`,
        'success'
      );
    } catch (error) {
      console.error(`Error blocking/unblocking user with ID ${userId}:`, error);
    }
  };
  
  
  
  const currentRole = editedUserData.role;
  const allRoles = ["client", "admin", "signalProvider"];
  const roleOptions = generateRoleOptions(currentRole, allRoles);
  
  const inputFields = [
    // {
    //   label: 'Name',
    //   name: 'name',
    //   value: editedUserData.name,
    //   onChange: handleInputChange,
    // },
    // {
    //   label: 'Email',
    //   name: 'email',
    //   value: editedUserData.email,
    //   onChange: handleInputChange,
    // },
    // {
    //   label: 'Address',
    //   name: 'address',
    //   value: editedUserData.address,
    //   onChange: handleInputChange,
    // },
    // {
    //   label: 'phone',
    //   name: 'phone',
    //   value: editedUserData.phone,
    //   onChange: handleInputChange,
    // },
    {

      
      label: 'Role',
      name: 'role',
      value: editedUserData.role,
      onChange: handleSelectChange,
      select: true,
      options:roleOptions
    },
  ];

  const customColumns = [
    {
      header: 'Name',
      accessorKey: 'name',
      size: 30,

    },
    {
      header: 'Email',
      accessorKey: 'email',
      enableClickToCopy: true,
      size: 30,

    },
    {
      header: 'Username',
      accessorKey: 'username',
      size: 30,

    },
    {
      header: 'Date of Birth',
      accessorKey: 'dateOfBirth',
      Cell: ({ cell }) => {
        const dateValue = cell.getValue();
        const date = new Date(dateValue);
  
        // Check if the date is valid
        if (isNaN(date.getTime())) {
          return null; 
        }
  
        return format(date, 'dd/MM/yyyy'); 
      },
    },
    {
      header: 'Phone',
      accessorKey: 'phone',
      size: 30,
      Cell: ({ cell }) => `+${cell.getValue()}`,  // Add + symbol before the phone number
    },
    {
      header: 'Address',
      accessorKey: 'address',
    },
    {
      header: 'Role',
      accessorKey: 'role',
      size: 30,

    },
    {
      header: "VIP Status",
      accessorKey: "vip",
      Cell: ({ cell }) => (
          cell.getValue() ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />
      ), // Show checkmark if VIP
  },

  {
    header: 'Actions',
    accessorKey: 'actions',
    size: 180,
    Cell: ({ row }) => {
      const isBlocked = row.original.isBlocked || false;
      const isVIP = row.original.vip;
  
      return (
        <>
          {/* Toggle VIP Status Action */}
          <IconButton 
            color={isVIP ? 'primary' : 'warning'} 
            onClick={() => handleVIPToggle(row.original._id, isVIP)}
          >
            <StarIcon />
          </IconButton>
  
          {/* Block/Unblock Action */}
          <IconButton 
            color={isBlocked ? 'success' : 'error'}
            onClick={() => handleBlockUser(row.original._id, isBlocked)}
          >
            {isBlocked ? <LockOpenIcon /> : <LockIcon />}
          </IconButton>
  
          {/* Delete Action */}
          <IconButton color="error" onClick={() => handleDelete(row.original._id)}>
            <DeleteIcon />
          </IconButton>
  
          {/* Edit Action */}
          <IconButton color="secondary" onClick={() => handleEdit(row.original._id)}>
            <EditIcon />
          </IconButton>
        </>
      );
    },
  },
  

    {
      header: 'Trading Experience (Years)',
      accessorKey: 'tradingExperienceYears',
      size: 30,

    },
    {
      header: 'Registration Date',
      accessorKey: 'registrationDate',
      size: 30,

      Cell: ({ cell }) => {
        const date = new Date(cell.getValue());
        return format(date, 'dd/MM/yyyy'); // Display formatted date

      },
    },
    
    {
      header: 'IP Address',
      accessorKey: 'ipAddress',
      enableClickToCopy: true,
      size: 30,

    },
    {
      header: 'Location',
      accessorKey: 'location',
      size: 30,

      Cell: ({ row }) => {
        const { city, region, country } = row.original.location;
        return `${city}, ${region}, ${country}`;
      },
    },
    {
      header: 'User Id',
      accessorKey: '_id',
      enableClickToCopy: true,
      size: 30,

    },
  
  ];
  return (
    <ThemeProvider theme={theme}>
                  <Toast position="top-right" autoClose={3000} closeButton={false} />

      <Box >
        <MaterialReactTable
          columns={customColumns}
          data={userData}
          loading={loading}
          state={{
            isLoading: loading
          }}
        />
      </Box>
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleUpdateSave}
        inputFields={inputFields}
        modalName="Edit User" 
      />
    </ThemeProvider>
  );
};

export default UserDataTable;
