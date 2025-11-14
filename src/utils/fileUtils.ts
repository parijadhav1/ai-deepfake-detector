
export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // result is "data:mime/type;base64,the_base_64_string"
      // we need to remove the prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
