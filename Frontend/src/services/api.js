const BASE_URL = "https://nexcode.runasp.net/api";

const getHeaders = (isFormData = false) => {
  const headers = {};
  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Something went wrong");
  }
  return response.json();
};

export const api = {
  // Auth APIs
  auth: {
    hostLogin: (credentials) =>
      fetch(`${BASE_URL}/HostLoginCheck/login`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(credentials),
      }).then(handleResponse),

    hostSignup: (data) =>
      fetch(`${BASE_URL}/HostSignUp/signup`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      }).then(handleResponse),

    participantLogin: (credentials) =>
      fetch(`${BASE_URL}/ParticipantsLoginCheck/login`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(credentials),
      }).then(handleResponse),

    participantSignup: (data) =>
      fetch(`${BASE_URL}/ParticipantsSignUp/Signup`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      }).then(handleResponse),

    participantForgotPassword: (email) =>
      fetch(`${BASE_URL}/ParticipantsForgotPassword/check`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email }),
      }).then(handleResponse),

    participantResetPassword: (data) =>
      fetch(`${BASE_URL}/ParticipantsForgotPassword/reset`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      }).then(handleResponse),

    adminLogin: (credentials) =>
      fetch(`${BASE_URL}/AdminLogin/Login`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(credentials),
      }).then(handleResponse),
  },

  // Host APIs
  host: {
    getProfile: (hostId) =>
      fetch(`${BASE_URL}/HostDashboard/GetProfile/${hostId}`, {
        headers: getHeaders(),
      }).then(handleResponse),

    updateProfile: (formData) =>
      fetch(`${BASE_URL}/HostDashboard/UpdateProfile`, {
        method: "POST",
        headers: getHeaders(true),
        body: formData,
      }).then(handleResponse),

    getMyHackathons: (hostId) =>
      fetch(`${BASE_URL}/HostDashboard/GetMyHackathons/${hostId}`, {
        headers: getHeaders(),
      }).then(handleResponse),

    getDashboardStats: (hostId) =>
      fetch(`${BASE_URL}/HostDashboard/GetDashboardStats/${hostId}`, {
        headers: getHeaders(),
      }).then(handleResponse),

    getApplicants: (hackathonId) =>
      fetch(`${BASE_URL}/HostDashboard/GetApplicants/${hackathonId}`, {
        headers: getHeaders(),
      }).then(handleResponse),

    getAllApplicants: (hostId) =>
      fetch(`${BASE_URL}/HostDashboard/GetAllApplicants/${hostId}`, {
        headers: getHeaders(),
      }).then(handleResponse),

    getNotifications: (hostId) =>
      fetch(`${BASE_URL}/HostDashboard/GetNotifications/${hostId}`, {
        headers: getHeaders(),
      }).then(handleResponse),

    clearNotifications: (hostId) =>
      fetch(`${BASE_URL}/HostDashboard/ClearNotifications/${hostId}`, {
        method: "POST",
        headers: getHeaders(),
      }).then(handleResponse),

    updateWinnerStatus: (payload) =>
      fetch(`${BASE_URL}/HostDashboard/UpdateWinnerStatus`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      }).then(handleResponse),

    updateParticipationStatus: (payload) =>
      fetch(`${BASE_URL}/HostDashboard/UpdateParticipationStatus`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      }).then(handleResponse),

    updateApplicationStatus: (payload) =>
      fetch(`${BASE_URL}/HostDashboard/UpdateApplicationStatus`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      }).then(handleResponse),
  },

  // Participant APIs
  participant: {
    getProfile: (participantId) =>
      fetch(`${BASE_URL}/GetProfileData/GetProfile/${participantId}`, {
        headers: getHeaders(),
      }).then(handleResponse),

    getEditedProfile: (participantId) =>
      fetch(`${BASE_URL}/GetEditedProfileData/GetProfile/${participantId}`, {
        headers: getHeaders(),
      }).then(handleResponse),

    saveProfile: (formData) =>
      fetch(`${BASE_URL}/ParticipantsProfile/SaveProfile`, {
        method: "POST",
        headers: getHeaders(true),
        body: formData,
      }).then(handleResponse),

    getAppliedHackathons: (participantId) =>
      fetch(`${BASE_URL}/ParticipantDashboard/GetAppliedHackathons/${participantId}`, {
        headers: getHeaders(),
      }).then(handleResponse),

    clearNotifications: (participantId) =>
      fetch(`${BASE_URL}/ParticipantDashboard/ClearNotifications/${participantId}`, {
        method: "POST",
        headers: getHeaders(),
      }).then(handleResponse),
  },

  // Hackathon APIs
  hackathons: {
    getAll: () =>
      fetch(`${BASE_URL}/HackathonList/GetAll`, {
        headers: getHeaders(),
      }).then(handleResponse),

    create: (formData) =>
      fetch(`${BASE_URL}/HostHackathon/CreateHackathon`, {
        method: "POST",
        headers: getHeaders(true),
        body: formData,
      }).then(handleResponse),

    delete: (hackathonId) =>
      fetch(`${BASE_URL}/HostHackathon/DeleteHackathon/${hackathonId}`, {
        method: "DELETE",
        headers: getHeaders(),
      }).then(handleResponse),

    toggleBlock: (hackathonId, isBlocked) =>
      fetch(`${BASE_URL}/HostHackathon/ToggleBlockHackathon/${hackathonId}`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(isBlocked),
      }).then(handleResponse),

    apply: (payload) =>
      fetch(`${BASE_URL}/HackathonApplication/Apply`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      }).then(handleResponse),
  },

  // Admin APIs
  admin: {
    getStats: () =>
      fetch(`${BASE_URL}/Admin/Stats`, {
        headers: getHeaders(),
      }).then(handleResponse),

    getParticipants: () =>
      fetch(`${BASE_URL}/Admin/Participants`, {
        headers: getHeaders(),
      }).then(handleResponse),

    getHosts: () =>
      fetch(`${BASE_URL}/Admin/Hosts`, {
        headers: getHeaders(),
      }).then(handleResponse),

    getPendingHosts: () =>
      fetch(`${BASE_URL}/Admin/PendingHosts`, {
        headers: getHeaders(),
      }).then(handleResponse),

    getHackathons: () =>
      fetch(`${BASE_URL}/Admin/Hackathons`, {
        headers: getHeaders(),
      }).then(handleResponse),

    deleteParticipant: (id) =>
      fetch(`${BASE_URL}/Admin/Participant/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      }).then(handleResponse),

    deleteHost: (id) =>
      fetch(`${BASE_URL}/Admin/Host/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      }).then(handleResponse),

    deleteHackathon: (id) =>
      fetch(`${BASE_URL}/Admin/Hackathon/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      }).then(handleResponse),

    blockHost: (id) =>
      fetch(`${BASE_URL}/Admin/BlockHost/${id}`, {
        method: "POST",
        headers: getHeaders(),
      }).then(handleResponse),

    unblockHost: (id) =>
      fetch(`${BASE_URL}/Admin/UnblockHost/${id}`, {
        method: "POST",
        headers: getHeaders(),
      }).then(handleResponse),

    approveHost: (id) =>
      fetch(`${BASE_URL}/Admin/ApproveHost/${id}`, {
        method: "POST",
        headers: getHeaders(),
      }).then(handleResponse),
  },
};
