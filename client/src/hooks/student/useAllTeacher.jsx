import { getAllTeachersList } from "@/api/services/studentServices";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useAllTeacher = ({ searchResults } = {}) => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchResults || searchResults.length === 0) {
      const fetchTeachers = async () => {
        setLoading(true);
        try {
          const response = await getAllTeachersList();
          setTeachers(response.teacher || []);
        } catch (error) {
          console.error("Error fetching teachers:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchTeachers();
    } else {
      setTeachers(searchResults);
      setLoading(false);
    }
  }, [searchResults]);

  const handleViewProfile = (teacherId) => {
    navigate(`/teacher-profile/${teacherId}`);
  };

  return { teachers, loading, handleViewProfile };
};
