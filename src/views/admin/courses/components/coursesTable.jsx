// CoursesTable.js
import React, { useEffect, useState } from "react";
import { Box, IconButton, Button, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PreviewIcon from "@mui/icons-material/Preview";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  getAllcourses,
  deletecourse,
  updateCourse,
  addcourse,
} from "../../../../utils/courses/courses";
import { MaterialReactTable } from "material-react-table";
import Modal from "components/modal/modal";
import { API_URL } from "../../../../utils/axios";
import "./courses.css";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';


const theme = createTheme({
  typography: {
    fontFamily: "DroidArabic, sans-serif",
  },
});
const CoursesTable = () => {
  const [courseData, setcourseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoursId, setSelectedCoursId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editCourseData, setEditCourseData] = useState({
    name: "",
    description: "",
    image: null,
    type: "",
    price: "",
    playlistId: "",
    vip:false,
    startgie:false,
    courseType: "",

  });
  const [newcourseData, setnewcourseData] = useState({
    name: "",
    description: "",
    image: null,
    type: "",
    price: "",
    playlistId: "",
    vip:false,
    startgie:false,

    courseType: "",

    ownerId: "613ea5c5c695a34fe06d6cf5",
  });

  const handleDelete = async (courseId) => {
    try {
      const updatedUserData = courseData.filter(
        (course) => course._id !== courseId
      );
      setcourseData(updatedUserData);
      await deletecourse(courseId);
    } catch (error) {
      console.error(`Error deleting user with ID ${courseId}:`, error);
    }
  };




  //-----------------------------Edit-------------------------------


  const handleEdit = (courseId) => {
    setSelectedCoursId(courseId);
    setIsEditModalOpen(true);

    const courseToEdit = courseData.find((course) => course._id === courseId);
    if (courseToEdit) {
      setEditCourseData({
        name: courseToEdit.name,
        description: courseToEdit.description,
        image: courseToEdit.image,
        type: courseToEdit.type,
        vip: courseToEdit.vip ? "true" : "false", 
        startgie: courseToEdit.startgie ? "true" : "false", 
        courseType: courseToEdit.courseType,
        price: courseToEdit.price,
        playlistId: courseToEdit.playlistId,
      });
      setImagePreview(courseToEdit.image);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "type" && value === "Free") {
      setEditCourseData((prevState) => ({
        ...prevState,
        [name]: value,
        price: "0", 
      }));
    } else {
   
      setEditCourseData({
        ...editCourseData,
        [name]: value,
      });
    }
  };
  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "price" ? parseFloat(value) : value;
    setnewcourseData({
      ...newcourseData,
      [name]: newValue,
    });
  };
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };
  const handleAddImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setnewcourseData((prevState) => ({
        ...prevState,
        image: file,
      }));
      setImagePreview(fileURL);
    }
  };
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };
  const handleSaveAddModal = async () => {
    try {
      const response = await addcourse(newcourseData);
      const newCourse = response.course; // Accessing the course directly from response
      setcourseData((prevCourseData) => [...prevCourseData, newCourse]); // Updating courseData
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };
  const handleEditImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setEditCourseData((prevState) => ({
        ...prevState,
        image: file,
      }));
      setNewImagePreview(fileURL);
    }
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);

    setNewImagePreview(null);


  };
  const handleSave = async () => {
    try {
        const response = await updateCourse(selectedCoursId, editCourseData);
        const updatedCourseData = { ...response.data }; // Assuming your response structure includes the updated course

        // Update the course data state
        setcourseData((prevCourseData) =>
            prevCourseData.map((course) =>
                course._id === selectedCoursId ? updatedCourseData : course
            )
        );

        // Close the edit modal
        setIsEditModalOpen(false);
        // Clear the edit course data
        setEditCourseData({
            name: "",
            description: "",
            image: null,
            type: "",
            price: "",
            playlistId: "",
            vip: false,
            startgie: false,
            courseType: "",
        });
    } catch (error) {
        console.error(`Error updating course with ID ${selectedCoursId}:`, error);
    }
};

  useEffect(() => {
    getAllcourses()
      .then((courses) => {
        setcourseData(courses);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  //-------------------------------------------------------------------
  const courseType = ["Free", "Paid"];
  const vipOption = ["true", "false"];
  const departmentOption=["forex", "saudimarket","whalesfamily"];

  const typeOption = [...courseType];




  const editFields = [
    {
      label: "الاسم", // Name
      name: "name",
      value: editCourseData.name,
      onChange: handleInputChange,
    },
    {
      label: "الوصف", // Description
      name: "description",
      value: editCourseData.description,
      onChange: handleInputChange,
    },
    {
      label: "النوع", // Type
      name: "type",
      value: editCourseData.type,
      onChange: (e) => {
        const newValue = e.target.value;
        setEditCourseData((prevState) => ({
          ...prevState,
          type: newValue,
        }));
      },
      select: true,
      options: typeOption,
    },
    
    {
      label: "VIP", // Type
      name: "vip",
      select: true,
      value: editCourseData.vip,
      onChange: (event) =>
        setEditCourseData((prevState) => ({
          ...prevState,
          vip: event.target.value === "true", // Convert the string to a boolean
        })),
      options: vipOption,
    },

    {
      label: "Startgie", // Type
      name: "startgie",
      select: true,
      value: editCourseData.startgie,
      onChange: (event) =>
        setEditCourseData((prevState) => ({
          ...prevState,
          startgie: event.target.value === "true", // Convert the string to a boolean
        })),
      options: vipOption,
    },
    {
      label: "القسم", // Type
      name: "courseType",
      select: true,
      value: editCourseData.courseType,
      onChange: (event) =>
        setEditCourseData((prevState) => ({
          ...prevState,
          courseType: event.target.value,
        })),
      options: departmentOption,
    }
    









    

    ,{
      label: "السعر", // Price
      name: "price",
      value: editCourseData.price,
      onChange: handleInputChange,
    },
    {
      label: "معرّف القائمة التشغيلية", // Playlist ID
      name: "playlistId",
      value: editCourseData.playlistId,
      onChange: handleInputChange,
    },
  ];

  const addInputFields = [
    {
      label: "اسم الكورس", // Course Name
      name: "name",
      value: newcourseData.name,
      onChange: handleAddInputChange,
    },
    {
      label: "الوصف", // Description
      name: "description",
      value: newcourseData.description,
      onChange: handleAddInputChange,
    },
    {
      label: "النوع", // Type
      name: "type",
      select: true,
      value: newcourseData.type,
      onChange: (event) =>
        setnewcourseData((prevState) => ({
          ...prevState,
          type: event.target.value,
        })),
      options: courseType,
    },



    {
      label: "VIP", // Type
      name: "vip",
      select: true,
      value: newcourseData.vip,
      onChange: (event) =>
        setnewcourseData((prevState) => ({
          ...prevState,
          vip: event.target.value === "true", 
        })),
      options: vipOption,
    },
    
    {
      label: "Startgie", // Type
      name: "startgie",
      select: true,
      value: newcourseData.startgie,
      onChange: (event) =>
        setnewcourseData((prevState) => ({
          ...prevState,
          startgie: event.target.value === "true", // Convert the string to a boolean
        })),
      options: vipOption,
    },


    {
      label: "القسم", 
      name: "courseType",
      select: true,
      value: newcourseData.courseType,
      onChange: (event) =>
        setnewcourseData((prevState) => ({
          ...prevState,
          courseType: event.target.value,
        })),
      options: departmentOption,
    },



    ...(newcourseData.type === "Paid"
      ? [
          {
            label: "السعر", // Price ($)
            name: "price",
            value: newcourseData.price,
            onChange: handleAddInputChange,
            render: () => (
              <input
                type="text"
                value={`$${newcourseData.price || ""}`}
                onChange={(e) => {
                  const value = e.target.value.replace("$", "");
                  setnewcourseData((prevState) => ({
                    ...prevState,
                    price: value,
                  }));
                }}
              />
            ),
          },
        ]
      : []),
    {
      label: "معرّف القائمة التشغيلية", // PlaylistId
      name: "playlistId",
      value: newcourseData.playlistId,
      onChange: handleAddInputChange,
    },
  ];









  const tableColoums = [
    {
      header: "اسم الكورس", 
      accessorKey: "name",
      enableClickToCopy: true,
    },

    {
      header:"عدد مرات البيع", 
      accessorKey: "totalSalesCount",
      enableClickToCopy: true,
    },
    {
      header: "اجمالي عائد المبيعات",
      accessorKey: "totalSalesRevenue",
      enableClickToCopy: true,
      Cell: ({ cell }) => `$${cell.getValue()}`,
    },
    

    {
      header: "الوصف", // Description
      accessorKey: "description",
      enableClickToCopy: true,
    },
    {
      header: "النوع", // Type
      accessorKey: "type",
      enableClickToCopy: true,
    },
    {
      header: "السعر", // Price
      accessorKey: "price",
      Cell: ({ cell }) => {
        const priceValue = cell.getValue(); // Get the value of the price
        return <span>$ {priceValue}</span>; // Format it with a dollar sign
      },
    },
    {
      header: "معرّف القائمة التشغيلية", // PlaylistId
      accessorKey: "playlistId",
      enableClickToCopy: true,
    },
    {
      header: "الإجراءات", // Actions
      accessorKey: "actions",
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
          <IconButton
            color="secondary"
            onClick={() => {
              // Open user course view in new tab
              window.open(`/user/course/${row.original._id}`, '_blank');
            }}
            title="View as User"
          >
            <PreviewIcon />
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
  },
    
  {
    header: "Startgie",
    accessorKey: "startgie",
    Cell: ({ cell }) => (
        cell.getValue() ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />
    ), // Show checkmark if VIP
},
    {
      header: "القسم", 
      accessorKey: "courseType",
    
    },

  ];

  //-------------------------------------------------------------------

  return (
    <ThemeProvider theme={theme}>
      <Box pt={{ xs: "130px", md: "80px", xl: "80px" }} px={{ xs: 1, sm: 1 }}>
      <MaterialReactTable
                columns={tableColoums}
                data={courseData}
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
                  اضف كورس
                </Button>
                )}
            />
      </Box>

      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSave}
        inputFields={editFields}
        imagePicker={
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleEditImageChange}
            />
            <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
              {/* Conditionally display current image if no new image is uploaded */}
              {!newImagePreview && editCourseData.image && (
                <div>
                  <Typography variant="caption">Current Image</Typography>
                  <img
                    src={`${API_URL}/media/${editCourseData.image}`} // Current image URL
                    alt="Current Course"
                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                  />
                </div>
              )}

              {/* Display new uploaded image */}
              {newImagePreview && (
                <div>
                  <Typography variant="caption">New Image</Typography>
                  <img
                    src={newImagePreview} // New image preview
                    alt="New Preview"
                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                  />
                </div>
              )}
            </div>
          </>
        }
        modalName="Edit Course"
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveAddModal}
        inputFields={addInputFields}
        imagePicker={
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleAddImageChange}
            />

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  marginTop: "10px",
                }}
              />
            )}
          </>
        }
        modalName="Add Course"
      />
    </ThemeProvider>
  );
};

export default CoursesTable;
