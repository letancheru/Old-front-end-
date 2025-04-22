import Swal from 'sweetalert2';

export const showSuccessAlert = (message: string) => {
  return Swal.fire({
    title: 'Success!',
    text: message,
    icon: 'success',
    confirmButtonText: 'OK',
    confirmButtonColor: '#1B4486',
  });
};

export const showErrorAlert = (error: any) => {
  const message = error.response?.data?.message || error.message || 'An error occurred';
  
  return Swal.fire({
    title: 'Error!',
    text: message,
    icon: 'error',
    confirmButtonText: 'OK',
    confirmButtonColor: '#1B4486',
  });
};

export const showLoadingAlert = (message: string = 'Loading...') => {
  return Swal.fire({
    title: message,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
}; 