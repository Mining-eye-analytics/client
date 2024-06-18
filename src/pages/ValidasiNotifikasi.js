import "../styles/validasi_notifikasi.scss";
import Validation from "../components/Validation";
import { useState, useEffect } from "react";
import customAxios from "../utils/customAxios";
import ReactImageMagnify from "react-magnify-image";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentNotification } from "../redux/notificationSlice";
import { ReactComponent as AkarIconsChevronUp } from "../assets/iconify/akar-icons--chevron-up.svg";
import { ReactComponent as AkarIconsChevronDown } from "../assets/iconify/akar-icons--chevron-down.svg";
import { ReactComponent as MdiCctv } from "../assets/iconify/mdi--cctv.svg";
import { ReactComponent as AkarIconsClock } from "../assets/iconify/akar-icons--clock.svg";
import { ReactComponent as Fa6SolidHelmetSafety } from "../assets/iconify/fa6-solid--helmet-safety.svg";
import { ReactComponent as CodiconNote } from "../assets/iconify/codicon--note.svg";

const ValidasiNotifikasi = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.general.mode);

  const notificationList = useSelector((state) => state.notification.list);
  const currentNotification = useSelector(
    (state) => state.notification.current
  );
  const cctvList = useSelector((state) => state.cctv.list);
  const userList = useSelector((state) => state.user.list);

  const [currentDeviationImageBlob, setCurrentDeviationImageBlob] = useState();
  const [currentDeviationImageLoading, setCurrentDeviationImageLoading] =
    useState(false);

  useEffect(() => {
    if (currentNotification !== undefined) {
      setCurrentDeviationImageLoading(true);
      customAxios({
        method: "GET",
        url:
          "/analytics/" +
          currentNotification?.path +
          currentNotification?.image,
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
        .catch((err) => console.log(err))
        .finally(() => {
          setCurrentDeviationImageLoading(false);
        });
    }
  }, [currentNotification?.id]);

  const notificationControllerArray = notificationList.map(
    (notification, index) => {
      if (currentNotification?.id === notification.id) {
        return (
          <div key={notification.id} className="d-grid gap-3">
            <button
              className={
                "border-0 rounded-2" + (index === 0 ? " disabled" : "")
              }
              onClick={() => {
                index !== 0
                  ? dispatch(
                      setCurrentNotification(notificationList[index - 1])
                    )
                  : dispatch(setCurrentNotification(notificationList[index]));
              }}
            >
              <AkarIconsChevronUp className="icon" />
            </button>
            <button
              className={
                "border-0 rounded-2" +
                (index === notificationList.length - 1 ? " disabled" : "")
              }
              onClick={() => {
                index !== notificationList.length - 1
                  ? dispatch(
                      setCurrentNotification(notificationList[index + 1])
                    )
                  : dispatch(setCurrentNotification(notificationList[index]));
              }}
            >
              <AkarIconsChevronDown className="icon" />
            </button>
          </div>
        );
      }
    }
  );

  return (
    <div
      className={
        "validasi-notifikasi" +
        (mode === "light"
          ? " validasi-notifikasi-light"
          : " validasi-notifikasi-dark")
      }
    >
      <div className="title mb-3">
        <h6>Validasi Notifikasi</h6>
        <label>Validasi notifikasi deviasi yang terdeteksi</label>
      </div>
      <div className="content">
        <div>
          {currentNotification !== undefined ? (
            <div>
              {currentDeviationImageLoading === false ? (
                <div className="d-flex justify-content-center">
                  <ReactImageMagnify
                    className="deviation-img rounded-2"
                    {...{
                      smallImage: {
                        alt: "",
                        isFluidWidth: true,
                        src: currentDeviationImageBlob,
                      },
                      largeImage: {
                        src: currentDeviationImageBlob,
                        width: 2000,
                        height: 1100,
                      },
                      enlargedImagePosition: "over",
                    }}
                  />
                </div>
              ) : (
                <div className="d-flex justify-content-center">
                  <div className="spinner-border">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
              <div className="mt-3">
                <div
                  key={currentNotification?.id}
                  className="notification-data"
                >
                  <div className="row align-items-center">
                    <div className="col">
                      <label
                        className={
                          "px-3 my-1 rounded-2" +
                          (currentNotification?.type_validation === "true"
                            ? " status-true"
                            : currentNotification?.type_validation === "false"
                            ? " status-false"
                            : " status-none")
                        }
                      >
                        {currentNotification?.type_validation === "not_yet"
                          ? "Belum Divalidasi"
                          : currentNotification?.type_validation === "true"
                          ? "Valid"
                          : "Tidak Valid"}
                      </label>
                    </div>
                    <div className="col">
                      <Validation />
                    </div>
                  </div>
                  <div className="row m-0">
                    <div className="col p-0">
                      <div className="my-3">
                        <h6>
                          Terdeteksi Deviasi {currentNotification?.type_object}
                        </h6>
                      </div>
                      <div className="row">
                        <div className="col d-grid gap-2">
                          <div className="d-flex gap-2">
                            <MdiCctv className="icon" />
                            <label>
                              {cctvList.map((cctv) => {
                                return cctv.id === currentNotification.cctv_id
                                  ? cctv.name + " - " + cctv.location
                                  : "";
                              })}
                            </label>
                          </div>
                          <div className="d-flex gap-2">
                            <AkarIconsClock className="icon" />
                            <label>{currentNotification?.created_at}</label>
                          </div>
                        </div>
                        {currentNotification?.type_validation !== "not_yet" ? (
                          <div className="col d-grid gap-2">
                            <div className="d-flex gap-2">
                              <Fa6SolidHelmetSafety className="icon" />
                              <label>
                                {userList.map((user) => {
                                  return user.id === currentNotification.user_id
                                    ? user.full_name
                                    : "";
                                })}
                              </label>
                            </div>
                            <div className="d-flex gap-2">
                              <CodiconNote className="icon" />
                              <label>
                                {currentNotification?.comment?.substring(
                                  0,
                                  24
                                ) +
                                  (currentNotification?.comment?.length > 24
                                    ? "..."
                                    : "")}
                              </label>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className="col-1 p-0 d-flex justify-content-end align-items-center mt-3">
                      <div className="notification-navigation">
                        {notificationControllerArray}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-center">
              <label className="not-yet-notification">
                Pilih notifikasi deviasi pada List Notifikasi
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValidasiNotifikasi;
