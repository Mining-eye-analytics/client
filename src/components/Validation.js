import "../styles/validation.scss";
import { useState } from "react";
import customAxios from "../utils/customAxios";
import { useSelector, useDispatch } from "react-redux";
import {
  setCurrentNotification,
  submitValidation,
} from "../redux/notificationSlice";

const Validation = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.general.mode);
  const currentNotification = useSelector(
    (state) => state.notification.current
  );
  const submit = useSelector((state) => state.notification.submit);

  const [editValidation, setEditValidation] = useState(false);
  const [validationStatus, setValidationStatus] = useState();
  const [operatorName, setOperatorName] = useState("");
  const [validationCommentData, setValidationCommentData] = useState([]);
  const [textareaStatus, setTextareaStatus] = useState(true);
  const [textareaValue, setTextareaValue] = useState("");

  const submitHandler = () => {
    customAxios({
      method: "PUT",
      url: "/deviations/" + currentNotification?.id,
      data: {
        type_validation: validationStatus,
        comment:
          (operatorName !== ""
            ? "Operator terdeteksi: " + operatorName + ". "
            : "") +
          (validationCommentData[0] !== undefined
            ? validationCommentData.length > 1
              ? validationCommentData.join(", ")
              : validationCommentData[0]
            : "") +
          (validationCommentData.length > 0 && textareaValue.length > 0
            ? ", "
            : "") +
          (textareaValue.length > 0 ? textareaValue : ""),
        user_id: JSON.parse(localStorage.getItem("authorization"))?.user_id,
      },
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const trueCommentData = [
    { id: 1, value: "Pengawas/manusia berada diluar unit" },
    { id: 2, value: "Pengawas/manusia berada diluar kabin" },
    { id: 3, value: "HD tidak menjaga jarak iring (40m)" },
    { id: 4, value: "LV tidak memeliki izin memasuki area tambang" },
  ];

  const falseCommentData = [
    {
      id: 1,
      value: "Deteksi objek tepat namun bukan deviasi",
    },
    {
      id: 2,
      value: "Posisi HD Antri",
    },
    { id: 3, value: "Posisi antar HD beda elevasi (atas bawah)" },
    { id: 4, value: "Posisi HD berlawanan arah" },
    { id: 5, value: "Posisi HD sedang parkir" },
    { id: 6, value: "Posisi HD tidak tegak lurus arah kamera" },
    { id: 7, value: "Bukan HD (false warning)" },
    { id: 8, value: "Visual Gambar tidak jelas" },
    { id: 9, value: "LV memiliki izin memasuki area tambang" },
    { id: 10, value: "Bukan LV (false warning)" },
    { id: 11, value: "Pengawas memeliki izin" },
    { id: 12, value: "Pengawas/crew blasting" },
    { id: 13, value: "Bukan Manusia" },
    { id: 14, value: "Warga" },
    { id: 15, value: "Visual Camera tidak jelas" },
  ];

  const trueCommentArray = trueCommentData.map((comment) => {
    return (
      <div key={comment.id} className="col-6 form-check">
        <input
          className="form-check-input"
          type="checkbox"
          value={comment.value}
          id={"true" + comment.id}
          onClick={() => {
            validationCommentData.includes(comment.value)
              ? setValidationCommentData((data) =>
                  data.filter((data) => data !== comment.value)
                )
              : setValidationCommentData((data) => [...data, comment.value]);
          }}
        />
        <label className="form-check-label" htmlFor={"true" + comment.id}>
          {comment.value}
        </label>
      </div>
    );
  });

  const falseCommentArray = falseCommentData.map((comment) => {
    return (
      <div key={comment.id} className="col-6 form-check">
        <input
          className="form-check-input"
          type="checkbox"
          value={comment.value}
          id={"false" + comment.id}
          onClick={() => {
            validationCommentData.includes(comment.value)
              ? setValidationCommentData((data) =>
                  data.filter((data) => data !== comment.value)
                )
              : setValidationCommentData((data) => [...data, comment.value]);
          }}
        />
        <label className="form-check-label" htmlFor={"false" + comment.id}>
          {comment.value}
        </label>
      </div>
    );
  });

  return (
    <div
      className={
        "validation" +
        (mode === "light" ? " validation-light" : " validation-dark")
      }
    >
      {editValidation === false &&
      currentNotification?.type_validation !== "not_yet" ? (
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="button-true border-0 rounded-2 px-3 py-1"
            onClick={() => {
              setEditValidation(true);
            }}
          >
            Edit
          </button>
        </div>
      ) : (
        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="button-true border-0 rounded-2 px-3 py-1"
            data-bs-toggle="modal"
            data-bs-target="#validationModal"
            onClick={() => setValidationStatus(true)}
          >
            Valid
          </button>
          <button
            type="button"
            className="button-false rounded-2 px-3 py-1"
            data-bs-toggle="modal"
            data-bs-target="#validationModal"
            onClick={() => setValidationStatus(false)}
          >
            Tidak Valid
          </button>
        </div>
      )}
      <div
        className="modal modal-lg fade"
        id="validationModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="validationModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title" id="validationModalLabel">
                Deskripsi Validasi
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setValidationStatus();
                  setOperatorName("");
                  setValidationCommentData([]);
                  setTextareaStatus(true);
                  setTextareaValue("");
                  setEditValidation(false);
                }}
              ></button>
            </div>
            <div className="modal-body d-grid gap-2 overflow-auto">
              <input
                className="form-control mb-4"
                type="text"
                value={operatorName}
                placeholder="Tulis nama operator yang terdeteksi (opsional)"
                onChange={(e) => {
                  setOperatorName(e.target.value);
                }}
              />
              <div className="row m-0">
                {validationStatus === true
                  ? trueCommentArray
                  : validationStatus === false
                  ? falseCommentArray
                  : ""}
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  onChange={() => {
                    setValidationCommentData((data) =>
                      data.filter((data) => data !== textareaValue)
                    );
                    setTextareaStatus(!textareaStatus);
                    setTextareaValue("");
                  }}
                  checked={!textareaStatus}
                />
                <textarea
                  className="form-control w-100"
                  rows={4}
                  value={textareaValue}
                  placeholder={
                    textareaStatus === true && textareaValue.length < 1
                      ? "Centang untuk mengaktifkan deskripsi manual (opsional)"
                      : "Tulis deskripsi"
                  }
                  disabled={textareaStatus}
                  onChange={(e) => {
                    setTextareaValue(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="modal-footer">
              <div className="row w-100 align-items-center">
                <div className="col px-0">
                  <label>
                    {validationCommentData.length < 1 &&
                    textareaValue.length < 1
                      ? "*pilih dan/atau deskripsikan manual"
                      : ""}
                  </label>
                </div>
                <div className="col d-flex justify-content-end gap-2 px-0">
                  <button
                    type="button"
                    className="cancel-button rounded-2 px-3 py-1"
                    data-bs-dismiss="modal"
                    onClick={() => {
                      setValidationStatus();
                      setOperatorName("");
                      setValidationCommentData([]);
                      setTextareaStatus(true);
                      setTextareaValue("");
                      setEditValidation(false);
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    className={
                      "submit-button border-0 rounded-2 px-3 py-1" +
                      (validationCommentData.length < 1 &&
                      textareaValue.length < 1
                        ? " disabled"
                        : "")
                    }
                    data-bs-dismiss="modal"
                    onClick={() => {
                      submitHandler();
                      setTimeout(() => {
                        setValidationStatus();
                        setOperatorName("");
                        setValidationCommentData([]);
                        setTextareaStatus(true);
                        setTextareaValue("");
                        dispatch(
                          submitValidation(submit === false ? true : false)
                        );
                      }, 2000);
                      dispatch(
                        setCurrentNotification({
                          avg_panjang_bbox_hd:
                            currentNotification?.avg_panjang_bbox_hd,
                          cctv_id: currentNotification?.cctv_id,
                          children: currentNotification?.children,
                          comment:
                            (operatorName !== ""
                              ? "Operator terdeteksi: " + operatorName + ". "
                              : "") +
                            validationCommentData.join(", ") +
                            (validationCommentData.length > 0 ? ", " : "") +
                            (textareaValue.length > 0 ? textareaValue : ""),
                          created_at: currentNotification?.created_at,
                          id: currentNotification?.id,
                          image: currentNotification?.image,
                          parent_id: currentNotification?.parent_id,
                          path: currentNotification?.path,
                          realtime_images_id:
                            currentNotification?.realtime_images_id,
                          type_object: currentNotification?.type_object,
                          type_validation: validationStatus.toString(),
                          updated_at: new Date(),
                          user_id: parseInt(
                            JSON.parse(localStorage.getItem("authorization"))
                              ?.user_id
                          ),
                          violate_count: currentNotification?.violate_count,
                        })
                      );
                      setEditValidation(false);
                    }}
                  >
                    Validasi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Validation;
