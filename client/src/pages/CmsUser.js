import "../styles/cms_user.scss";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

const CmsUser = () => {
  const [action, setAction] = useState();
  const [currentUser, setCurrentUser] = useState();

  const [data, setData] = useState([
    {
      id: 1,
      name: "Developer",
      username: "developer",
      role: "Admin",
      company: "PT. Berau Coal",
      updated_at: "2023-08-31 14:53:16",
    },
    {
      id: 2,
      name: "Developer",
      username: "developer",
      role: "Admin",
      company: "PT. Berau Coal",
      updated_at: "2023-08-31 14:53:16",
    },
    {
      id: 3,
      name: "Developer",
      username: "developer",
      role: "Admin",
      company: "PT. Berau Coal",
      updated_at: "2023-08-31 14:53:16",
    },
    {
      id: 4,
      name: "Developer",
      username: "developer",
      role: "Admin",
      company: "PT. Berau Coal",
      updated_at: "2023-08-31 14:53:16",
    },
    {
      id: 5,
      name: "Developer",
      username: "developer",
      role: "Admin",
      company: "PT. Berau Coal",
      updated_at: "2023-08-31 14:53:16",
    },
    {
      id: 6,
      name: "Developer",
      username: "developer",
      role: "Admin",
      company: "PT. Berau Coal",
      updated_at: "2023-08-31 14:53:16",
    },
    {
      id: 7,
      name: "Developer",
      username: "developer",
      role: "Admin",
      company: "PT. Berau Coal",
      updated_at: "2023-08-31 14:53:16",
    },
    {
      id: 8,
      name: "Developer",
      username: "developer",
      role: "Admin",
      company: "PT. Berau Coal",
      updated_at: "2023-08-31 14:53:16",
    },
    {
      id: 9,
      name: "Developer",
      username: "developer",
      role: "Admin",
      company: "PT. Berau Coal",
      updated_at: "2023-08-31 14:53:16",
    },
    {
      id: 10,
      name: "Developer",
      username: "developer",
      role: "Admin",
      company: "PT. Berau Coal",
      updated_at: "2023-08-31 14:53:16",
    },
  ]);

  const [addDataForm, setAddDataForm] = useState({
    id: data[data.length - 1].id + 1,
    name: "",
    username: "",
    role: "",
    company: "",
    updated_at: new Date().toISOString().slice(0, 19).replace("T", " "),
  });

  const [editDataForm, setEditDataForm] = useState({});

  useEffect(() => {
    setAddDataForm({
      id: data[data.length - 1].id + 1,
      name: "",
      username: "",
      role: "",
      company: "",
      updated_at: new Date().toISOString().slice(0, 19).replace("T", " "),
    });
  }, [data]);

  const addUser = (data) => {
    setData((array) => [...array, data]);
  };

  const editUser = (userId) => {};

  const deleteUser = (userId) => {
    setData(data.filter((user) => user.id !== userId));
  };

  const userArr = data.map((user) => {
    return (
      <tr className="align-middle">
        <th className="text-center" scope="row">
          {user.id}
        </th>
        <td className="text-center">
          <input
            className="form-control w-100"
            type="text"
            value={editDataForm.id !== user.id ? user.name : editDataForm.name}
            disabled={currentUser === user.id ? false : true}
            onChange={(e) => {
              setEditDataForm({ ...editDataForm, name: e.target.value });
            }}
          />
        </td>
        <td className="text-center">
          <input
            className="form-control w-100"
            type="text"
            value={user.username}
            disabled={currentUser === user.id ? false : true}
            onChange={(e) => {
              setAddDataForm({ ...addDataForm, name: e.target.value });
            }}
          />
        </td>
        <td className="text-center">
          <input
            className="form-control w-100"
            type="text"
            value={user.role}
            disabled={currentUser === user.id ? false : true}
            onChange={(e) => {
              setAddDataForm({ ...addDataForm, name: e.target.value });
            }}
          />
        </td>
        <td className="text-center">
          <input
            className="form-control w-100"
            type="text"
            value={user.company}
            disabled={currentUser === user.id ? false : true}
            onChange={(e) => {
              setAddDataForm({ ...addDataForm, name: e.target.value });
            }}
          />
        </td>
        {currentUser === user.id ? (
          <td className="text-center">
            <button
              className="border-0 me-2"
              onClick={() => {
                setCurrentUser();
                action === "edit" ? editUser(user.id) : deleteUser(user.id);
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
                setCurrentUser(user.id);
                setAction("edit");
                setEditDataForm(user);
              }}
            >
              <Icon className="icon" icon="material-symbols:edit" />
            </button>
            <button
              className="border-0"
              onClick={() => {
                setCurrentUser(user.id);
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
          <h1>CMS - Pengguna</h1>
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
                Total pengguna pada <br /> BMO 2 Blok 8
              </label>
              <div className="info-content d-flex justify-content-center align-items-end gap-1">
                <label>{data.length}</label>
                <label>pengguna</label>
              </div>
              <div className="info-other d-flex justify-content-end align-items-center gap-1">
                <Icon className="icon" icon="clarity:server-solid" />
                <label>10.10.10.66</label>
              </div>
            </div>
          </div>
          <div className="col-3 p-0">
            <div className="info rounded-2 d-grid gap-3 px-3 py-2">
              <label className="info-title">Jumlah pengguna yang online</label>
              <div className="info-content d-flex justify-content-center align-items-end gap-1">
                <label>3</label>
                <label>pengguna</label>
              </div>
              <div className="info-other d-flex justify-content-end align-items-center gap-1">
                <Icon className="icon" icon="akar-icons:clock" />
                <label>01.23 WITA</label>
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
                    Nama Pengguna
                  </th>
                  <th className="table-header" scope="col">
                    Username
                  </th>
                  <th className="table-header" scope="col">
                    Role
                  </th>
                  <th className="table-header" scope="col">
                    Instansi
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
                      placeholder="Masukkan nama"
                      disabled={!currentUser ? false : true}
                      onChange={(e) => {
                        setAddDataForm({ ...addDataForm, name: e.target.value });
                      }}
                    />
                  </td>
                  <td className="text-center">
                    <input
                      className="form-control w-100"
                      type="text"
                      value={addDataForm.username}
                      placeholder="Masukkan username"
                      disabled={!currentUser ? false : true}
                      onChange={(e) => {
                        setAddDataForm({ ...addDataForm, username: e.target.value });
                      }}
                    />
                  </td>
                  <td className="text-center">
                    <input
                      className="form-control w-100"
                      type="text"
                      value={addDataForm.role}
                      placeholder="Masukkan role"
                      disabled={!currentUser ? false : true}
                      onChange={(e) => {
                        setAddDataForm({ ...addDataForm, role: e.target.value });
                      }}
                    />
                  </td>
                  <td className="text-center">
                    <input
                      className="form-control w-100"
                      type="text"
                      value={addDataForm.company}
                      placeholder="Masukkan instansi"
                      disabled={!currentUser ? false : true}
                      onChange={(e) => {
                        setAddDataForm({ ...addDataForm, company: e.target.value });
                      }}
                    />
                  </td>
                  <td className="text-center">
                    <button
                      className="border-0"
                      onClick={() => {
                        addUser(addDataForm);
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

export default CmsUser;
