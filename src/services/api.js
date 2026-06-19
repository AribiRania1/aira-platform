export const predictImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const response = await fetch(`${apiBase}/api/predict`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Prediction failed');
  }

  return response.json();
};
