export const submitContactForm = async (payload) => {
  const apiUrl = process.env.NEXT_PUBLIC_CONTACT_API_URL?.trim();
  
  if (!apiUrl) {
    throw new Error('CONTACT_API_NOT_CONFIGURED');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout

  try {
    const response = await fetch(apiUrl, {
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
      console.error(`Contact API request failed with status: ${error.status}`);
      throw error;
    }
    
    // Abort errors or network failures
    if (error.name === 'AbortError') {
      console.error('Contact API request timed out.');
      throw new Error('NETWORK_TIMEOUT');
    }
    
    // Failed to fetch or CORS blocked (TypeError)
    if (error instanceof TypeError) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`Configured Contact API URL: ${apiUrl}`);
      }
      console.error('Contact API could not be reached.');
      throw new Error('NETWORK_UNREACHABLE');
    }
    
    console.error('Contact API network request failed', error.message || error);
    throw error;
  }
};
