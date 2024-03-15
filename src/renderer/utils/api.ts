import axios from "axios";
import { ipcRenderer } from 'electron';
import { PUBLIC_BASE_URL } from "../redux/store";

let envVariablesValue: any = null; // Define a variable to store the event value
// export const PUBLIC_BASE_URL: string | undefined = PUBLIC_BASE_URL;
// export const PUBLIC_BASE_URL: string | undefined = '';

// const envVariablesPromise = new Promise(resolve => {
//   window.electron.ipcRenderer.on('env-variables', (event, arg) => {
//     console.log("envi variabless=======", event);
//     if (event !== null) {
//       envVariablesValue = event;
//       resolve(event);
//     }
//   });
// });


// export const getEnvVariablesValue = () => envVariablesPromise;

export const updateBookReadCount = async (bookId: string) => {
  try {
    const response = await axios.post(`${PUBLIC_BASE_URL}/api/users`, { book: bookId });
    return response;
  } catch (error) {
    console.error('Error updating book read count:', error);
    throw error; // Throw the error to handle it wherever this function is called
  }
};

export const getBookReadCount = async (bookId: string) => {
    try {
        const response = await axios.get(`${PUBLIC_BASE_URL}/api/users?bookId=${bookId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching book counts:', error);
        throw error; // Throw the error to handle it wherever this function is called
    }
};
