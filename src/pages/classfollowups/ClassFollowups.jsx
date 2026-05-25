import React from "react";
import Layout from "../../layout/Layout";
import DownloadCommon from "../download/delivery/DeliveryDownload";
import { ToastContainer } from "react-toastify";
import PageTitle from "../../components/common/PageTitle";
import { Card } from "@material-tailwind/react";
import Moment from "moment";
import { Button, Input } from "@material-tailwind/react";
import Dropdown from "../../components/common/DropDown";
import BASE_URL from "../../base/BaseUrl";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ButtonCreate } from "../../components/common/ButtonCss";

import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
  DownloadEnquiryDownload,
  DownloadEnquiryView,
} from "../../components/buttonIndex/ButtonComponents";

const ClassFollowups = () => {
  const navigate = useNavigate();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleClick = () => {
    navigate("-1");
  };

  //FROM AND TO DATE
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  var todayback = yyyy + "-" + mm + "-" + dd;

  const firstdate = Moment().startOf("month").format("YYYY-MM-DD");

  const [downloadClassFollowup, setClassFollowup] = useState({
    class_followup_date_from: firstdate,
    class_followup_date_to: todayback,
    class_followup_course: "",
  });

  //   const status = [
  //     { value: "New Enquiry", label: "New Enquiry" },
  //     { value: "Postponed", label: "Postponed" },
  //     { value: "In Process", label: "In Process" },
  //     { value: "Not Interested Closed", label: "Not Interested Closed" },
  //   ];

  //SUBMIT
  const onSubmit = (e) => {
    e.preventDefault();

    const data = {
      enquiry_date_from: downloadClassFollowup.class_followup_date_from,
      enquiry_date_to: downloadClassFollowup.class_followup_date_to,
      class_follow_course: downloadClassFollowup.class_followup_course,
    };

    const v = document.getElementById("dowRecp").reportValidity();

    if (v) {
      setIsButtonDisabled(true);

      axios({
        url: BASE_URL + "/api/panel-download-classfollowup",
        method: "POST",
        data,
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "class_follow_up.csv");

          document.body.appendChild(link);
          link.click();

          link.remove();
          window.URL.revokeObjectURL(url);

          toast.success("class-follow-up downloaded successfully");
        })
        .catch((err) => {
          toast.error("class-follow-up not downloaded");
        })
        .finally(() => {
          setIsButtonDisabled(false);
        });
    }
  };

  //LOCAL STORAGE SET
  const onReportView = (e) => {
    e.preventDefault();

    localStorage.setItem(
      "class_followup_date_from",
      downloadClassFollowup.class_followup_date_from,
    );

    localStorage.setItem(
      "class_followup_date_to",
      downloadClassFollowup.class_followup_date_to,
    );

    localStorage.setItem(
      "class_followup_course",
      downloadClassFollowup.class_followup_course,
    );

    navigate("/classfollowupreport");
  };
  //FETCHCOURSE
  const [course, setCourse] = useState([]);
  useEffect(() => {
    axios({
      url: BASE_URL + "/api/panel-fetch-course",
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      setCourse(res.data.course);
    });
  }, []);

  return (
    <Layout>
      <DownloadCommon />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="mt-4 mb-6">
        <PageTitle
          title={"Download Class Followups"}
          // icon={FaArrowCircleLeft}
          // backLink="-1"
        />

        <Card className="p-4">
          <h3 className="text-red-500 mb-5">
            Leave blank if you want all records.
          </h3>

          <form id="dowRecp" autoComplete="off">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="w-full">
                <Input
                  type="date"
                  label="From Date "
                  className="required"
                  value={downloadClassFollowup.class_followup_date_from}
                  onChange={(e) =>
                    setClassFollowup({
                      ...downloadClassFollowup,
                      class_followup_date_from: e.target.value,
                    })
                  }
                />
              </div>
              <div className="w-full">
                <Input
                  type="date"
                  label="To Date"
                  className="required"
                  value={downloadClassFollowup.class_followup_date_to}
                  onChange={(e) =>
                    setClassFollowup({
                      ...downloadClassFollowup,
                      class_followup_date_to: e.target.value,
                    })
                  }
                />
              </div>
              <div className="w-full">
                <Dropdown
                  label="Course"
                  className="required"
                  options={course.map((item, index) => ({
                    value: item.courses_name,
                    label: item.courses_name,
                  }))}
                  onChange={(value) =>
                    setClassFollowup({
                      ...downloadClassFollowup,
                      class_followup_course: value,
                    })
                  }
                />
              </div>

              {/* <div className="w-full">
                <Dropdown
                  label="Status"
                  className="required"
                  options={status}
                  onChange={(value) =>
                    setEnquiryDownload({
                      ...downloadEnquiry,
                      enquiry_status: value,
                    })
                  }
                />
              </div> */}
            </div>
            <div className="flex justify-center m-3">
              <DownloadEnquiryDownload
                className={ButtonCreate}
                onClick={onSubmit}
                disabled={isButtonDisabled}
              >
                {isButtonDisabled ? "Downloading..." : "Download"}
              </DownloadEnquiryDownload>

              <DownloadEnquiryView
                className={ButtonCreate}
                onClick={onReportView}
              >
                View
              </DownloadEnquiryView>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default ClassFollowups;
