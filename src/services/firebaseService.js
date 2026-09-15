import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

/**
 * Submits structured data to a specified Firestore collection.
 * @param {string} collectionName - The name of the Firestore collection (e.g., 'registrations', 'orders').
 * @param {Object} data - The object containing the form data.
 * @returns {Promise<string>} The ID of the newly created document.
 */
export const submitFormData = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * @param {File} file - The file to upload.
 * @param {string} path - The storage path/folder (e.g., 'receipts').
 * @returns {Promise<string>} The download URL of the uploaded file.
 */
export const uploadFile = async (file, path = 'uploads') => {
  if (!file) return null;
  try {
    // Append timestamp to filename to prevent overwriting
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${path}/${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
