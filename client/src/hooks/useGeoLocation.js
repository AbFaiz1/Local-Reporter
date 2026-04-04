import { useCallback, useEffect, useState } from "react";

const defaultCoordinates = {
  lat: "",
  lng: ""
};

export default function useGeoLocation(autoRequest = true) {
  const [coordinates, setCoordinates] = useState(defaultCoordinates);
  const [loading, setLoading] = useState(autoRequest);
  const [error, setError] = useState("");

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      position => {
        setCoordinates({
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6)
        });
        setLoading(false);
      },
      () => {
        setError("Location access was denied. Enter coordinates manually if needed.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    if (autoRequest) {
      requestLocation();
    } else {
      setLoading(false);
    }
  }, [autoRequest, requestLocation]);

  return {
    coordinates,
    setCoordinates,
    loading,
    error,
    requestLocation
  };
}
