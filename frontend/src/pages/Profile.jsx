import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";
import Navbar from "./Navbar";

export default function UserProfilePage() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const [user, setUser] = useState({});
  const [profileImage, setProfileImage] = useState("");

  const [school, setSchool] = useState({ name: "", year: "", marks: "" });
  const [college, setCollege] = useState({ cname: "", cyear: "", cmarks: "" });
  const [degree, setDegree] = useState({ dname: "", dyear: "", dmarks: "" });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [ed, setEd] = useState({ school: {}, college: {}, degree: {} });
  const [work, setWork] = useState([]);

  const [pastworks, setPastWorks] = useState([
    { company: "", position: "", years: "" },
  ]);
  const [present, setPresentWork] = useState({
    pcompany: "",
    pposition: "",
  });

  /* ================= DOWNLOAD RESUME ================= */

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/download/${userId}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "resume.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Failed to download resume");
    }
  };

  /* ================= PROFILE IMAGE ================= */

  const handleImageClick = () => {
    document.getElementById("profileInput").click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile", file);

    try {
      const res = await axios.put(
        `http://localhost:8080/profile/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfileImage(res.data.profile);
      alert("Profile image updated");
    } catch (error) {
      alert("Image upload failed");
    }
  };

  /* ================= EDUCATION ================= */

  const handleSchoolChange = (e) =>
    setSchool({ ...school, [e.target.name]: e.target.value });

  const handleCollegeChange = (e) =>
    setCollege({ ...college, [e.target.name]: e.target.value });

  const handleDegreeChange = (e) =>
    setDegree({ ...degree, [e.target.name]: e.target.value });

  const handleEducationSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `http://localhost:8080/education/${userId}`,
        { school, college, degree }
      );

      if (res.data.message === "Studies are saved") {
        setMessage(res.data.message);
        setError("");
      } else {
        setError(res.data.message);
        setMessage("");
      }
    } catch {
      setError("Something went wrong");
      setMessage("");
    }
  };

  /* ================= PRESENT WORK ================= */

  const handlePresentWorkChange = (field, value) => {
    setPresentWork((prev) => ({ ...prev, [field]: value }));
  };

  const handlePresentWorkSubmit = async (e) => {
    e.preventDefault();

    if (!present.pcompany || !present.pposition) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:8080/presentwork/${userId}`,
        { present },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
    } catch (e) {
      console.error(e);
    }
  };

  /* ================= PAST WORK ================= */

  const handleChange = (index, field, value) => {
    const updated = [...pastworks];
    updated[index][field] = value;
    setPastWorks(updated);
  };

  const handleAddPastwork = () => {
    setPastWorks([
      ...pastworks,
      { company: "", position: "", years: "" },
    ]);
  };

  const handlePastWorkSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:8080/addpastwork/${userId}`,
        { pastworks },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Past work added");
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= FETCH USER ================= */

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
        setEd(res.data.education || {});
        setWork(res.data.work || []);
        setProfileImage(res.data.profile);
      } catch (e) {
        console.log(e.message);
      }
    };

    fetchUser();
  }, [token, userId]);

  /* ================= JSX ================= */

  return (
    <>
      <Navbar />

      <main className="profile-page">
        <div className="profile-wrap">
          {/* LEFT COLUMN */}
          <aside className="profile-left">
            <div className="profile-card">
              <div className="profile-image-wrap" onClick={handleImageClick}>
                <img
                  src={profileImage || user.profile}
                  alt="Profile"
                  className="profile-img"
                />
                <div className="upload-hint">Click to change</div>
                <input
                  type="file"
                  id="profileInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              </div>

              <div className="basic-info">
                <h2 className="name">{user.name}</h2>
                <p className="username">@{user.username}</p>
                <p className="email">{user.email}</p>
              </div>

              <div className="card-actions">
                <button className="btn btn-primary" onClick={handleDownload}>
                  Download Resume
                </button>
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN */}
          <section className="profile-right">
            {/* EDUCATION */}
            <section className="section-card">
              <div className="section-header">
                <h3>Education</h3>
              </div>

              {!user?.education || !user.education.school ? (
                <form onSubmit={handleEducationSubmit} className="education-form">

  {/* SCHOOL */}
  <div className="edu-row">
    <input name="name" placeholder="School Name" onChange={handleSchoolChange} />
    <input name="year" placeholder="Year" onChange={handleSchoolChange} />
    <input name="marks" placeholder="Marks" onChange={handleSchoolChange} />
  </div>

  {/* COLLEGE */}
  <div className="edu-row">
    <input name="cname" placeholder="College Name" onChange={handleCollegeChange} />
    <input name="cyear" placeholder="Year" onChange={handleCollegeChange} />
    <input name="cmarks" placeholder="Marks" onChange={handleCollegeChange} />
  </div>

  {/* DEGREE / UG */}
  <div className="edu-row">
    <input name="dname" placeholder="Degree / UG Name" onChange={handleDegreeChange} />
    <input name="dyear" placeholder="Year" onChange={handleDegreeChange} />
    <input name="dmarks" placeholder="Marks" onChange={handleDegreeChange} />
  </div>

  <button className="btn btn-secondary">Save Education</button>

  {message && <span className="msg success">{message}</span>}
  {error && <span className="msg error">{error}</span>}
</form>

              ) : (
                <div className="education-display">
                  <p><strong>School:</strong> {ed.school?.name}</p>
                  <p><strong>Year:</strong> {ed.school?.year}</p>
                  <p><strong>Marks:</strong> {ed.school?.marks}</p>

                  <p><strong>College:</strong> {ed.college?.cname}</p>
                  <p><strong>Year:</strong> {ed.college?.cyear}</p>
                  <p><strong>Marks:</strong> {ed.college?.cmarks}</p>

                  <p><strong>Degree:</strong> {ed.degree?.dname}</p>
                  <p><strong>Year:</strong> {ed.degree?.dyear}</p>
                  <p><strong>Marks:</strong> {ed.degree?.dmarks}</p>
                </div>
              )}
            </section>

            {/* PRESENT WORK */}
            <section className="section-card">
              <h3>Present Work</h3>

              {work[0]?.present ? (
                <div className="info-box">
                  <p><strong>Company:</strong> {work[0].present.pcompany}</p>
                  <p><strong>Position:</strong> {work[0].present.pposition}</p>
                </div>
              ) : (
                <form onSubmit={handlePresentWorkSubmit}>
                  <input
                    placeholder="Company"
                    value={present.pcompany}
                    onChange={(e) =>
                      handlePresentWorkChange("pcompany", e.target.value)
                    }
                  />
                  <input
                    placeholder="Position"
                    value={present.pposition}
                    onChange={(e) =>
                      handlePresentWorkChange("pposition", e.target.value)
                    }
                  />
                  <button className="btn btn-secondary">Add Present Work</button>
                </form>
              )}
            </section>

            {/* PAST WORK */}
            <section className="section-card">
              <h3>Past Work Experience</h3>

              {work[0]?.pastworks?.length > 0 && (
                <div className="past-list">
                  {work[0].pastworks.map((item, i) => (
                    <div className="past-item" key={i}>
                      <p><strong>Company:</strong> {item.company}</p>
                      <p><strong>Position:</strong> {item.position}</p>
                      <p><strong>Years:</strong> {item.years}</p>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handlePastWorkSubmit} className="pastworks-form">
                {pastworks.map((item, i) => (
                  <div className="form-row" key={i}>
                    <input
                      placeholder="Company"
                      value={item.company}
                      onChange={(e) =>
                        handleChange(i, "company", e.target.value)
                      }
                    />
                    <input
                      placeholder="Position"
                      value={item.position}
                      onChange={(e) =>
                        handleChange(i, "position", e.target.value)
                      }
                    />
                    <input
                      placeholder="Years"
                      value={item.years}
                      onChange={(e) =>
                        handleChange(i, "years", e.target.value)
                      }
                    />
                  </div>
                ))}

                <button type="button" onClick={handleAddPastwork}>
                  + Add Another
                </button>
                <button className="btn btn-secondary">Submit</button>
              </form>
            </section>
          </section>
        </div>
      </main>
    </>
  );
}
