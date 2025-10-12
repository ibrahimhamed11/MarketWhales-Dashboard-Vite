import React, { useEffect, useState } from "react";
import { Box, IconButton, Button, TextField, Modal, CircularProgress } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getAllTradingProducts, deleteTradingProduct, updateTradingProduct, createTradingProduct } from "../../../../utils/tradingtools/tradingtools";
import { MaterialReactTable } from "material-react-table";
import CustomModal from "components/CustomModal";
import "./tradingtools.css";
import "react-toastify/dist/ReactToastify.css";
import Toast, { showToast } from "../../../../components/shared/toast";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const theme = createTheme({
  typography: {
    fontFamily: "DroidArabic, sans-serif",
  },
});

const TradingtoolsTable = () => {
  const [tradingProducts, setTradingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageSliderData, setImageSliderData] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [updatedProductData, setUpdatedProductData] = useState({
    productName: "",
    productDescription: "",
    productPrice: "",
    productLink: "",
    productDepartment: "",
    productVideoLink: "",
  });
  const [newProductData, setNewProductData] = useState({
    productName: "",
    productDescription: "",
    productPrice: "",
    productLink: "",
    productDepartment: "",
    productVideoLink: "",
    productImages: [],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getAllTradingProducts();
        setTradingProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    try {
      await deleteTradingProduct(productId);
      showToast("تم حذف المنتج بنجاح", "success");
      setTradingProducts((prevData) =>
        prevData.filter((product) => product._id !== productId)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
      showToast("فشل في حذف المنتج", "error");
    }
  };

  const handleEdit = (productId) => {
    const productToEdit = tradingProducts.find((product) => product._id === productId);
    setCurrentProduct(productToEdit);
    setUpdatedProductData({
      productName: productToEdit.productName,
      productDescription: productToEdit.productDescription,
      productPrice: productToEdit.productPrice,
      productLink: productToEdit.productLink,
      productDepartment: productToEdit.productDepartment,
      productVideoLink: productToEdit.productVideoLink,
    });
    setEditModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await updateTradingProduct(currentProduct._id, updatedProductData);
      showToast("تم تحديث المنتج بنجاح", "success");
      setTradingProducts((prevData) =>
        prevData.map((product) =>
          product._id === currentProduct._id ? { ...product, ...updatedProductData } : product
        )
      );
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating product:", error);
      showToast("فشل في تحديث المنتج", "error");
    }
  };

  const handleAddProduct = async () => {
    try {
      if (!newProductData.productName || !newProductData.productPrice) {
        throw new Error("Product name and price are required.");
      }

      const formData = new FormData();
      formData.append("productName", newProductData.productName);
      formData.append("productDescription", newProductData.productDescription);
      formData.append("productPrice", newProductData.productPrice);
      formData.append("productLink", newProductData.productLink);
      formData.append("productDepartment", newProductData.productDepartment);
      formData.append("productVideoLink", newProductData.productVideoLink);

      if (newProductData.productImages && newProductData.productImages.length > 0) {
        newProductData.productImages.forEach((file) => {
          formData.append("productImages", file);
        });
      } else {
        throw new Error("No product images provided.");
      }

      await createTradingProduct(formData);
      showToast("تم إضافة المنتج بنجاح", "success");

      setTradingProducts((prevData) => [...prevData, newProductData]);
      setAddModalOpen(false);
    } catch (error) {
      console.error("Error adding product:", error);
      showToast("فشل في إضافة المنتج", "error");
    }
  };

  const openImageModal = (images) => {
    setImageSliderData(images || []);
    setIsImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
    setImageSliderData([]);
  };

  const handleImageChange = (event) => {
    const files = event.target.files;
    if (files) {
      const images = Array.from(files).map((file) => URL.createObjectURL(file));
      setNewProductData({ ...newProductData, productImages: images });
    }
  };

  const customColumns = [
    {
      header: "اسم المنتج",
      accessorKey: "productName",
    },
    {
      header: "وصف المنتج",
      accessorKey: "productDescription",
    },
    {
      header: "رابط المنتج",
      accessorKey: "productLink",
    },
    {
      header: "القسم",
      accessorKey: "productDepartment",
    },
    {
      header: "رابط الفيديو",
      accessorKey: "productVideoLink",
    },
    {
      header: "سعر المنتج",
      accessorKey: "productPrice",
    },
    {
      header: "تاريخ الإضافة",
      accessorKey: "dateAdded",
      Cell: ({ row }) => (
        <span>{new Date(row.original.dateAdded).toLocaleString()}</span>
      ),
    },
    {
      header: "صور المنتج",
      accessorKey: "productImages",
      Cell: ({ row }) => (
        <Button onClick={() => openImageModal(row.original.productImages)}>
          عرض الصور
        </Button>
      ),
    },
    {
      header: "Actions",
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
          data={tradingProducts}
          loading={loading}
          state={{
            isLoading: loading
          }}
          renderTopToolbarCustomActions={() => (
            <Button
              color="secondary"
              variant="contained"
              onClick={() => setAddModalOpen(true)}
            >
              اضف منتج جديد
            </Button>
          )}
        />
      </Box>

      {/* Modal to display images in slider */}
      <CustomModal
        isOpen={isImageModalOpen}
        onClose={handleCloseImageModal}
        title="صور المنتج"
      >
        <Carousel>
          {imageSliderData && imageSliderData.length > 0 ? (
            imageSliderData.map((image, index) => (
              <div key={index}>
                <img
                  src={`https://market-whales.onrender.com/media/${image}`}
                  alt={`Product Image ${index + 1}`}
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            ))
          ) : (
            <div>No images available</div>
          )}
        </Carousel>
      </CustomModal>

        {/* Edit Product Modal */}
        <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        aria-labelledby="edit-product-modal"
        aria-describedby="edit-product-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "30%",
            height: "50%",
            padding: 3,
            backgroundColor: "white",
            borderRadius: 2,
            overflowY: "auto",
          }}
        >
          <TextField
            label="اسم المنتج"
            fullWidth
            margin="normal"
            value={updatedProductData.productName}
            onChange={(e) =>
              setUpdatedProductData({
                ...updatedProductData,
                productName: e.target.value,
              })
            }
          />
          <TextField
            label="وصف المنتج"
            fullWidth
            margin="normal"
            value={updatedProductData.productDescription}
            onChange={(e) =>
              setUpdatedProductData({
                ...updatedProductData,
                productDescription: e.target.value,
              })
            }
          />
          <TextField
            label="سعر المنتج"
            fullWidth
            margin="normal"
            value={updatedProductData.productPrice}
            onChange={(e) =>
              setUpdatedProductData({
                ...updatedProductData,
                productPrice: e.target.value,
              })
            }
          />
          <TextField
            label="رابط المنتج"
            fullWidth
            margin="normal"
            value={updatedProductData.productLink}
            onChange={(e) =>
              setUpdatedProductData({
                ...updatedProductData,
                productLink: e.target.value,
              })
            }
          />
          <TextField
            label="رابط الفيديو"
            fullWidth
            margin="normal"
            value={updatedProductData.productVideoLink}
            onChange={(e) =>
              setUpdatedProductData({
                ...updatedProductData,
                productVideoLink: e.target.value,
              })
            }
          />

          <Button
            onClick={handleUpdate}
            color="primary"
            variant="contained"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            تحديث المنتج
          </Button>
        </Box>
      </Modal>

      {/* Add Product Modal */}
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        aria-labelledby="add-product-modal"
        aria-describedby="add-product-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "30%",
            height: "60%",
            padding: 3,
            backgroundColor: "white",
            borderRadius: 2,
            overflowY: "auto",
          }}
        >
          <TextField
            label="اسم المنتج"
            fullWidth
            margin="normal"
            value={newProductData.productName}
            onChange={(e) =>
              setNewProductData({
                ...newProductData,
                productName: e.target.value,
              })
            }
          />
          <TextField
            label="وصف المنتج"
            fullWidth
            margin="normal"
            value={newProductData.productDescription}
            onChange={(e) =>
              setNewProductData({
                ...newProductData,
                productDescription: e.target.value,
              })
            }
          />
          <TextField
            label="سعر المنتج"
            fullWidth
            margin="normal"
            value={newProductData.productPrice}
            onChange={(e) =>
              setNewProductData({
                ...newProductData,
                productPrice: e.target.value,
              })
            }
          />
          <TextField
            label="رابط المنتج"
            fullWidth
            margin="normal"
            value={newProductData.productLink}
            onChange={(e) =>
              setNewProductData({
                ...newProductData,
                productLink: e.target.value,
              })
            }
          />
          <TextField
            label="رابط الفيديو"
            fullWidth
            margin="normal"
            value={newProductData.productVideoLink}
            onChange={(e) =>
              setNewProductData({
                ...newProductData,
                productVideoLink: e.target.value,
              })
            }
          />

          {/* Multi-Image Upload */}
          <TextField
            type="file"
            fullWidth
            margin="normal"
            inputProps={{ accept: "image/*", multiple: true }}
            onChange={(e) => {
              const files = e.target.files;
              setNewProductData({
                ...newProductData,
                productImages: Array.from(files), // Store the File objects
              });
            }}
          />

          <Button
            onClick={handleAddProduct}
            color="primary"
            variant="contained"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            إضافة المنتج
          </Button>
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default TradingtoolsTable;
