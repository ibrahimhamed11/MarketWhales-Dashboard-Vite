import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Tooltip,

} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CommentIcon from "@mui/icons-material/Comment";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getAll, deleteCompetition, deleteComment } from "../../../../utils/competitions/competitions";
import { format } from "date-fns";
import AddCompetition from "./AddCompetition";
import { MaterialReactTable } from "material-react-table";
import Toast, { showToast } from "../../../../components/shared/toast";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";


const theme = createTheme({
  typography: {
    fontFamily: "DroidArabic, sans-serif",
  },
});

const CompetitionsTable = () => {
  const [competitionData, setCompetitionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompetitionId, setSelectedCompetitionId] = useState(null);
  const [selectedCompetition, setSelectedCompetition] = useState(null); // For update
  const [selectedComments, setSelectedComments] = useState([]);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const competitions = await getAll();
        setCompetitionData(competitions);
      } catch (error) {
        console.error("Error fetching competitions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompetitions();
  }, []);

  const handleDeleteCompetition = async (competitionId) => {
    try {
      await deleteCompetition(competitionId);
      showToast("تم حذف المسابقه بنجاح", "success");
      setCompetitionData((prevData) => prevData.filter((competition) => competition._id !== competitionId));
    } catch (error) {
      console.error("Error deleting competition:", error);
      showToast("فشل في حذف المسابقه", "error");
    }
  };

  const handleShowComments = (competitionId, comments) => {
    setSelectedCompetitionId(competitionId);
    setSelectedComments(comments);
    setIsCommentModalOpen(true);
  };

  const handleDeleteComment = async (competitionId, commentId) => {
    try {
      await deleteComment(competitionId, commentId);
      showToast("تم حذف التعليق بنجاح", "success");
      setCompetitionData((prevData) =>
        prevData.map((competition) =>
          competition._id === competitionId
            ? { ...competition, comments: competition.comments.filter((c) => c._id !== commentId) }
            : competition
        )
      );
      setSelectedComments((prevComments) => prevComments.filter((c) => c._id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
      showToast("فشل في حذف التعليق", "error");
    }
  };

  const handleEditCompetition = (competition) => {
    setSelectedCompetition(competition);
    setIsModalOpen(true);
  };
  const handleCopyUserId = (userId) => {
    navigator.clipboard.writeText(userId);
  };
  const customColumns = [
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Details",
      accessorKey: "details",
    },
    {
      header: "Status",
      accessorKey: "status",
    },
    {
      header: "Start Date",
      accessorKey: "startDate",
      Cell: ({ cell }) => {
        const dateValue = cell.getValue();
        const date = new Date(dateValue);
        return isNaN(date.getTime()) ? null : format(date, "dd/MM/yyyy");
      },
    },
    {
      header: "End Date",
      accessorKey: "endDate",
      Cell: ({ cell }) => {
        const dateValue = cell.getValue();
        const date = new Date(dateValue);
        return isNaN(date.getTime()) ? null : format(date, "dd/MM/yyyy");
      },
    },
    {
      header: "Actions",
      id: "actions",
      enableSorting: false,
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: "0.5rem" }}>
          <IconButton color="primary" onClick={() => handleEditCompetition(row.original)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDeleteCompetition(row.original._id)}>
            <DeleteIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleShowComments(row.original._id, row.original.comments)}
          >
            <CommentIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box >
        <Toast position="top-right" autoClose={3000} closeButton={false} />

        <MaterialReactTable
          columns={customColumns}
          data={competitionData}
          loading={loading}
          state={{ isLoading: loading }}
          renderTopToolbarCustomActions={() => (
            <Button color="secondary" onClick={() => setIsModalOpen(true)} variant="contained">
              اضف مسابقه جديد
            </Button>
          )}
        />

        <AddCompetition
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCompetition(null); // Reset selected competition
          }}
          onSuccess={(response) => {
            if (selectedCompetition) {
              // Update existing competition
              setCompetitionData((prevData) =>
                prevData.map((competition) =>
                  competition._id === selectedCompetition._id ? response.competition : competition
                )
              );
              showToast("تم تحديث المسابقه بنجاح", "success");
            } else {
              // Add new competition
              setCompetitionData((prevData) => [response.competition, ...prevData]);
              showToast("تم اضافة المسابقه بنجاح", "success");
            }
          }}
          competition={selectedCompetition} // Pass competition for update
        />



<Dialog open={isCommentModalOpen} onClose={() => setIsCommentModalOpen(false)}>
  <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>التعليقات</DialogTitle>
  <DialogContent>
    {selectedComments.length > 0 ? (
      <List>
        {selectedComments.map((comment) => (
          <ListItem key={comment._id} divider sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            {/* Comment Text */}

            <ListItemText
              primary={
                <Typography variant="body1" fontWeight="bold">
                  {comment.userId.name}
                </Typography>
              }
        
            />

            <ListItemText
              primary={
                <Typography variant="body1" >
                  {comment.comment || "لا يوجد تعليق"}
                </Typography>
              }
        
            />

            {/* User ID with Copy Button */}
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <Typography variant="body1" sx={{ color: "gray", mr: 1 }}>
                User id : {comment.userId._id}
              </Typography>
              <Tooltip title="نسخ رقم المستخدم">
                <IconButton size="small" onClick={() => handleCopyUserId(comment.userId._id)}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Delete Button */}
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                color="error"
                onClick={() => handleDeleteComment(selectedCompetitionId, comment._id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    ) : (
      <Box sx={{ textAlign: "center", padding: "16px" }}>
        <Typography variant="body1" color="textSecondary">
          لا توجد تعليقات
        </Typography>
      </Box>
    )}
  </DialogContent>
</Dialog>;
      </Box>
    </ThemeProvider>
  );
};

export default CompetitionsTable;