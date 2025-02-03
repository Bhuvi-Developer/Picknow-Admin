import axiosInstance from './axiosInstance';

export const vendorApi = {
  // Get all vendors
  getAllVendors: () => {
    return axiosInstance.get('/vendors');
  },

  // Get single vendor by ID
  getVendorById: (id) => {
    return axiosInstance.get(`/vendors/${id}`);
  },

  // Create new vendor
  createVendor: (vendorData) => {
    const formData = new FormData();
    Object.keys(vendorData).forEach(key => {
      if (key === 'image' && vendorData[key] instanceof File) {
        formData.append('image', vendorData[key]);
      } else {
        formData.append(key, vendorData[key]);
      }
    });
    return axiosInstance.post('/vendors', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update vendor
  updateVendor: (id, vendorData) => {
    const formData = new FormData();
    Object.keys(vendorData).forEach(key => {
      if (key === 'image' && vendorData[key] instanceof File) {
        formData.append('image', vendorData[key]);
      } else {
        formData.append(key, vendorData[key]);
      }
    });
    return axiosInstance.put(`/vendors/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete vendor
  deleteVendor: (id) => {
    return axiosInstance.delete(`/vendors/${id}`);
  },

  // Vendor login
  loginVendor: (credentials) => {
    return axiosInstance.post('/vendors/login', credentials);
  },

  // Update vendor status
  updateVendorStatus: (id, status) => {
    return axiosInstance.patch(`/vendors/${id}/status`, { status });
  },

  // Update vendor KYC status
  updateVendorKYC: (id, kycStatus) => {
    return axiosInstance.patch(`/vendors/${id}/kyc`, { kycStatus });
  },

  // Get vendor statistics
  getVendorStats: (id) => {
    return axiosInstance.get(`/vendors/${id}/stats`);
  },

  // Upload vendor documents
  uploadDocuments: (id, documents) => {
    const formData = new FormData();
    Object.keys(documents).forEach(key => {
      if (documents[key] instanceof File) {
        formData.append(key, documents[key]);
      }
    });
    return axiosInstance.post(`/vendors/${id}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get vendor documents
  getDocuments: (id) => {
    return axiosInstance.get(`/vendors/${id}/documents`);
  },

  // Update vendor bank details
  updateBankDetails: (id, bankDetails) => {
    return axiosInstance.patch(`/vendors/${id}/bank-details`, bankDetails);
  },

  // Get vendor products
  getVendorProducts: (id) => {
    return axiosInstance.get(`/vendors/${id}/products`);
  },

  // Get vendor orders
  getVendorOrders: (id, params) => {
    return axiosInstance.get(`/vendors/${id}/orders`, { params });
  }
}; 
