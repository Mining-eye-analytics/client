import "../styles/cms.scss";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

const CmsCctv = () => {
  const [action, setAction] = useState();
  const [currentCctv, setCurrentCctv] = useState();
  const [formMessage, setFormMessage] = useState("");

  const [data, setData] = useState([
    {
      id: 1,
      name: "BMO2",
      location: "Ipdch031",
      ip: "10.1.80.200",
      link: "rtsp://10.1.80.200:8554/ipdch031",
      username: "miningeyes",
      password: "miningeyes",
    },
    {
      id: 2,
      name: "BMO2",
      location: "Ipdch031",
      ip: "10.1.80.200",
      link: "rtsp://10.1.80.200:8554/ipdch031",
      username: "miningeyes",
      password: "miningeyes",
    },
    {
      id: 3,
      name: "BMO2",
      location: "Ipdch031",
      ip: "10.1.80.200",
      link: "rtsp://10.1.80.200:8554/ipdch031",
      username: "miningeyes",
      password: "miningeyes",
    },
  ]);

  const [addDataForm, setAddDataForm] = useState({
    id: data.length !== 0 ? data[data.length - 1]?.id + 1 : 1,
    name: "",
    location: "",
    ip: "",
    link: "",
    username: "",
    password: "",
  });

  const [editDataForm, setEditDataForm] = useState({});

  useEffect(() => {
    setAddDataForm({
      id: data.length !== 0 ? data[data.length - 1]?.id + 1 : 1,
      name: "",
      location: "",
      ip: "",
      link: "",
      username: "",
      password: "",
    });

    setEditDataForm({});
  }, [data]);

  const addCctv = (addForm) => {
    if (
      addForm.name !== "" &&
      addForm.location !== "" &&
      addForm.ip !== "" &&
      addForm.link !== ""
    ) {
      setData((array) => [...array, addForm]);
      setFormMessage("");
    } else {
      setFormMessage("*form tidak boleh kosong");
    }
  };

  const editCctv = (editForm, index) => {
    const temporaryData = data;
    temporaryData[index] = editForm;
    setData(temporaryData);
    setFormMessage("");
  };

  const deleteCctv = (cctvId) => {
    setData(data.filter((cctv) => cctv.id !== cctvId));
  };

  const cctvArr = data.map((cctv, index) => {
    return (
      <tr className="align-middle">
        <th className="text-center" scope="row">
          {cctv.id}
        </th>
        <td className="text-center">
          <input
            className="form-control w-100"
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
            className="form-control w-100"
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
            className="form-control w-100"
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
            className="form-control w-100"
            type="text"
            value={editDataForm.id !== cctv.id ? cctv.link : editDataForm.link}
            placeholder="Masukkan link RTSP"
            disabled={currentCctv === cctv.id ? false : true}
            onChange={(e) => {
              setEditDataForm({ ...editDataForm, link: e.target.value });
            }}
          />
        </td>
        <td className="text-center">
          <input
            className="form-control w-100"
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
            className="form-control w-100"
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
              <Icon className="icon icon-green" icon="mingcute:check-fill" />
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
              <Icon className="icon icon-red" icon="ep:close-bold" />
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
              <Icon className="icon icon-green" icon="material-symbols:edit" />
            </button>
            <button
              className="border-0"
              onClick={() => {
                setCurrentCctv(cctv.id);
                setAction("delete");
              }}
            >
              <Icon className="icon icon-red" icon="mingcute:delete-fill" />
            </button>
          </td>
        )}
      </tr>
    );
  });

  return (
    <div className="dashboard d-flex flex-column gap-3">
      <div className="row m-0">
        <div className="col p-0">
          <h1>CMS - CCTV</h1>
        </div>
        <div className="col p-0 d-flex justify-content-end">
          <button className="border-0 rounded-2 px-3 py-2 d-flex align-items-center gap-1">
            <Icon className="icon" icon="entypo:export" />
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
                  <label>{data.length}</label>
                  <label>CCTV</label>
                </div>
                <div className="info-content">
                  <label></label>
                  <label>-</label>
                </div>
                <div className="info-content d-flex align-items-end gap-1">
                  <label>6</label>
                  <label>CCTV</label>
                </div>
              </div>

              <div className="info-other d-flex justify-content-end align-items-center gap-1">
                <Icon className="icon" icon="carbon:location-filled" />
                <label>BMO 2</label>
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
              <div className="info-other d-flex justify-content-end align-items-center gap-1">
                <Icon className="icon" icon="bi:calendar-week" />
                <label>30 Mei 2023</label>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="row m-0 mb-2">
            <div className="col p-0">
              <label>Daftar Pengguna</label>
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
                      className="form-control w-100"
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
                      className="form-control w-100"
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
                      className="form-control w-100"
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
                      className="form-control w-100"
                      type="text"
                      value={addDataForm.link}
                      placeholder="Masukkan link RTSP"
                      disabled={!currentCctv ? false : true}
                      onChange={(e) => {
                        setAddDataForm({
                          ...addDataForm,
                          link: e.target.value,
                        });
                      }}
                    />
                  </td>
                  <td className="text-center">
                    <input
                      className="form-control w-100"
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
                      className="form-control w-100"
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
                    <button
                      className="border-0"
                      onClick={() => {
                        addCctv(addDataForm);
                      }}
                    >
                      Tambah Data
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
