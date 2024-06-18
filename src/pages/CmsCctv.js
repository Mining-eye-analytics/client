import "../styles/cms.scss";
import { useEffect, useState } from "react";
import customAxios from "../utils/customAxios";
import { useSelector, useDispatch } from "react-redux";
import { getCctvList } from "../redux/cctvSlice";
import { ReactComponent as MingcuteCheckFill } from "../assets/iconify/mingcute--check-fill.svg";
import { ReactComponent as EpCloseBold } from "../assets/iconify/ep--close-bold.svg";
import { ReactComponent as MaterialSymbolsEdit } from "../assets/iconify/material-symbols--edit.svg";
import { ReactComponent as MingcuteDeleteFill } from "../assets/iconify/mingcute--delete-fill.svg";
import { ReactComponent as EntypoExport } from "../assets/iconify/entypo--export.svg";
import { ReactComponent as CarbonLocationFilled } from "../assets/iconify/carbon--location-filled.svg";
import { ReactComponent as BiCalendarWeek } from "../assets/iconify/bi--calendar-week.svg";

const CmsCctv = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.general.mode);
  const cctvList = useSelector((state) => state.cctv.list);

  const [action, setAction] = useState();
  const [currentCctv, setCurrentCctv] = useState();
  const [formMessage, setFormMessage] = useState("");

  const [addDataForm, setAddDataForm] = useState({
    id: cctvList.length !== 0 ? cctvList[cctvList.length - 1]?.id + 1 : 1,
    name: "",
    location: "",
    ip: "",
    link_rtsp: "",
    username: "",
    password: "",
    type_analytics: "",
  });

  const [editDataForm, setEditDataForm] = useState({});

  const [analyticsTypeList, setAnalyticsTypeList] = useState([]);

  useEffect(() => {
    customAxios({
      method: "GET",
      url: "/analytics/list",
    })
      .then((res) => {
        let tempArr = [];
        for (let i = 0; i < res.data.data.list_analytics.length; i++) {
          tempArr.push({
            id: i + 1,
            type_analytics: res.data.data.list_analytics[i],
          });
        }
        setAnalyticsTypeList(tempArr);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const addCctv = (addForm) => {
    setFormMessage("");
    if (
      addForm.name !== "" &&
      addForm.location !== "" &&
      addForm.ip !== "" &&
      addForm.link_rtsp !== ""
    ) {
      customAxios({
        method: "POST",
        url: "/cctvs/create",
        data: addForm,
      })
        .then((res) => {
          dispatch(getCctvList());
          setAddDataForm({
            id:
              cctvList.length !== 0 ? cctvList[cctvList.length - 1]?.id + 1 : 1,
            name: "",
            location: "",
            ip: "",
            link_rtsp: "",
            username: "",
            password: "",
            type_analytics: "",
          });
          setEditDataForm({});
        })
        .catch((err) => {
          if (err.message.includes("401")) {
            setFormMessage("*anda tidak memiliki akses");
            setAddDataForm({
              id:
                cctvList.length !== 0
                  ? cctvList[cctvList.length - 1]?.id + 1
                  : 1,
              name: "",
              location: "",
              ip: "",
              link_rtsp: "",
              username: "",
              password: "",
              type_analytics: "",
            });
          }
          console.log(err);
        });
      setFormMessage("");
    } else {
      setFormMessage("*form tidak boleh kosong");
    }
  };

  const editCctv = (editForm) => {
    setFormMessage("");
    customAxios({
      method: "PUT",
      url: "/cctvs/" + editForm.id,
      data: editForm,
    })
      .then((res) => {
        dispatch(getCctvList());
      })
      .catch((err) => {
        if (err.message.includes("401")) {
          setFormMessage("*anda tidak memiliki akses");
          setCurrentCctv();
          setAction();
          setEditDataForm({});
        }
        console.log(err);
      });
  };

  const deleteCctv = (cctvId) => {
    setFormMessage("");
    customAxios({
      method: "DELETE",
      url: "/cctvs/" + cctvId,
    })
      .then((res) => {
        dispatch(getCctvList());
      })
      .catch((err) => {
        if (err.message.includes("401")) {
          setFormMessage("*anda tidak memiliki akses");
        }
        console.log(err);
      });
  };

  const analyticsTypeArr = analyticsTypeList.map((type) => {
    return (
      <option value={type.type_analytics} key={type.id}>
        {type.type_analytics === "AnalyticsCountingCrossing"
          ? "Counting Crossing"
          : type.type_analytics === "AnalyticsThreeClass"
          ? "Tiga Kelas"
          : type.type_analytics === "AnalyticsSixClass"
          ? "Enam Kelas"
          : "CCTV Stream"}
      </option>
    );
  });

  const cctvArr = cctvList.map((cctv, index) => {
    return (
      <tr className="align-middle" key={cctv.id}>
        <th className="text-center" scope="row">
          {cctv.id}
        </th>
        <td className="text-center">
          <input
            className={
              "form-control w-100" +
              (currentCctv === cctv.id ? "" : " disabled")
            }
            type="text"
            value={editDataForm.id !== cctv.id ? cctv.name : editDataForm.name}
            placeholder="Masukkan nama CCTV"
            disabled={currentCctv === cctv.id ? false : true}
            onChange={(e) => {
              setEditDataForm({ ...editDataForm, name: e.target.value });
            }}
          />
        </td>
        <td className="text-center">
          <input
            className={
              "form-control w-100" +
              (currentCctv === cctv.id ? "" : " disabled")
            }
            type="text"
            value={
              editDataForm.id !== cctv.id
                ? cctv.location
                : editDataForm.location
            }
            placeholder="Masukkan lokasi CCTV"
            disabled={currentCctv === cctv.id ? false : true}
            onChange={(e) => {
              setEditDataForm({ ...editDataForm, location: e.target.value });
            }}
          />
        </td>
        <td className="text-center">
          <input
            className={
              "form-control w-100" +
              (currentCctv === cctv.id ? "" : " disabled")
            }
            type="text"
            value={editDataForm.id !== cctv.id ? cctv.ip : editDataForm.ip}
            placeholder="Masukkan IP RTSP"
            disabled={currentCctv === cctv.id ? false : true}
            onChange={(e) => {
              setEditDataForm({ ...editDataForm, ip: e.target.value });
            }}
          />
        </td>
        <td className="text-center">
          <input
            className={
              "form-control w-100" +
              (currentCctv === cctv.id ? "" : " disabled")
            }
            type="text"
            value={
              editDataForm.id !== cctv.id
                ? cctv.link_rtsp
                : editDataForm.link_rtsp
            }
            placeholder="Masukkan link RTSP"
            disabled={currentCctv === cctv.id ? false : true}
            onChange={(e) => {
              setEditDataForm({ ...editDataForm, link_rtsp: e.target.value });
            }}
          />
        </td>
        <td className="text-center">
          <input
            className={
              "form-control w-100" +
              (currentCctv === cctv.id ? "" : " disabled")
            }
            type="text"
            value={
              editDataForm.id !== cctv.id
                ? cctv.username
                : editDataForm.username
            }
            placeholder="Masukkan username RTSP"
            disabled={currentCctv === cctv.id ? false : true}
            onChange={(e) => {
              setEditDataForm({ ...editDataForm, username: e.target.value });
            }}
          />
        </td>
        <td className="text-center">
          <input
            className={
              "form-control w-100" +
              (currentCctv === cctv.id ? "" : " disabled")
            }
            type="text"
            value={
              editDataForm.id !== cctv.id
                ? cctv.password
                : editDataForm.password
            }
            placeholder="Masukkan password RTSP"
            disabled={currentCctv === cctv.id ? false : true}
            onChange={(e) => {
              setEditDataForm({ ...editDataForm, password: e.target.value });
            }}
          />
        </td>
        <td className="text-center">
          <select
            className={
              "form-control form-select" +
              (currentCctv === cctv.id ? "" : " disabled")
            }
            aria-label="Default select example"
            value={
              editDataForm.id !== cctv.id
                ? cctv.type_analytics
                : editDataForm.type_analytics
            }
            onChange={(e) => {
              setEditDataForm({
                ...editDataForm,
                type_analytics: e.target.value,
              });
            }}
            disabled={currentCctv !== cctv.id}
          >
            {analyticsTypeArr}
          </select>
        </td>
        {currentCctv === cctv.id ? (
          <td className="text-center">
            <button
              className="border-0 me-2"
              onClick={() => {
                action === "edit"
                  ? editCctv(editDataForm, index)
                  : deleteCctv(cctv.id);
                setCurrentCctv();
                setAction();
              }}
            >
              <MingcuteCheckFill className="icon icon-green" />
            </button>
            <button
              className="border-0"
              onClick={() => {
                formMessage === ""
                  ? setFormMessage(formMessage)
                  : setFormMessage("");
                setCurrentCctv();
                setAction();
                setEditDataForm({});
              }}
            >
              <EpCloseBold className="icon icon-red" />
            </button>
          </td>
        ) : (
          <td className="text-center">
            <button
              className="border-0 me-2"
              onClick={() => {
                setCurrentCctv(cctv.id);
                setAction("edit");
                setEditDataForm(cctv);
              }}
            >
              <MaterialSymbolsEdit className="icon icon-green" />
            </button>
            <button
              className="border-0"
              onClick={() => {
                setCurrentCctv(cctv.id);
                setAction("delete");
              }}
            >
              <MingcuteDeleteFill className="icon icon-red" />
            </button>
          </td>
        )}
      </tr>
    );
  });

  return (
    <div
      className={
        "cms d-flex flex-column gap-3" +
        (mode === "light" ? " cms-light" : " cms-dark")
      }
    >
      <div className="row m-0">
        <div className="col p-0">
          <h1>CMS - CCTV</h1>
        </div>
        <div className="col p-0 d-flex justify-content-end">
          <button className="border-0 rounded-2 px-3 py-2 d-flex align-items-center gap-1">
            <EntypoExport className="icon" />
            <label>Export</label>
          </button>
        </div>
      </div>
      <div className="d-grid gap-3 overflow-auto pb-2">
        <div className="row m-0 gap-3 align-items-end">
          <div className="col-3 p-0">
            <div className="info rounded-2 d-grid gap-3 px-3 py-2">
              <label className="info-title">
                Jumlah CCTV yang telah <br /> terealisasi
              </label>
              <div className="d-flex justify-content-center align-items-end gap-1">
                <div className="info-content d-flex align-items-end gap-1">
                  <label>{cctvList.length}</label>
                  <label>CCTV</label>
                </div>
                <div className="info-content">
                  <label></label>
                  <label>/</label>
                </div>
                <div className="info-content d-flex align-items-end gap-1">
                  <label>6</label>
                  <label>CCTV</label>
                </div>
              </div>

              <div className="info-other d-flex justify-content-end gap-1">
                <CarbonLocationFilled className="icon" />
                <label>
                  {window.location.hostname === "localhost"
                    ? "10.10.10.66"
                    : window.location.hostname}
                </label>
              </div>
            </div>
          </div>
          <div className="col-3 p-0">
            <div className="info rounded-2 d-grid gap-3 px-3 py-2">
              <label className="info-title">
                CCTV yang paling sering diakses
              </label>
              <div className="info-content d-flex justify-content-center align-items-end gap-1">
                <label>HO - Indoor Finance</label>
              </div>
              <div className="info-other d-flex justify-content-end gap-1">
                <BiCalendarWeek className="icon" />
                <label>
                  {new Date().getDate() +
                    " " +
                    new Date().toLocaleString("id-ID", { month: "long" }) +
                    " " +
                    new Date().getFullYear()}
                </label>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="cms-table-title row m-0 mb-2">
            <div className="col p-0">
              <label>Daftar CCTV</label>
            </div>
            <div className="col p-0 d-flex justify-content-end">
              <label>{formMessage}</label>
            </div>
          </div>
          <div className="cms-table overflow-auto">
            <table className="table">
              <thead>
                <tr className="text-center">
                  <th className="table-header" scope="col">
                    ID
                  </th>
                  <th className="table-header" scope="col">
                    Nama CCTV
                  </th>
                  <th className="table-header" scope="col">
                    Lokasi CCTV
                  </th>
                  <th className="table-header" scope="col">
                    IP
                  </th>
                  <th className="table-header" scope="col">
                    Link RTSP
                  </th>
                  <th className="table-header" scope="col">
                    Username
                  </th>
                  <th className="table-header" scope="col">
                    Password
                  </th>
                  <th className="table-header" scope="col">
                    Tipe Analitik
                  </th>
                  <th className="table-header" scope="col">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                <tr className="align-middle">
                  <th className="text-center" scope="row">
                    *
                  </th>
                  <td className="text-center">
                    <input
                      className={
                        "form-control w-100" + (!currentCctv ? "" : " disabled")
                      }
                      type="text"
                      value={addDataForm.name}
                      placeholder="Masukkan nama CCTV"
                      disabled={!currentCctv ? false : true}
                      onChange={(e) => {
                        setAddDataForm({
                          ...addDataForm,
                          name: e.target.value,
                        });
                      }}
                    />
                  </td>
                  <td className="text-center">
                    <input
                      className={
                        "form-control w-100" + (!currentCctv ? "" : " disabled")
                      }
                      type="text"
                      value={addDataForm.location}
                      placeholder="Masukkan lokasi CCTV"
                      disabled={!currentCctv ? false : true}
                      onChange={(e) => {
                        setAddDataForm({
                          ...addDataForm,
                          location: e.target.value,
                        });
                      }}
                    />
                  </td>
                  <td className="text-center">
                    <input
                      className={
                        "form-control w-100" + (!currentCctv ? "" : " disabled")
                      }
                      type="text"
                      value={addDataForm.ip}
                      placeholder="Masukkan IP RTSP"
                      disabled={!currentCctv ? false : true}
                      onChange={(e) => {
                        setAddDataForm({
                          ...addDataForm,
                          ip: e.target.value,
                        });
                      }}
                    />
                  </td>
                  <td className="text-center">
                    <input
                      className={
                        "form-control w-100" + (!currentCctv ? "" : " disabled")
                      }
                      type="text"
                      value={addDataForm.link_rtsp}
                      placeholder="Masukkan link RTSP"
                      disabled={!currentCctv ? false : true}
                      onChange={(e) => {
                        setAddDataForm({
                          ...addDataForm,
                          link_rtsp: e.target.value,
                        });
                      }}
                    />
                  </td>
                  <td className="text-center">
                    <input
                      className={
                        "form-control w-100" + (!currentCctv ? "" : " disabled")
                      }
                      type="text"
                      value={addDataForm.username}
                      placeholder="Masukkan username RTSP"
                      disabled={!currentCctv ? false : true}
                      onChange={(e) => {
                        setAddDataForm({
                          ...addDataForm,
                          username: e.target.value,
                        });
                      }}
                    />
                  </td>
                  <td className="text-center">
                    <input
                      className={
                        "form-control w-100" + (!currentCctv ? "" : " disabled")
                      }
                      type="text"
                      value={addDataForm.password}
                      placeholder="Masukkan password RTSP"
                      disabled={!currentCctv ? false : true}
                      onChange={(e) => {
                        setAddDataForm({
                          ...addDataForm,
                          password: e.target.value,
                        });
                      }}
                    />
                  </td>
                  <td className="text-center">
                    <select
                      className="form-control form-select disabled"
                      aria-label="Default select example"
                      disabled
                    >
                      {analyticsTypeArr}
                    </select>
                  </td>
                  <td className="text-center">
                    <button
                      className="border-0"
                      onClick={() => {
                        addCctv(addDataForm);
                      }}
                    >
                      <label className="button-green">Tambah Data</label>
                    </button>
                  </td>
                </tr>
                {cctvArr}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CmsCctv;
