// Simple mock API for previewing the UI without network calls
export const mockApi = {
  register: (userData) => {
    // Simulate a short delay and resolve successfully
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 300);
    });
  },
};
