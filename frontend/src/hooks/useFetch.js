// src/hooks/useFetch.js

import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFetch = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [apiData, setApiData] = useState(null);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/users/profile');
        setApiData(response.data);
      } catch (error) {
        setServerError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { isLoading, apiData, serverError };
};
