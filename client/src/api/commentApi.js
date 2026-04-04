import api from "./axios";

export const getIssueComments = async issueId => {
  const { data } = await api.get(`/comments/${issueId}`);
  return data;
};

export const addIssueComment = async payload => {
  const { data } = await api.post("/comments", payload);
  return data;
};
