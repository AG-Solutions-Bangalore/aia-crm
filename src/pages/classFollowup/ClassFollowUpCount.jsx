import { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import BASE_URL from "../../base/BaseUrl";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import moment from "moment";
import { Edit, HighlightOff } from "@mui/icons-material";
import { Card, CardContent, Dialog, Tooltip } from "@mui/material";
import Fields from "../../components/common/TextField/TextField";
import { toast } from "react-toastify";
import { ClassFollowUpCreate } from "../../components/buttonIndex/ButtonComponents";
import { ButtonCreate } from "../../components/common/ButtonCss";

const ClassFollowUpCount = () => {
  const dateyear = ["2024-25"];

  const navigate = useNavigate();

  const [cardData, setCardData] = useState([]);

  const [open, setOpen] = useState(false);

  const [course, setCourse] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [filters, setFilters] = useState({
    date: "",
    course: "",
  });
  const [filterCourse, setFilterCourse] = useState([]);
  console.log("filterCourse", filterCourse);
  const [student, setClass] = useState({
    class_date: "",
  });

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };
  const clearFilters = () => {
    setFilters({
      date: "",
      course: "",
    });
  };
  const filteredData = cardData.filter((item) => {
    const formattedDate = moment(item.class_follow_date).format("YYYY-MM-DD");

    const matchDate = filters.date ? formattedDate === filters.date : true;

    const matchCourse = filters.course
      ? item.class_follow_course === filters.course
      : true;

    return matchDate && matchCourse;
  });

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("id");
    if (!isLoggedIn) {
      navigate("/");
      return;
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/panel-classfollowup-count`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        setCardData(response.data?.student);
        setFilterCourse(response.data?.student);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/panel-fetch-course`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCourse(response.data.course);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchUserData();
  }, []);

  const onInputChange = (e) => {
    setClass({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setIsButtonDisabled(true);
    const formData = {
      class_subject: student.class_subject,
    };
    try {
      const response = await axios.post(
        `${BASE_URL}/api/panel-create-classfollowup`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.data.code == 200) {
        // setReloadData(true);
        handleClose();
        toast.success(response.data.msg);
      } else {
        if (response.data.code == "401") {
          toast.error(response.data.msg);
        } else if (response.data.code == "402") {
          toast.error(response.data.msg);
        } else {
          toast.error(response.data.msg);
        }
      }
    } catch (error) {
      console.error("Error updating Class Follow Up:", error);
      toast.error("Error updating Class Follow Up");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const handleClick = (data, index) => {
    localStorage.setItem("class_follow_date", data.class_follow_date);
    localStorage.setItem("class_follow_course", data.class_follow_course);
    navigate("/class-followup", { state: { selectedData: data } });
  };

  return (
    <Layout>
      <div className="mt-10 ">
        <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
          <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
            Follow-Ups History
          </h3>
          {/* <button
            onClick={handleClickOpen}
            className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
          >
            Create FollowUp
          </button> */}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Date
              </label>
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Course Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Course
              </label>

              <select
                name="course"
                value={filters.course}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Courses</option>

                {[...new Set(cardData.map((item) => item.class_follow_course))]
                  .sort((a, b) => a.localeCompare(b))
                  .map((courseName, index) => (
                    <option key={index} value={courseName}>
                      {courseName}
                    </option>
                  ))}
              </select>
            </div>

            {/* Clear Button */}
            <div>
              <button
                onClick={clearFilters}
                className="bg-red-500 hover:bg-red-600 text-white px-2 py-2 rounded-lg shadow-md w-50"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <ClassFollowUpCreate
            className={ButtonCreate}
            onClick={handleClickOpen}
          ></ClassFollowUpCreate>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-6 gap-4">
        {filteredData &&
          filteredData.map((data, index) => (
            <div
              onClick={() => handleClick(data, index)}
              key={index}
              className="cursor-pointer"
            >
              <div className="bg-white shadow-lg rounded-lg p-3 hover:shadow-2xl transition-shadow duration-300 ease-in-out">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-800">
                    {moment(data.class_follow_date).format("DD-MM-YYYY")}
                  </p>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="text-center">
                  <p className="text-md font-medium text-gray-700">
                    {data.class_follow_course}
                  </p>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="text-center">
                  <p className="text-3xl font-semibold text-indigo-600">
                    <CountUp start={0} end={data.total} />
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
      <Dialog
        open={open}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        // className="m-3  rounded-lg shadow-xl"
      >
        <form onSubmit={onSubmit} autoComplete="off">
          <Card className="p-6 space-y-1 w-[400px]">
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-slate-800 text-xl font-semibold">
                  View Class Follow Up List
                </h1>
                <div className="flex">
                  <Tooltip title="Close">
                    <button
                      className="ml-3 pl-2 hover:bg-gray-200 rounded-full"
                      onClick={handleClose}
                    >
                      <HighlightOff />
                    </button>
                  </Tooltip>
                </div>
              </div>

              <div className="mt-2">
                <div>
                  <Fields
                    required={true}
                    title="Course"
                    type="courseDropdown"
                    autoComplete="Name"
                    name="class_subject"
                    value={student.class_subject}
                    onChange={(e) => onInputChange(e)}
                    options={course}
                  />
                </div>
                <div className="mt-5 flex justify-center">
                  <button
                    disabled={isButtonDisabled}
                    type="submit"
                    className={ButtonCreate}
                  >
                    {isButtonDisabled ? "Submiting..." : "Submit"}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Dialog>
    </Layout>
  );
};

export default ClassFollowUpCount;
