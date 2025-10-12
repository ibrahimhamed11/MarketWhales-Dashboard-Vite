// BlogsTable.js
import React, { useEffect, useState } from "react";
import { Box, IconButton, Button, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  fetchBlogPosts,
  deleteBlogPost,
  updateBlogPost,
  createBlogPost,
  getCommnets,
} from "../../../../utils/blogs/blogs";
import { MaterialReactTable } from "material-react-table";
import Modal from "components/modal/modal";
import { API_URL } from "../../../../utils/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Toast, { showToast } from "../../../../components/shared/toast"; // Importing showToast function
import CommentIcon from "@mui/icons-material/Comment";
import CommentModal from "components/CommentModal";
import "./blogs.css";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const theme = createTheme({
  typography: {
    fontFamily: "DroidArabic, sans-serif",
  },
});

const BlogsTable = () => {
  const [blogsData, setBlogsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false); // State for comment modal
  const [commentsData, setCommentsData] = useState([]); // State for comments

  const [editBlogData, setEditBlogData] = useState({
    title: "",
    content: "",
    image: null,

    vip:false,
    blogType: "",
  });
  const [newBlogData, setNewBlogData] = useState({
    title: "",
    content: "",
    image: null,
    vip:false,
    blogType: "",

    userId: "613ea5c5c695a34fe06d6cf5",
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await fetchBlogPosts();
        setBlogsData(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (blogId) => {
    try {
      const updatedBlogData = blogsData.filter((blog) => blog._id !== blogId);
      setBlogsData(updatedBlogData);
      await deleteBlogPost(blogId);

      showToast("تم حذف المقاله بنجاح", "success");
    } catch (error) {
      console.error(`Error deleting blog with ID ${blogId}:`, error);
    }
  };

  const handleEdit = (blogId) => {
    setSelectedBlogId(blogId);
    setIsEditModalOpen(true);

    const blogToEdit = blogsData.find((blog) => blog._id === blogId);
    if (blogToEdit) {
      setEditBlogData({
        title: blogToEdit.title,
        content: blogToEdit.content,
        blogType:blogToEdit.blogType,
        vip:blogToEdit.vip,
        image: blogToEdit.image,
      });

      setImagePreview(blogToEdit.image);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditBlogData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewBlogData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleAddImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setNewBlogData((prevState) => ({
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
      const response = await createBlogPost(newBlogData);
      showToast("تم اضافة المقاله بنجاح", "success");

      const newBlog = response;
      setBlogsData((prevBlogsData) => [...prevBlogsData, newBlog]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding blog:", error);
    }
  };

  const handleEditImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setEditBlogData((prevState) => ({
        ...prevState,
        image: file,
      }));
      setNewImagePreview(fileURL);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setNewImagePreview(null);
    setEditBlogData({
      title: "",
      content: "",
      image: null,
    });
  };

  const handleSave = async () => {
    try {
      const response = await updateBlogPost(selectedBlogId, editBlogData);
      showToast("تم التعديل بنجاح", "success");

      const updatedBlogData = { ...response };
      setNewImagePreview(null);

      setBlogsData((prevBlogsData) =>
        prevBlogsData.map((blog) =>
          blog._id === selectedBlogId ? updatedBlogData : blog
        )
      );

      setIsEditModalOpen(false);
    } catch (error) {
      console.error(`Error updating blog with ID ${selectedBlogId}:`, error);
    }
  };
  const vipOption = ["true", "false"];
  const departmentOption=["forex", "saudimarket","whalesfamily"];

  const editFields = [


    
    {
      label: "VIP", // Type
      name: "vip",
      select: true,
      value: editBlogData.vip,

      onChange: (event) =>
        setEditBlogData((prevState) => ({
          ...prevState,
          vip: event.target.value === "true", // Convert the string to a boolean
        })),
      options: vipOption,
    },
    {
      label: "Department", // Type
      name: "blogType",
      select: true,
      value: editBlogData.blogType,

      onChange: (event) =>
        setEditBlogData((prevState) => ({
          ...prevState,
          blogType: event.target.value,
        })),
      options: departmentOption,
    },


    {
      label: "عنوان المقاله",
      name: "title",
      value: editBlogData.title,
      onChange: handleInputChange,
    },
    {
      label: "محتوي المقاله",
      name: "content",
      value: editBlogData.content,
      onChange: handleInputChange,
    },
  ];

  const addInputFields = [


    
    {
      label: "VIP", // Type
      name: "vip",
      select: true,
      onChange: (event) =>
        setNewBlogData((prevState) => ({
          ...prevState,
          vip: event.target.value === "true", // Convert the string to a boolean
        })),
      options: vipOption,
    },
    {
      label: "Department", // Type
      name: "blogType",
      select: true,
      onChange: (event) =>
        setNewBlogData((prevState) => ({
          ...prevState,
          blogType: event.target.value,
        })),
      options: departmentOption,
    },

    

    {
      label: "عنوان المقاله",
      name: "title",
      value: newBlogData.title,
      onChange: handleAddInputChange,
    },
    {
      label: "محتوي المقاله",
      name: "content",
      value: newBlogData.content,
      onChange: handleAddInputChange,
    },
  ];

  const tableColumns = [
    {
      header: "عنوان المقاله",
      accessorKey: "title",
      enableClickToCopy: true,
      Cell: ({ cell }) => cell.getValue() || "No title available", // Fallback if title is undefined
    },
    // {
    //   header: "Content",
    //   accessorKey: "content",
    //   enableClickToCopy: true,
    //   Cell: ({ cell }) => cell.getValue() || "No content available", // Fallback if content is undefined
    // },
    {
      header: "عدد التعليقات",
      accessorKey: "comments",
      Cell: ({ row }) => (
        <Typography>{row.original.comments.length} </Typography>
      ),
    },
    {
      header: "عدد التفاعلات",
      accessorKey: "reactions",
      Cell: ({ row }) => (
        <Typography>{row.original.reactions.length} </Typography>
      ),
    },
    {
      header: "اجراء",
      accessorKey: "actions",
      Cell: ({ row }) => (
        <>
          <IconButton
            onClick={() => handleDelete(row.original._id)}
            color="error"
            disabled={!row.original._id}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            onClick={() => handleEdit(row.original._id)}
            color="primary"
            disabled={!row.original._id}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleShowComments(row.original._id)} // Show comments on click
            color="info"
            disabled={!row.original._id}
          >
            <CommentIcon />
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
      accessorKey: "blogType",
      maxSize: 3,

    
    },


  ];

  const handleShowComments = async (blogId) => {
    try {
      const comments = await getCommnets(blogId);
      setCommentsData(comments.comments); // Store the comments in state
      setIsCommentModalOpen(true); // Open the comment modal
    } catch (error) {
      console.error(
        `Error fetching comments for blog with ID ${blogId}:`,
        error
      );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box >
        <Toast position="top-right" autoClose={3000} closeButton={false} />

        <MaterialReactTable
          columns={tableColumns}
          data={blogsData}
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
              اضافة مقاله
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
              {!newImagePreview && editBlogData.image && (
                <div>
                  <Typography variant="caption">Current Image</Typography>
                  <img
                    src={`${API_URL}/media/${editBlogData.image}`} // Current image URL
                    alt="Current Blog"
                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                  />
                </div>
              )}
              {newImagePreview && (
                <div>
                  <Typography variant="caption">New Image</Typography>
                  <img
                    src={newImagePreview} // New image preview
                    alt="New Blog"
                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                  />
                </div>
              )}
            </div>
          </>
        }
      />
      <CommentModal
        isOpen={isCommentModalOpen}
        handleClose={() => setIsCommentModalOpen(false)}
        comments={commentsData}
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
              <div>
                <Typography variant="caption">Preview Image</Typography>
                <img
                  src={imagePreview} // Image preview for the new blog
                  alt="New Blog"
                  style={{ maxWidth: "100%", maxHeight: "200px" }}
                />
              </div>
            )}
          </>
        }
      />
      <ToastContainer />
    </ThemeProvider>
  );
};

export default BlogsTable;
