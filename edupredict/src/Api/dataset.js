import axios from "axios";

// Create Axios instance
const dataset = axios.create({
 baseURL: "http://localhost:8000/api/datasets", // Updated base URL here
  headers: {
    "Content-Type": "application/json",
  },
});


/* ----------------------------- DATASETS API ------------------------------- */

/** Upload CSV to MongoDB */
export const uploadDataset = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await dataset.post(`/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data; // { message, dataset }
};

/** Get datasets (optional size filter: 'small' | 'medium' | 'large') */
export const getDatasets = async (size) => {
  const query = size ? `?size=${encodeURIComponent(size)}` : "";
  const res = await dataset.get(`${query}`);
  return res.data; // array of datasets
};

/** Delete one dataset by id */
export const deleteDatasetApi = async (id) => {
  const res = await dataset.delete(`/${id}`);
  return res.data;
};

/** Download CSV (returns Blob) */
export const downloadDatasetApi = async (id) => {
  const res = await dataset.get(`/${id}/download`, {
    responseType: "blob",
  });
  return res; // use headers to get filename if needed
};

/* --------------------------- Helper: trigger save ------------------------- */
/** Browser me file download trigger karein with original file name */
export const triggerBlobDownload = (blob, fallbackName = "dataset.csv", headers = {}) => {
  // Try extracting filename from Content-Disposition
  let filename = fallbackName;
  const cd = headers["content-disposition"] || headers["Content-Disposition"];
  if (cd && cd.includes("filename=")) {
    const m = cd.match(/filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i);
    if (m && m[1]) filename = decodeURIComponent(m[1]);
  }

  const url = window.URL.createObjectURL(new Blob([blob]));
  const a = document.createElement("a");
  a.href = url;
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

export default dataset;
