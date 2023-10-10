import "../styles/notification.scss";
import "../styles/time_picker.css";
import { Icon } from "@iconify/react";
import Modal from "react-bootstrap/Modal";
import { useSelector, useDispatch } from "react-redux";
import { setPage } from "../redux/generalSlice";
import {
  setCurrentNotification,
  setNotificationCurrentObject,
  setNotificationCurrentValidationStatus,
  setNotificationLimit,
  reloadNotification,
  activateAlarmSound,
  showAlarmPopup,
  showNotificationChild,
} from "../redux/notificationSlice";
import { setCurrentObject } from "../redux/objectSlice";
import { setCurrentValidationStatus } from "../redux/validationStatusSlice";

const Notification = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.general.mode);
  const page = useSelector((state) => state.general.page);
  const notificationList = useSelector((state) => state.notification.list);
  const notificationLoading = useSelector(
    (state) => state.notification.loading
  );
  const currentNotification = useSelector(
    (state) => state.notification.current
  );
  const notificationLimit = useSelector((state) => state.notification.limit);
  const notificationChildList = useSelector(
    (state) => state.notification.childList
  );
  const notificationShowedChild = useSelector(
    (state) => state.notification.showedChild
  );
  const objectList = useSelector((state) => state.object.list);
  const currentObject = useSelector((state) => state.object.current);
  const validationStatusList = useSelector(
    (state) => state.validationStatus.list
  );
  const currentValidationStatus = useSelector(
    (state) => state.validationStatus.current
  );
  const alarmSound = useSelector((state) => state.notification.alarmSound);
  const alarmPopup = useSelector((state) => state.notification.alarmPopup);

  const objectFilter = objectList.map((object) => {
    return (
      <li key={object.id}>
        <button
          className={
            "dropdown-item" + (currentObject === object.value ? " active" : "")
          }
          onClick={() => {
            dispatch(setCurrentObject(object.value));
            dispatch(setNotificationCurrentObject(object.value));
            dispatch(setNotificationLimit(10));
          }}
        >
          {object.name}
        </button>
      </li>
    );
  });

  const validationTypeFilter = validationStatusList.map((validationStatus) => {
    return (
      <li key={validationStatus.id}>
        <button
          className={
            "dropdown-item" +
            (currentValidationStatus === validationStatus.value
              ? " active"
              : "")
          }
          onClick={() => {
            dispatch(setCurrentValidationStatus(validationStatus.value));
            dispatch(
              setNotificationCurrentValidationStatus(validationStatus.value)
            );
            dispatch(setNotificationLimit(10));
          }}
        >
          {validationStatus.name}
        </button>
      </li>
    );
  });

  const notificationArray = notificationList
    .slice(0, notificationList.length - 1)
    .map((notification, index) => {
      return (
        <div key={notification.id}>
          {notification.type_object === "HD" && notification.child?.length !== 0
            ? notification.child
                ?.toReversed()
                .map((notificationHd, indexHd) => {
                  return (
                    <div
                      key={notificationHd.id}
                      className={indexHd !== 0 ? "pt-2" : ""}
                    >
                      <button
                        className={
                          "border-0 text-start rounded-2 px-3 py-2 d-grid gap-2 w-100" +
                          (page !== "live-monitoring" &&
                          currentNotification !== undefined &&
                          currentNotification?.id === notificationHd.id
                            ? " active"
                            : "")
                        }
                        onClick={() => {
                          page !== "validasi-notifikasi"
                            ? dispatch(setPage("validasi-notifikasi"))
                            : dispatch(setPage(page));
                          window.history.replaceState(
                            null,
                            null,
                            "/validasi-notifikasi"
                          );
                          dispatch(setCurrentNotification(notificationHd));
                        }}
                      >
                        <div className="row m-0 align-items-center">
                          <div className="col-5 p-0">
                            <label>{notificationHd.type_object}</label>
                          </div>
                          <div className="col-7 p-0 d-flex justify-content-end">
                            <label
                              className={
                                "px-2 rounded-2" +
                                (notificationHd.type_validation === "true"
                                  ? " status-true"
                                  : notificationHd.type_validation === "false"
                                  ? " status-false"
                                  : " status-none")
                              }
                            >
                              {notificationHd.type_validation === "not_yet"
                                ? "Validasi"
                                : notificationHd.type_validation === "true"
                                ? "Valid"
                                : "Tidak Valid"}
                            </label>
                          </div>
                        </div>
                        <div className="d-flex align-items-end gap-2">
                          <Icon className="icon" icon="mdi:cctv" />
                          <label>
                            {notificationHd.name +
                              " - " +
                              notificationHd.location}
                          </label>
                        </div>
                        <div className="d-flex align-items-end gap-2">
                          <Icon className="icon" icon="akar-icons:clock" />
                          <label>
                            {notificationHd.created_at.substring(4, 25)}
                          </label>
                        </div>
                      </button>
                      <hr
                        className={
                          indexHd === notification.child.length - 1
                            ? "pt-2"
                            : ""
                        }
                      />
                    </div>
                  );
                })
            : ""}
          <button
            className={
              "border-0 text-start rounded-2 px-3 py-2 d-grid gap-2 w-100" +
              (page !== "live-monitoring" &&
              currentNotification !== undefined &&
              currentNotification?.id === notification.id
                ? " active"
                : "")
            }
            onClick={() => {
              page !== "validasi-notifikasi"
                ? dispatch(setPage("validasi-notifikasi"))
                : dispatch(setPage(page));
              window.history.replaceState(null, null, "/validasi-notifikasi");
              dispatch(setCurrentNotification(notificationList[index]));
              dispatch(
                showNotificationChild(
                  notificationShowedChild !== notificationList[index]?.id
                    ? notificationList[index]?.id
                    : undefined
                )
              );
            }}
          >
            <div className="row m-0 align-items-center">
              <div className="col-5 p-0">
                <label>{notification.type_object}</label>
              </div>
              <div className="col-7 p-0 d-flex justify-content-end">
                <label
                  className={
                    "px-2 rounded-2" +
                    (notification.type_validation === "true"
                      ? " status-true"
                      : notification.type_validation === "false"
                      ? " status-false"
                      : " status-none")
                  }
                >
                  {notification.type_validation === "not_yet"
                    ? "Validasi"
                    : notification.type_validation === "true"
                    ? "Valid"
                    : "Tidak Valid"}
                </label>
              </div>
            </div>
            <div className="d-flex align-items-end gap-2">
              <Icon className="icon" icon="mdi:cctv" />
              <label>{notification.name + " - " + notification.location}</label>
            </div>
            <div className="d-flex align-items-end gap-2">
              <Icon className="icon" icon="akar-icons:clock" />
              <label>{notification.created_at.substring(4, 25)}</label>
            </div>
            {notification.type_object === "HD" ? (
              ""
            ) : notification.child ? (
              notification.child?.length !== 0 ? (
                <div className="w-100">
                  <div className="row m-0 d-flex align-items-center">
                    <div className="col p-0">
                      <div className="d-flex justify-content-start">
                        <label>
                          Jumlah repetisi:
                          {" " +
                            (notification.child?.length +
                              (notificationChildList.filter(
                                (array) => array.parent_id === notification.id
                              ).length !== 0
                                ? notificationChildList.filter(
                                    (array) =>
                                      array.parent_id === notification.id
                                  ).length
                                : 0))}
                        </label>
                      </div>
                    </div>
                    <div className="col-2 p-0">
                      <div className="d-flex justify-content-end">
                        <Icon
                          icon={
                            "codicon:fold-" +
                            (notificationShowedChild !== notification.id
                              ? "down"
                              : "up")
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )
            ) : notificationChildList.filter(
                (array) => array.parent_id === notification.id
              ).length !== 0 ? (
              <div className="w-100">
                <div className="row m-0 d-flex align-items-center">
                  <div className="col p-0">
                    <div className="d-flex justify-content-start">
                      <label>
                        Jumlah repetisi:
                        {" " +
                          notificationChildList.filter(
                            (array) => array.parent_id === notification.id
                          ).length}
                      </label>
                    </div>
                  </div>
                  <div className="col-2 p-0">
                    <div className="d-flex justify-content-end">
                      <Icon icon="codicon:fold-down" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </button>
          {notificationShowedChild !== notification.id
            ? ""
            : notification.type_object === "HD"
            ? ""
            : notification.child?.map((notificationChild) => {
                return (
                  <div key={notificationChild.id} className="px-2 pt-2">
                    <button
                      className={
                        "border-0 text-start rounded-2 px-3 py-2 d-grid gap-2 w-100" +
                        (page !== "live-monitoring" &&
                        currentNotification !== undefined &&
                        currentNotification?.id === notificationChild.id
                          ? " active"
                          : "")
                      }
                      onClick={() => {
                        page !== "validasi-notifikasi"
                          ? dispatch(setPage("validasi-notifikasi"))
                          : dispatch(setPage(page));
                        window.history.replaceState(
                          null,
                          null,
                          "/validasi-notifikasi"
                        );
                        dispatch(setCurrentNotification(notificationChild));
                      }}
                    >
                      <div className="row m-0 align-items-center">
                        <div className="col-6 p-0">
                          <label>{notificationChild.type_object}</label>
                        </div>
                        <div className="col-6 p-0 d-flex justify-content-end">
                          <label
                            className={
                              "px-2 rounded-2" +
                              (notificationChild.type_validation === "true"
                                ? " status-true"
                                : notificationChild.type_validation === "false"
                                ? " status-false"
                                : " status-none")
                            }
                          >
                            {notificationChild.type_validation === "not_yet"
                              ? "—"
                              : notificationChild.type_validation === "true"
                              ? "✔"
                              : "X"}
                          </label>
                        </div>
                      </div>
                      <div className="d-flex align-items-end gap-2">
                        <Icon className="icon" icon="akar-icons:clock" />
                        <label>
                          {notificationChild.created_at.substring(4, 25)}
                        </label>
                      </div>
                    </button>
                  </div>
                );
              })}
          {notificationShowedChild !== notification.id
            ? ""
            : notification.type_object === "HD"
            ? ""
            : notificationChildList.map((notificationChild) => {
                if (notificationChild.parent_id === notification.id) {
                  return (
                    <div key={notificationChild.id} className="px-2 pt-2">
                      <button
                        className={
                          "border-0 text-start rounded-2 px-3 py-2 d-grid gap-2 w-100" +
                          (page !== "live-monitoring" &&
                          currentNotification !== undefined &&
                          currentNotification?.id === notificationChild.id
                            ? " active"
                            : "")
                        }
                        onClick={() => {
                          page !== "validasi-notifikasi"
                            ? dispatch(setPage("validasi-notifikasi"))
                            : dispatch(setPage(page));
                          window.history.replaceState(
                            null,
                            null,
                            "/validasi-notifikasi"
                          );
                          dispatch(setCurrentNotification(notificationChild));
                        }}
                      >
                        <div className="row m-0 align-items-center">
                          <div className="col-6 p-0">
                            <label>{notificationChild.type_object}</label>
                          </div>
                          <div className="col-6 p-0 d-flex justify-content-end">
                            <label
                              className={
                                "px-2 rounded-2" +
                                (notificationChild.type_validation === "true"
                                  ? " status-true"
                                  : notificationChild.type_validation ===
                                    "false"
                                  ? " status-false"
                                  : " status-none")
                              }
                            >
                              {notificationChild.type_validation === "not_yet"
                                ? "—"
                                : notificationChild.type_validation === "true"
                                ? "✔"
                                : "X"}
                            </label>
                          </div>
                        </div>
                        <div className="d-flex align-items-end gap-2">
                          <Icon className="icon" icon="akar-icons:clock" />
                          <label>
                            {notificationChild.created_at.substring(4, 25)}
                          </label>
                        </div>
                      </button>
                    </div>
                  );
                }
              })}
          <hr />
        </div>
      );
    });

  return (
    <div
      className={
        "notification" +
        (mode === "light" ? " notification-light" : " notification-dark")
      }
    >
      <div className="title mb-3">
        <div className="row m-0 align-items-center">
          <div className="col-8 p-0">
            <h6>List Notifikasi</h6>
            <label>List notifikasi deviasi</label>
          </div>
          <div className="col p-0 d-flex justify-content-end gap-3">
            <div>
              <button
                className="notif-sound bg-transparent border-0 p-0"
                title="hidup/matikan alarm"
                onClick={() => {
                  dispatch(activateAlarmSound(!alarmSound));
                }}
              >
                <Icon
                  icon={
                    alarmSound === true
                      ? "teenyicons:sound-on-solid"
                      : "teenyicons:sound-off-solid"
                  }
                  muted={alarmSound}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="content w-100">
        <div className="notification-filter row justify-content-center m-0 gap-1">
          <div className="dropdown col d-flex justify-content-center p-0">
            <button
              className="btn dropdown-toggle border w-100"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {currentObject === "All" ? "Semua Deviasi" : currentObject}
            </button>
            <ul className="dropdown-menu">{objectFilter}</ul>
          </div>
          <div className="dropdown col d-flex justify-content-center p-0">
            <button
              className="btn dropdown-toggle border w-100"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {currentValidationStatus === "All"
                ? "Semua Status"
                : currentValidationStatus === "Perlu Validasi"
                ? "Belum Divalidasi"
                : currentValidationStatus === "Tervalidasi"
                ? "Sudah Divalidasi"
                : currentValidationStatus === "true"
                ? "Valid"
                : "Tidak Valid"}
            </button>
            <ul className="dropdown-menu">{validationTypeFilter}</ul>
          </div>
        </div>
        <hr />
        {notificationLoading === false ? (
          <div className="notification-list d-grid gap-2 overflow-auto">
            {notificationList.length !== 0 ? (
              notificationArray
            ) : (
              <div className="d-flex justify-content-center">
                <label className="data-not-found">
                  Notifikasi tidak ditemukan
                </label>
              </div>
            )}
            {notificationList.length >= notificationLimit ? (
              <div className="d-flex justify-content-center mt-2">
                <div
                  className="load-more-button"
                  onClick={() => {
                    dispatch(reloadNotification(true));
                    dispatch(setNotificationLimit(notificationLimit + 10));
                  }}
                >
                  Tampilkan Lebih
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          <div className="d-flex justify-content-center my-3">
            <div className="spinner-border">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
      </div>
      <Modal
        style={{ width: "max-content", right: "0", left: "0", margin: "auto" }}
        show={alarmPopup}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header
          style={
            mode === "light"
              ? { backgroundColor: "white" }
              : { backgroundColor: "#1E1E1E" }
          }
        >
          <Modal.Title
            style={{
              fontSize: "20px",
              fontWeight: "500",
              color: "#FFD801",
            }}
          >
            <div className="d-flex">
              <Icon className="text-center" icon="ph:warning-fill" />
              <Icon className="text-center" icon="ph:warning-fill" />
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={
            mode === "light"
              ? {
                  fontSize: "14px",
                  backgroundColor: "white",
                  color: "black",
                }
              : {
                  fontSize: "14px",
                  backgroundColor: "#1E1E1E",
                  color: "white",
                }
          }
        >
          Hidupkan alarm notifikasi demi memaksimalkan pengawasan
        </Modal.Body>
        <Modal.Footer
          style={
            mode === "light"
              ? { backgroundColor: "white" }
              : { backgroundColor: "#1E1E1E" }
          }
        >
          <button
            className="border-0 rounded-2 px-3 py-2"
            style={{
              backgroundImage: "linear-gradient(to right, #3B9315, #297209)",
              color: "white",
              fontSize: "12px",
              fontWeight: "500",
            }}
            onClick={() => {
              dispatch(activateAlarmSound(true));
              dispatch(showAlarmPopup(false));
            }}
          >
            Hidupkan Alarm
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Notification;
