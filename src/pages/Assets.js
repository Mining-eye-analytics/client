import "../styles/assets.scss";
import { useState, useEffect } from "react";
import customAxios from "../utils/customAxios";

const Assets = ({ mode, setAssetsError }) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [currentDeviationImageBlob, setCurrentDeviationImageBlob] = useState();

  useEffect(() => {
    setImageLoading(true);
    customAxios({
      method: "GET",
      url: "/analytics" + window.location.pathname,
      responseType: "arraybuffer",
    })
      .then((res) => {
        let blob = new Blob([res.data], {
          type: res.headers["content-type"],
        });
        var reader = new window.FileReader();
        reader.readAsDataURL(blob);
        reader.onload = function () {
          var imageDataUrl = reader.result;
          setCurrentDeviationImageBlob(imageDataUrl);
        };
      })
      .catch((err) => {
        console.log(err);
        setAssetsError(true);
      })
      .finally(() => setImageLoading(false));
  }, []);

  return (
    <div
      className={
        "assets d-flex justify-content-center align-items-center" +
        (mode === "light" ? " assets-light" : " assets-dark")
      }
    >
      {imageLoading === false ? (
        <img className="w-100 h-100" src={currentDeviationImageBlob} alt="" />
      ) : (
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assets;
