import "../styles/cms_user.scss";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

const CmsCctv = () => {
  const [action, setAction] = useState();
  const [currentUser, setCurrentUser] = useState();

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

  const [formData, setFormData] = useState({
    id: data[data.length - 1].id + 1,
    name: "",
      location: "",
      ip: "",
      link: "",
      username: "",
      password: "",
  });

  useEffect(() => {
    setFormData({
      id: data[data.length - 1].id + 1,
      name: "",
      location: "",
      ip: "",
      link: "",
      username: "",
      password: "",
    });
  }, [data]);

  const addUser = (data) => {
    setData((array) => [...array, data]);
  };

  const editUser = (userId) => {};

  const deleteUser = (userId) => {
    setData(data.filter((user) => user.id !== userId));
  };

  const userArr = data.map((cctv) => {
    return (
      <tr className="align-middle">
        <th className="text-center" scope="row">
          {cctv.id}
        </th>
        <td className="text-center">
          <input
            className="form-control w-100"
            type="text"
            value={cctv.name}
            disabled={currentUser === cctv.id ? false : true}
          />
        </td>
        <td className="text-center">
          <input
            className="form-control w-100"
            type="text"
            value={cctv.location}
            disabled={currentUser === cctv.id ? false : true}
          />
        </td>
        <td className="text-center">
          <input
            className="form-control w-100"
            type="text"
            value={cctv.ip}
            disabled={currentUser === cctv.id ? false : true}
          />
        </td>
        <td className="text-center">
          <input
            className="form-control w-100"
            type="text"
            value={cctv.link}
            disabled={currentUser === cctv.id ? false : true}
          />
        </td>
        <td className="text-center">
          <input
            className="form-control w-100"
            type="text"
            value={cctv.username}
            disabled={currentUser === cctv.id ? false : true}
          />
        </td>
        <td className="text-center">
          <input
            className="form-control w-100"
            type="text"
            value={cctv.password}
            disabled={currentUser === cctv.id ? false : true}
          />
        </td>
        {currentUser === cctv.id ? (
          <td className="text-center">
            <button
              className="border-0 me-2"
              onClick={() => {
                setCurrentUser();
                action === "edit" ? editUser(cctv.id) : deleteUser(cctv.id);
              }}
            >
              <Icon className="icon" icon="mingcute:check-fill" />
            </button>
            <button
              className="border-0"
              onClick={() => {
                setCurrentUser();
                setAction();
              }}
            >
              <Icon className="icon" icon="ep:close-bold" />
            </button>
          </td>
        ) : (
          <td className="text-center">
            <button
              className="border-0 me-2"
              onClick={() => {
                setCurrentUser(cctv.id);
                setAction("edit");
              }}
            >
              <Icon className="icon" icon="material-symbols:edit" />
            </button>
            <button
              className="border-0"
              onClick={() => {
                setCurrentUser(cctv.id);
                setAction("delete");
              }}
            >
              <Icon className="icon" icon="mingcute:delete-fill" />
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
          <div className="mb-2">
            <label>Daftar Pengguna</label>
          </div>
          <div className="user-table overflow-auto">
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
                      value={formData.name}
                      placeholder="Masukkan nama CCTV"
                      disabled={!currentUser ? false : true}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                      }}
                    />
                  </td>
                  <td className="text-center">
                    <input
                      className="form-control w-100"
                      type="text"
                      value={formData.location}
                      placeholder="Masukkan lokasi CCTV"
                      disabled={!currentUser ? false : true}
                      onChange={(e) => {
                        setFormData({ ...formData, location: e.target.value });
                      }}
                    />
                  </td>
                  <td className="text-center">
                    <input
                      className="form-control w-100"
                      type="text"
                      value={formData.ip}
                      placeholder="Masukkan IP"
                      disabled={!currentUser ? false : true}
                      onChange={(e) => {
                        setFormData({ ...formData, ip: e.target.value });
                      }}
                    />
                  </td>
                  <td className="text-center">
                    <input
                      className="form-control w-100"
                      type="text"
                      value={formData.link}
                      placeholder="Masukkan link RTSP"
                      disabled={!currentUser ? false : true}
                      onChange={(e) => {
                        setFormData({ ...formData, link: e.target.value });
                      }}
                    />
                  </td>
                  <td className="text-center">
                    <input
                      className="form-control w-100"
                      type="text"
                      value={formData.username}
                      placeholder="Masukkan username"
                      disabled={!currentUser ? false : true}
                      onChange={(e) => {
                        setFormData({ ...formData, username: e.target.value });
                      }}
                    />
                  </td>
                  <td className="text-center">
                    <input
                      className="form-control w-100"
                      type="text"
                      value={formData.password}
                      placeholder="Masukkan password"
                      disabled={!currentUser ? false : true}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                      }}
                    />
                  </td>
                  <td className="text-center">
                    <button
                      className="border-0"
                      onClick={() => {
                        addUser(formData);
                      }}
                    >
                      Tambah Data
                    </button>
                  </td>
                </tr>
                {userArr}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CmsCctv;
