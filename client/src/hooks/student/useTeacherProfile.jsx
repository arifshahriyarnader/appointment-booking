import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTeacherProfile } from "../../api/services/studentServices";

export const useTeacherProfile = () => {
  const { teacherId } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [availableHours, setAvailableHours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherProfile = async () => {
      setLoading(true);
      try {
        const data = await getTeacherProfile(teacherId);
        if (data) {
          setTeacher(data.teacher);
          setAvailableHours(data.availableHours);
        }
      } catch (error) {
        console.error("Error fetching teacher profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherProfile();
  }, [teacherId]);

  return { teacher, availableHours, loading };
};
