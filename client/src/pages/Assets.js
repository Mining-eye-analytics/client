import "../styles/assets.scss";
import { useState, useEffect } from "react";
import axios from "axios";

const Assets = ({ mode, setAssetsError }) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [currentDeviationImageBlob, setCurrentDeviationImageBlob] = useState();

  useEffect(() => {
    setImageLoading(true);
    axios
      .get(
        window.location.protocol +
          "//" +
          (window.location.hostname === "localhost"
            ? "10.10.10.66"
            : window.location.hostname) +
          ":" +
          process.env.REACT_APP_API_PORT +
          "/api" +
          window.location.pathname,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          responseType: "arraybuffer",
        }
      )
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
