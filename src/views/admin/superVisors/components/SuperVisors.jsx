import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Chip,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  getAllPermissions,
  addPermissions,
} from "../../../../utils/primissions/primissions";
import { MaterialReactTable } from "material-react-table";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import "react-toastify/dist/ReactToastify.css";
import Toast, { showToast } from "../../../../components/shared/toast"; // Importing showToast function
import Autocomplete from "@mui/material/Autocomplete";
import { Permissions } from "staticData/Permissions";



const theme = createTheme();
const SuperVisors = () => {
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);

  useEffect(() => {
    getAllPermissions()
      .then((response) => {
        setPermissions(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching permissions:", error);
        setLoading(false);
      });
  }, []);

  const handleEditClick = (row) => {
    setSelectedUser(row.original); // Set the entire user object
    setUserPermissions(row.original.permissions);
    setOpenEditModal(true);
  };

  const handleModalClose = () => {
    setOpenEditModal(false);
    setUserPermissions([]);
  };

  const handleSavePermissions = async () => {
    try {
      await addPermissions(selectedUser._id, userPermissions);
      showToast("Permissions updated successfully", "success");

      setPermissions((prevPermissions) =>
        prevPermissions.map((permission) =>
          permission._id === selectedUser._id
            ? { ...permission, permissions: userPermissions }
            : permission
        )
      );

      handleModalClose();
    } catch (error) {
      console.error("Error updating permissions:", error);
      showToast("Error updating permissions");
    }
  };

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
      header: "Permissions",
      accessorKey: "permissions",
      size: 50,
      Cell: ({ cell }) => (
        <div>
          {cell.getValue()?.map((permission, index) => (
            <Chip
              key={index}
              label={permission || "N/A"}
              style={{ margin: "2px" }}
            />
          ))}
        </div>
      ),
    },

    {
      header: "Actions",
      accessorKey: "actions",
      size: 180,
      Cell: ({ row }) => (
        <>
          <IconButton
            color="error"
          >
            {/* <DeleteIcon /> */}
          </IconButton>
          <IconButton color="secondary" onClick={() => handleEditClick(row)}>
            <EditIcon />
          </IconButton>
        </>
      ),
    },
    {
      header: "User Id",
      accessorKey: "_id",
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
          data={permissions}
          loading={loading}
          state={{
            isLoading: loading,
          }}
        />
      </Box>

      <Dialog
        open={openEditModal}
        onClose={handleModalClose}
        maxWidth="sm"
        fullWidth 
        PaperProps={{
          style: {
            width: "400px", 
            margin: "auto",
          },
        }}
      >
        <DialogTitle>Edit Permissions for {selectedUser?.name}</DialogTitle>
        <DialogContent>
          <Autocomplete
            multiple
            options={Permissions}
            getOptionLabel={(option) => option.name}
            value={userPermissions
              .map(
                (name) =>
                  Permissions.find((perm) => perm.name === name) || null
              )
              .filter(Boolean)}
            onChange={(event, newValue) => {
              setUserPermissions(newValue.map((option) => option.name));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Select Permissions"
                placeholder="Add permissions"
                style={{ marginTop: "16px", width: "100%" }}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option.name}
                  {...getTagProps({ index })}
                />
              ))
            }
          />
        </DialogContent>
        <DialogActions style={{ marginTop: "16px" }}>
          <Button
            onClick={handleModalClose}
            color="secondary"
            variant="contained"
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSavePermissions}
            color="secondary"
            variant="contained"
            sx={{ textTransform: "none" }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default SuperVisors;
