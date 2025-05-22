import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTeachersList } from "../../api/services/studentServices";

export const useAllTeacher = ({ searchResults } = {}) => {
  const [teachers, setTeachers] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchResults || searchResults.length === 0) {
      const fetchTeachers = async (page) => {
        setLoading(true);
        try {
          const response = await getAllTeachersList(page, 5);
          setTeachers(response.teacher || []);
          setTotalPages(response.totalPages || 1);
        } catch (error) {
          console.error("Error fetching teachers:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchTeachers(currentPage);
    } else {
      setTeachers(searchResults);
      setLoading(false);
    }
  }, [searchResults, currentPage]);

  const handleViewProfile = (teacherId) => {
    navigate(`/teacher-profile/${teacherId}`);
  };

  return { teachers,currentPage,totalPages,setCurrentPage, loading, handleViewProfile };
};
