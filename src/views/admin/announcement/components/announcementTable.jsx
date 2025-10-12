import React, { useEffect, useState } from "react";
import { Box, IconButton, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  addAnnouncement,
  deleteAnnouncement,
  getAllAnnouncements,
  updateAnnouncement,
} from "../../../../utils/announcement/announcement";
import { MaterialReactTable } from "material-react-table";
import Modal from "components/modal/modal";
import "./announcement.css";
import 'react-toastify/dist/ReactToastify.css';
import Toast, { showToast } from '../../../../components/shared/toast';

const theme = createTheme({
  typography: {
    fontFamily: "DroidArabic, sans-serif",
  },
});

const AnnouncementTable = () => {
  const [announcementData, setAnnouncementData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [editAnnouncementData, setEditAnnouncementData] = useState({
    message: "",
    timeToShowInSeconds: 0,
    enabled: true,
    image: null,
  });

  const [newAnnouncementData, setNewAnnouncementData] = useState({
    message: "",
    timeToShowInSeconds: 0,
    enabled: true,
    image: null,
  });

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const announcements = await getAllAnnouncements();
        setAnnouncementData(announcements);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const handleDelete = async (announcementId) => {
    try {
      await deleteAnnouncement(announcementId);
      showToast('تم حذف الاعلان بنجاح', 'success');
      setAnnouncementData((prevData) =>
        prevData.filter((announcement) => announcement._id !== announcementId)
      );
    } catch (error) {
      console.error(`Error deleting announcement:`, error);
      showToast('فشل في حذف الاعلان', 'error');
    }
  };

  const handleEdit = (announcementId) => {
    const announcementToEdit = announcementData.find(
      (announcement) => announcement._id === announcementId
    );
    if (announcementToEdit) {
      setEditAnnouncementData({
        message: announcementToEdit.message,
        timeToShowInSeconds: announcementToEdit.timeToShowInSeconds,
        enabled: announcementToEdit.enabled,
        image: null, // Set to null, you'll update this if the user selects a new image
      });
      setSelectedAnnouncementId(announcementId);
      setIsEditModalOpen(true);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditAnnouncementData({ message: "", timeToShowInSeconds: 0, enabled: true, image: null });
  };

  const handleSave = async () => {
    try {
      const updatedAnnouncement = await updateAnnouncement(
        selectedAnnouncementId,
        editAnnouncementData,
        editAnnouncementData.image // Pass the image file here
      );

      showToast('تم تعديل الاعلان بنجاح', 'success');

      setAnnouncementData((prevData) =>
        prevData.map((announcement) =>
          announcement._id === selectedAnnouncementId
            ? updatedAnnouncement
            : announcement
        )
      );
      setIsEditModalOpen(false);
      setEditAnnouncementData({ message: "", timeToShowInSeconds: 0, enabled: true, image: null }); // Reset form
    } catch (error) {
      console.error(`Error updating announcement with ID ${selectedAnnouncementId}:`, error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setEditAnnouncementData((prevState) => ({ ...prevState, [name]: newValue }));
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewAnnouncementData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleEditImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setEditAnnouncementData((prevState) => ({
        ...prevState,
        image: file, // Update the image in the state
      }));
    }
  };

  const handleSaveAddModal = async () => {
    try {
      const newAnnouncement = await addAnnouncement(newAnnouncementData, newAnnouncementData.image);
      showToast('تم اضافة الاعلان بنجاح', 'success');
      setAnnouncementData((prevData) => [...prevData, newAnnouncement]);
      setIsAddModalOpen(false);
      setNewAnnouncementData({ message: "", timeToShowInSeconds: 0, enabled: true, image: null });
    } catch (error) {
      console.error("Error adding announcement:", error);
      showToast('فشل في اضافة الاعلان', 'error');
    }
  };

  const customColumns = [
    {
      header: "نص الرساله",
      accessorKey: "message",
    },
    {
      header: "مدة ظهور الاعلان بالثواني",
      accessorKey: "timeToShowInSeconds",
    },
    {
      header: "Actions",
      accessorKey: "actions",
      Cell: ({ row }) => (
        <>
          <IconButton onClick={() => handleDelete(row.original._id)} color="error">
            <DeleteIcon />
          </IconButton>
          <IconButton color="primary" onClick={() => handleEdit(row.original._id)}>
            <EditIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box >
        <Toast position="top-right" autoClose={3000} closeButton={false} />
        <MaterialReactTable
          columns={customColumns}
          data={announcementData}
          loading={loading}
          renderTopToolbarCustomActions={() => (
            <Button color="secondary" onClick={() => setIsAddModalOpen(true)} variant="contained">
              اضف اعلان جديد
            </Button>
          )}
        />
      </Box>
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSave}
        inputFields={[
          { label: "نص الرساله", name: "message", value: editAnnouncementData.message, onChange: handleInputChange },
          { label: "مدة ظهور الاعلان بالثواني", name: "timeToShowInSeconds", value: editAnnouncementData.timeToShowInSeconds, onChange: handleInputChange },
        ]}
        imagePicker={<input type="file" accept="image/*" onChange={handleEditImageChange} />}
        modalName="Edit Announcement"
      />
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveAddModal}
        inputFields={[
          { label: "نص الرساله", name: "message", value: newAnnouncementData.message, onChange: handleAddInputChange },
          { label: "مدة ظهور الاعلان بالثواني", name: "timeToShowInSeconds", value: newAnnouncementData.timeToShowInSeconds, onChange: handleAddInputChange },
        ]}
        imagePicker={<input type="file" accept="image/*" onChange={(e) => setNewAnnouncementData(prev => ({ ...prev, image: e.target.files[0] }))} />}
        modalName="Add Announcement"
      />
    </ThemeProvider>
  );
};

export default AnnouncementTable;
