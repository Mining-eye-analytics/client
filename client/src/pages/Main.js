import "../styles/main.scss";
import Cctv from "../components/Cctv";
import LiveMonitoring from "./LiveMonitoring";
import ValidasiNotifikasi from "./ValidasiNotifikasi";
import Notification from "../components/Notification";
import DatabaseDeviasi from "./DatabaseDeviasi";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import socketIOClient from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { setMode, setPage } from "../redux/generalSlice";
import { getCctvList, addDeviationIndicatedCctv } from "../redux/cctvSlice";
import {
  getNotificationList,
  addSocketNotification,
  setNotificationLimit,
  reloadNotification,
  addNotificationChild,
  addNotificationChildUnique,
} from "../redux/notificationSlice";
import {
  getDeviationList,
  setCurrentDeviation,
  setDeviationCurrentDate,
  setTablePageDataLimit,
  setCurrentTablePage,
} from "../redux/deviationSlice";

const Main = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.general.mode);
  const page = useSelector((state) => state.general.page);

  const notificationCurrentCctv = useSelector(
    (state) => state.notification.currentCctv
  );
  const currentObject = useSelector((state) => state.object.current);
  const currentValidationStatus = useSelector(
    (state) => state.validationStatus.current
  );
  const notificationLimit = useSelector((state) => state.notification.limit);
  const submit = useSelector((state) => state.notification.submit);
  const reload = useSelector((state) => state.notification.reload);
  const alarmSound = useSelector((state) => state.notification.alarmSound);
  const deviationIndicatedCctv = useSelector(
    (state) => state.cctv.deviationIndicatedCctv
  );
  const audio = new Audio(require("../assets/notification.mp3"));

  const deviationCurrentCctv = useSelector(
    (state) => state.deviation.currentCctv
  );
  const deviationCurrentObject = useSelector(
    (state) => state.deviation.currentObject
  );
  const deviationCurrentValidationStatus = useSelector(
    (state) => state.deviation.currentValidationStatus
  );
  const deviationCurrentDate = useSelector(
    (state) => state.deviation.currentDate
  );
  const deviationCurrentTime = useSelector(
    (state) => state.deviation.currentTime
  );

  const [date, setDate] = useState([new Date(), new Date()]);

  useEffect(() => {
    dispatch(getCctvList());
  }, []);

  useEffect(() => {
    dispatch(getNotificationList());
  }, [
    notificationCurrentCctv,
    currentObject,
    currentValidationStatus,
    submit,
    reload === true ? notificationLimit : notificationCurrentCctv,
  ]);

  // socket.io
  const socket = socketIOClient(
    window.location.protocol +
      "//" +
      (window.location.hostname === "localhost"
        ? "10.10.10.66"
        : window.location.hostname) +
      ":" +
      process.env.REACT_APP_API_PORT,
    {
      transports: ["polling"],
      cors: {
        origin: "*",
      },
    }
  );

  useEffect(() => {
    socket.on("message_from_server", (data) => newNotifHandler(data));
    if (socket.connected === false) {
      console.log(socket);
    }

    return () => {
      socket.off("message_from_server");
    };
  }, [
    notificationCurrentCctv,
    currentObject,
    currentValidationStatus,
    reload,
    notificationLimit,
    alarmSound,
    deviationIndicatedCctv,
  ]);

  const newNotifHandler = (newNotif) => {
    newNotif.map((notification) => {
      if (
        currentValidationStatus === "All" ||
        currentValidationStatus === "Butuh Validasi"
      ) {
        if (notification.parent_id === null) {
          if (notificationCurrentCctv !== 0) {
            if (notificationCurrentCctv.toString() === notification.cctv_id) {
              if (currentObject === "All") {
                dispatch(addSocketNotification(notification));
                dispatch(reloadNotification(false));
                dispatch(setNotificationLimit(notificationLimit + 1));
                if (alarmSound === true) {
                  audio.play();
                }
              } else {
                if (currentObject === notification.type_object) {
                  dispatch(addSocketNotification(notification));
                  dispatch(reloadNotification(false));
                  dispatch(setNotificationLimit(notificationLimit + 1));
                  if (alarmSound === true) {
                    audio.play();
                  }
                }
              }
            } else {
              if (!deviationIndicatedCctv.includes(notification.cctv_id)) {
                dispatch(addDeviationIndicatedCctv(notification.cctv_id));
              }
            }
          } else {
            if (currentObject === "All") {
              dispatch(addSocketNotification(notification));
              dispatch(reloadNotification(false));
              dispatch(setNotificationLimit(notificationLimit + 1));
              if (alarmSound === true) {
                audio.play();
              }
            } else {
              if (currentObject === notification.type_object) {
                dispatch(addSocketNotification(notification));
                dispatch(reloadNotification(false));
                dispatch(setNotificationLimit(notificationLimit + 1));
                if (alarmSound === true) {
                  audio.play();
                }
              }
            }
            if (!deviationIndicatedCctv.includes(notification.cctv_id)) {
              dispatch(addDeviationIndicatedCctv(notification.cctv_id));
            }
          }
        } else {
          if (notificationCurrentCctv !== 0) {
            if (notificationCurrentCctv.toString() === notification.cctv_id) {
              if (currentObject === "All") {
                if (notification.type_object !== "HD") {
                  dispatch(addNotificationChild(notification));
                } else {
                  dispatch(addSocketNotification(notification));
                  dispatch(reloadNotification(false));
                  dispatch(setNotificationLimit(notificationLimit + 1));
                  if (alarmSound === true) {
                    audio.play();
                  }
                }
              } else {
                if (currentObject === notification.type_object) {
                  dispatch(addNotificationChildUnique(notification));
                }
              }
            }
          } else {
            if (currentObject === "All") {
              if (notification.type_object !== "HD") {
                dispatch(addNotificationChild(notification));
              } else {
                dispatch(addSocketNotification(notification));
                dispatch(reloadNotification(false));
                dispatch(setNotificationLimit(notificationLimit + 1));
                if (alarmSound === true) {
                  audio.play();
                }
              }
            } else {
              if (currentObject === notification.type_object) {
                dispatch(addNotificationChildUnique(notification));
              }
            }
          }
        }
      }
    });
  };

  useEffect(() => {
    dispatch(getDeviationList());
  }, [
    deviationCurrentCctv,
    deviationCurrentObject,
    deviationCurrentValidationStatus,
    deviationCurrentDate,
    deviationCurrentTime,
  ]);

  useEffect(() => {
    dispatch(setDeviationCurrentDate(date));
  }, [date]);

  useEffect(() => {
    dispatch(setTablePageDataLimit(25));
    dispatch(setCurrentTablePage(1));
    dispatch(setCurrentDeviation());
  }, [
    deviationCurrentCctv,
    deviationCurrentObject,
    deviationCurrentValidationStatus,
    deviationCurrentDate,
    deviationCurrentTime,
  ]);

  return (
    <div className={"main" + (mode === "light" ? " main-light" : " main-dark")}>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid container">
          <div
            className="navbar-brand d-flex align-items-center"
            onClick={() => {
              dispatch(setPage("validasi-notifikasi"));
              window.history.replaceState(null, null, "/validasi-notifikasi");
            }}
          >
            <img
              src={require("../assets/logo" +
                (mode === "light" ? "" : "-dark") +
                ".webp")}
              alt="logo"
            />
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            data-bs-theme={mode}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-2">
              <li className="nav-item d-flex justify-content-center align-items-center">
                <div
                  className={
                    "nav-link" +
                    (page === "validasi-notifikasi" ? " active" : "")
                  }
                  onClick={() => {
                    dispatch(setPage("validasi-notifikasi"));
                    window.history.replaceState(
                      null,
                      null,
                      "/validasi-notifikasi"
                    );
                  }}
                >
                  Validasi Notifikasi
                </div>
              </li>
              <li className="nav-item d-flex justify-content-center align-items-center">
                <div
                  className={
                    "nav-link" + (page === "database-deviasi" ? " active" : "")
                  }
                  onClick={() => {
                    dispatch(setPage("database-deviasi"));
                    window.history.replaceState(
                      null,
                      null,
                      "/database-deviasi"
                    );
                  }}
                >
                  Database Deviasi
                </div>
              </li>
              <li className="nav-item d-flex justify-content-center align-items-center">
                <div
                  className={
                    "nav-link" + (page === "live-monitoring" ? " active" : "")
                  }
                  onClick={() => {
                    dispatch(setPage("live-monitoring"));
                    window.history.replaceState(null, null, "/live-monitoring");
                  }}
                >
                  Live Monitoring
                </div>
              </li>
              <li className="nav-item d-flex justify-content-center align-items-center">
                <div className="nav-link">
                  <button
                    className="border-0 rounded-5 row align-items-center m-0 p-0"
                    title="mode terang/gelap"
                    onClick={() => {
                      dispatch(setMode(mode === "light" ? "dark" : "light"));
                    }}
                  >
                    {mode === "light" ? (
                      <span className="col rounded-5 d-flex p-0"></span>
                    ) : (
                      ""
                    )}
                    <Icon
                      className="col d-flex p-0"
                      icon={mode === "light" ? "ph:sun-fill" : "ph:moon-fill"}
                    />
                    {mode === "dark" ? (
                      <span className="col d-flex p-0 rounded-5"></span>
                    ) : (
                      ""
                    )}
                  </button>
                </div>
              </li>
              <li className="nav-item d-grid justify-content-center align-items-center dropdown">
                <button
                  className="nav-link dropdown-toggle border-0 bg-transparent px-0"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <Icon className="icon" icon="bi:person-circle" />
                </button>
                <ul className="dropdown-menu dropdown-menu-end mt-2">
                  <li>
                    <label
                      className="dropdown-item disabled text-center"
                      href="#"
                    >
                      {localStorage.getItem("name")}
                    </label>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li className="d-none">
                    <button
                      className="dashboard dropdown-item d-flex align-items-center gap-2"
                      onClick={() => {
                        window.location.href = "/dashboard";
                      }}
                    >
                      <Icon className="fs-5" icon="mingcute:grid-2-fill" />
                      <label>Dashboard</label>
                    </button>
                  </li>
                  <li>
                    <button
                      className="log-out dropdown-item d-flex align-items-center gap-2"
                      onClick={() => {
                        localStorage.clear();
                        window.location.href = "/login";
                        window.location.reload();
                      }}
                    >
                      <Icon className="fs-5" icon="heroicons-outline:logout" />
                      <label>Log Out</label>
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container mt-3">
        <div className={page !== "database-deviasi" ? "row" : ""}>
          <div className="col-xl-3 mb-xl-0 mb-5">
            {page === "live-monitoring" || page === "validasi-notifikasi" ? (
              <Cctv />
            ) : (
              ""
            )}
          </div>
          <div
            className={
              "col-xl mb-xl-0" + (page !== "database-deviasi" ? " mb-5" : "")
            }
          >
            {page === "live-monitoring" ? (
              <LiveMonitoring />
            ) : page === "validasi-notifikasi" ? (
              <ValidasiNotifikasi />
            ) : (
              <DatabaseDeviasi setDate={setDate} />
            )}
          </div>
          <div className="col-xl-3">
            {page === "live-monitoring" || page === "validasi-notifikasi" ? (
              <Notification />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
