import React, { useEffect, useState } from "react";
import { Box, IconButton, Button, Modal } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility"; // Import Visibility icon
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getAllCompanies, deleteCompany, updateCompany, addCompany, getAllReviews,deleteReview } from "../../../../utils/companies/companies";
import AddCompanyModal from './addCompany'; 
import { MaterialReactTable } from "material-react-table";
import { ToastContainer } from 'react-toastify';
import { showToast } from '../../../../components/shared/toast';
import 'react-toastify/dist/ReactToastify.css';
import "./comapnies.css";
import ReviewsModal from './ReviewsModal'; // Import ReviewsModal

const theme = createTheme({
  typography: {
    fontFamily: "DroidArabic, sans-serif",
  },
});

const CoursesTable = () => {
  const [companiesData, setCompaniesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editCompanyData, setEditCompanyData] = useState({
    companyName: "",
    averageRate: 0,
  });

  const [reviewsData, setReviewsData] = useState([]);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [CompanyId, setCompanyId] = useState('');

  const handleDelete = async (companyId) => {
    try {
      await deleteCompany(companyId);
      showToast('تم حذف الشركه بنجاح', 'success');

      const updatedCompaniesData = companiesData.filter(company => company._id !== companyId);
      setCompaniesData(updatedCompaniesData);
    } catch (error) {
      console.error(`Error deleting company with ID ${companyId}:`, error);
    }
  };

  const handleEdit = (companyId) => {
    setSelectedCompanyId(companyId);
    setIsModalOpen(true);
    setEditMode(true);
    const companyToEdit = companiesData.find(company => company._id === companyId);
    setEditCompanyData({
      companyName: companyToEdit.companyName,
      averageRate: companyToEdit.averageRate,
    });
  };

  const handleAddNew = () => {
    setIsModalOpen(true);
    setEditMode(false);
    setEditCompanyData({
      companyName: "",
      averageRate: 0,
    });
  };

  const handleSave = async () => {
    try {
      if (editMode) {
        await updateCompany(selectedCompanyId, editCompanyData);
      } else {
        await addCompany(editCompanyData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(`Error ${editMode ? 'updating' : 'adding'} company:`, error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditCompanyData({
      ...editCompanyData,
      [name]: value,
    });
  };

  const handleViewReviews = async (companyId) => {



    try {
      setCompanyId(companyId)
      const response = await getAllReviews(companyId); // Fetch reviews
      if (Array.isArray(response.reviews)) {
        setReviewsData(response.reviews);
      } else {
        setReviewsData([]); // Reset to empty if not an array
      }
      setIsReviewsModalOpen(true);
    } catch (error) {
      console.error(`Error fetching reviews for company ID ${companyId}:`, error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(CompanyId, reviewId); // Delete review
      showToast('تم حذف المراجعة بنجاح', 'success');
      setReviewsData(prevReviews => prevReviews.filter(review => review.reviewId !== reviewId));
      
    } catch (error) {
      console.error(`Error deleting review with ID ${reviewId}:`, error);
    }
  };


  const handleCloseReviewsModal = () => {

    setIsReviewsModalOpen(false);
setCompanyId("")
  };



  useEffect(() => {
    getAllCompanies()
      .then((companies) => {
        setCompaniesData(companies);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching companies:", error);
        setLoading(false);
      });
  }, []);

  const customColumns = [
    {
      header: "اسم الشركه",
      accessorKey: "companyName",
      enableClickToCopy: true,
    },
    {
      header: "معدل التقييمات",
      accessorKey: "averageRate",
      Cell: ({ row }) => {
        return row.original.averageRate.toFixed(2);
      },
    },
    {
      header: "اجراء",
      accessorKey: "actions",
      Cell: ({ row }) => (
        <>
          <IconButton onClick={() => handleDelete(row.original._id)} color="error">
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => {
            handleEdit(row.original._id);
          }} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleViewReviews(row.original._id)} color="info">
            <VisibilityIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box >
        <MaterialReactTable
          columns={customColumns}
          data={companiesData}
          loading={loading}
          state={{ isLoading: loading }}
          renderTopToolbarCustomActions={() => (
            <Button
              color="secondary"
              onClick={handleAddNew}
              variant="contained"
              sx={{ textTransform: "none" }}
            >
              اضافة شركه جديده
            </Button>
          )}
        />
      </Box>

      <ToastContainer />

      <AddCompanyModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        companyId={selectedCompanyId}
        onSave={handleSave}
        companyData={editCompanyData}
        onInputChange={handleInputChange}
        editMode={editMode}
        onCancel={() => {
          setIsModalOpen(false);
          setEditMode(false);
        }}
      />

      <ReviewsModal
        open={isReviewsModalOpen}
        onClose={() => handleCloseReviewsModal()}
        reviews={reviewsData}
        onDeleteReview={handleDeleteReview}
        companyId={selectedCompanyId} // Pass companyId for delete
      />
    </ThemeProvider>
  );
};

export default CoursesTable;
