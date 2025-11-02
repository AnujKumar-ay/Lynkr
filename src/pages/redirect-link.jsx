// RedirectLink.jsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../hooks/use-fetch';
import { getLongUrl } from '../db/apiUrls';
import { BarLoader } from 'react-spinners';
import { storeClicks } from '../db/apiClicks';

const RedirectLink = () => {
  const { id } = useParams();
  const { loading, data, fn } = useFetch(getLongUrl, id);

  useEffect(() => {
    const redirect = async () => {
      await fn(); // fetch long URL first
    };
    redirect();
  }, []);

  useEffect(() => {
    const handleRedirect = async () => {
      if (!loading && data) {
        // console.log("Starting click store...");
        // Wait for clicks to store before redirecting
        await storeClicks({ id: data.id });
        // console.log("Click stored successfully!");
        window.location.href = data.original_url; // redirect after DB insert
      }
    };

    handleRedirect();
  }, [loading, data]);

  if (loading) {
    return (
      <>
        <BarLoader width={"100%"} color="#36d7b7" />
        <br />
        Redirecting ....
      </>
    );
  }

  return null;
};

export default RedirectLink;
