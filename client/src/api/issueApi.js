import api from "./axios";

export const getNearbyIssues = async params => {
  const { data } = await api.get("/issue/nearby", { params });
  return data;
};

export const getIssueById = async issueId => {
  const { data } = await api.get(`/issue/${issueId}`);
  return data;
};

export const createIssue = async formData => {
  const { data } = await api.post("/issue", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return data;
};

export const toggleIssueUpvote = async issueId => {
  const { data } = await api.post("/issue/upvote", { issueId });
  return data;
};

export const getMyIssues = async () => {
  const { data } = await api.get("/issue/mine");
  return data;
};
