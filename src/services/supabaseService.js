import { supabase } from '../lib/supabase';

/**
 * Submits structured data to a specified Supabase table.
 * @param {string} tableName - The name of the Supabase table (e.g., 'registrations', 'orders').
 * @param {Object} data - The object containing the form data.
 * @returns {Promise<string>} The ID of the newly created document.
 */
export const submitFormData = async (tableName, data) => {
  try {
    let payload = {};
    if (tableName === 'registrations') {
      payload = {
        current_status: data.currentStatus,
        data: data
      };
    } else {
      payload = { data: data };
    }

    const { data: insertedData, error } = await supabase
      .from(tableName)
      .insert([payload])
      .select('id')
      .single();

    if (error) throw error;
    return insertedData.id;
  } catch (error) {
    console.error(`Error adding document to ${tableName}:`, error);
    throw error;
  }
};

/**
 * Uploads a file to Supabase Storage and returns the public download URL.
 * @param {File} file - The file to upload.
 * @param {string} path - The storage path/folder (e.g., 'receipts', 'cvs').
 * @returns {Promise<string>} The public URL of the uploaded file.
 */
export const uploadFile = async (file, path = 'uploads') => {
  if (!file) return null;
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `${path}/${fileName}`;
    
    // Upload to 'launchpad' bucket
    const { data, error } = await supabase.storage
      .from('launchpad')
      .upload(filePath, file);

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('launchpad')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
