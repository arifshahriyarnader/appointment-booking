import { useEffect, useState } from "react";
import {
  userRegistrationRequest,
  userRegistrationRequestUpdate,
} from "../../api/services/admin/adminServices";

export function useViewRegistrationRequest() {
  const [requests, setRequests] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    title: "",
    description: "",
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState({ id: null, status: "" });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await userRegistrationRequest();
      setRequests(data.userRequest || []);
    } catch (error) {
      console.log(error);
      setAlertMessage({
        title: "Error",
        description: "Failed to fetch registration requests",
      });
      setAlertOpen(true);
    }
  };

  const showConfirmation = (id, status) => {
    setCurrentAction({ id, status });
    setAlertMessage({
      title: "Confirm Action",
      description: `Are you sure you want to mark this registration request as ${status}?`,
      variant: "default",
      showCancel: true,
    });
    setConfirmOpen(true);
  };

  const handleUpdateStatus = async () => {
    try {
      await userRegistrationRequestUpdate(currentAction.id, {
        status: currentAction.status,
      });
      fetchRequests();
      setAlertMessage({
        title: "Success",
        description: `Registration Request ${currentAction.status} successfully`,
        variant: "success",
      });
      setAlertOpen(true);
    } catch (error) {
      console.log(error);
      setAlertMessage({
        title: "Error",
        description: "Failed to update registration request",
        variant: "destructive",
      });
      setAlertOpen(true);
    } finally {
      setConfirmOpen(false);
    }
  };
  return {
    requests,
    alertOpen,
    setAlertOpen,
    alertMessage,
    confirmOpen,
    setConfirmOpen,
    showConfirmation,
    handleUpdateStatus,
  };
}
