export const submitContactForm = async (payload) => {
  const apiUrl = process.env.NEXT_PUBLIC_CONTACT_API_URL;
  
  if (!apiUrl) {
    throw new Error('CONTACT_API_NOT_CONFIGURED');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout

  try {
    const response = await fetch(`${apiUrl}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      // Throw with the entire payload so we can handle validation/rate limits in the component
      throw { status: response.status, data };
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Pass through structured errors
    if (error.status) {
      throw error;
    }
    
    // Abort errors or network failures
    if (error.name === 'AbortError') {
      throw new Error('NETWORK_TIMEOUT');
    }
    
    throw error;
  }
};
