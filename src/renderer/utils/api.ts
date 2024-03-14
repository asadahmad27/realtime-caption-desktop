import axios from "axios";
import { ipcRenderer } from 'electron';

let envVariablesValue: any = null; // Define a variable to store the event value


const envVariablesPromise = new Promise(resolve => {
  window.electron.ipcRenderer.on('env-variables', (event, arg) => {
    console.log("envi variabless=======", event);
    if (event !== null) {
      envVariablesValue = event;
      resolve(event);
    }
  });
});


export const getEnvVariablesValue = () => envVariablesPromise;

export const updateBookReadCount = async (bookId: string) => {
  try {
    const baseUrl = await getEnvVariablesValue(); // Wait for the promise to resolve
    const response = await axios.post(`${baseUrl}/api/users`, { book: bookId });
    return response;
  } catch (error) {
    console.error('Error updating book read count:', error);
    throw error; // Throw the error to handle it wherever this function is called
  }
};

export const getBookReadCount = async (bookId: string) => {
  try {
    const baseUrl = await getEnvVariablesValue(); // Wait for the promise to resolve
    const response = await axios.get(`${baseUrl}/api/users?bookId=${bookId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching book counts:', error);
    throw error; // Throw the error to handle it wherever this function is called
  }
};
