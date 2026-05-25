import BASE_URL from "../../base/BaseUrl";
import PageTitle from "../../components/common/PageTitle";
import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Typography } from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
import { FaArrowCircleLeft, FaArrowDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Moment from "moment";
import Layout from "../../layout/Layout";

function ClassFollowupReport() {
  const navigate = useNavigate();

  const TABLE_HEAD = [
    "SL NO",
    "Name",
    "Mobile",
    "Course",
    "Followup Create Date",
    "Followup Next Date",
    "Remarks",
  ];
  const [summary, setSummary] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // DOWNLOAD CSV
  const onSubmit = (e) => {
    e.preventDefault();

    let data = {
      enquiry_date_from: localStorage.getItem("class_followup_date_from"),
      enquiry_date_to: localStorage.getItem("class_followup_date_to"),
      class_follow_course: localStorage.getItem("class_followup_course"),
    };

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

        toast.success("Downloaded Successfully");
      })
      .catch(() => {
        toast.error("Download Failed");
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  // FETCH REPORT DATA
  useEffect(() => {
    let data = {
      enquiry_date_from: localStorage.getItem("class_followup_date_from"),
      enquiry_date_to: localStorage.getItem("class_followup_date_to"),
      class_follow_course: localStorage.getItem("class_followup_course"),
    };

    axios({
      url: BASE_URL + "/api/fetch-classfollowup-report",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      console.log(res.data);
      setSummary(res.data.data || []);
    });
  }, []);

  return (
    <Layout>
      <ToastContainer />

      <div className="mt-4">
        <PageTitle
          title={"Class Followup Report"}
          icon={FaArrowCircleLeft}
          backLink="/class-followups"
        />
      </div>

      <Card>
        <div
          className="mt-4 flex justify-end cursor-pointer p-2 mr-10"
          onClick={onSubmit}
        >
          <div className="flex items-center gap-2">
            <FaArrowDown />
            <span className="font-bold text-sm">Download</span>
          </div>
        </div>

        <hr />

        <div className="flex justify-center font-bold text-2xl mt-4">
          <h2>Class Followup Report</h2>
        </div>

        <Card className="h-full w-full overflow-scroll p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  {TABLE_HEAD.map((head) => (
                    <th key={head} className="py-3 px-6 text-left">
                      <Typography className="font-bold">{head}</Typography>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="text-gray-600 text-sm font-light">
                {summary.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 whitespace-nowrap">{index + 1}</td>
                    <td className="py-3 pl-3 pr-2 whitespace-nowrap">
                      {item.name}
                    </td>

                    <td className="py-3 pl-2 pr-3 whitespace-nowrap">
                      {item.mobile}
                    </td>

                    <td className="py-3 px-6 whitespace-nowrap">
                      {item.follow_course}
                    </td>

                    <td className="py-3 px-6 whitespace-nowrap">
                      {item.follow_up_create_date
                        ? Moment(item.follow_up_create_date).format(
                            "DD-MM-YYYY",
                          )
                        : ""}
                    </td>

                    <td className="py-3 px-6 whitespace-nowrap">
                      {item.follow_up_next_date
                        ? Moment(item.follow_up_next_date).format("DD-MM-YYYY")
                        : ""}
                    </td>

                    <td className="py-3 px-6">{item.follow_up_remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Card>
    </Layout>
  );
}

export default ClassFollowupReport;
