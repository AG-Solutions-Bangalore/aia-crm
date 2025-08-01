import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import EnquiryFilter from "../../../components/EnquiryFilter";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { MdEdit } from "react-icons/md";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import MUIDataTable from "mui-datatables";
import moment from "moment";
import {
  EnquiryOverDueCreate,
  EnquiryOverDueEdit,
  EnquiryOverDueView,
} from "../../../components/buttonIndex/ButtonComponents";
import { ButtonCreate } from "../../../components/common/ButtonCss";

const OverdueListEnquiry = () => {
  const [overdueListData, setOverdueListData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const fetchOverData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-overdue-enquiry-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        let res = response.data?.enquiry;
        if (Array.isArray(res)) {
          const tempRows = res.map((item) => [
            item["enquiry_no"],
            moment(item["enquiry_date"]).format("DD-MM-YYYY"),
            moment(item["enquiry_follow_date"]).format("DD-MM-YYYY"),

            item["enquiry_title"] + " " + item["enquiry_full_name"],
            item["enquiry_mobile"],
            item["enquiry_city"],
            item["enquiry_course"],
            item["enquiry_status"],
            item["id"],
          ]);
          console.log(tempRows, "tempRows");
          setOverdueListData(response.data?.enquiry);
        }
      } catch (error) {
        console.error("Error fetching overdue list enquiry data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOverData();
    setLoading(false);
  }, []);

  const columns = [
    {
      name: "enquiry_no",
      label: "Enquiry No",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "enquiry_date",
      label: "Enquiry Date",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return moment(value).format("DD-MM-YYYY");
        },
      },
    },
    {
      name: "enquiry_follow_date",
      label: "Followup Date",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return moment(value).format("DD-MM-YYYY");
        },
      },
    },
    {
      name: "enquiry_full_name",
      label: "Full Name",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "enquiry_mobile",
      label: "Mobile No",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "enquiry_city",
      label: "City",
      options: {
        filter: false,
        sort: false,
      },
    },

    {
      name: "enquiry_course",
      label: "Courses",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "enquiry_employee_name",
      label: "Employee Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "enquiry_status",
      label: "Status",
      options: {
        filter: false,
        sort: true,
      },
    },

    {
      name: "id",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (id) => {
          return (
            <div className="flex items-center space-x-2">
              {/* <MdEdit
                onClick={(e) => handleOpenButtonLink(e, `${id}`)}
                title="edit"
                className="h-5 w-5 cursor-pointer"
              /> */}
              <EnquiryOverDueEdit
                onClick={(e) => handleOpenButtonLink(e, `${id}`)}
                className="h-5 w-5 cursor-pointer"
              />
              {/* <MdOutlineRemoveRedEye
                onClick={(e) => handleOpenButtonLinkView(e, `${id}`)}
                title="view"
                className="h-5 w-5 cursor-pointer"
              /> */}
              <EnquiryOverDueView
                onClick={(e) => handleOpenButtonLinkView(e, `${id}`)}
                className="h-5 w-5 cursor-pointer"
              />
            </div>
          );
        },
      },
    },
  ];
  const options = {
    selectableRows: "none",
    elevation: 0,

    responsive: "standard",
    viewColumns: true,
    download: true,
    print: true,
  };

  const handleOpenButton = (e) => {
    e.preventDefault();
    localStorage.setItem("enquiry_page", location.pathname);
    navigate("/add-enquiry");
  };

  const handleOpenButtonLink = (e, value) => {
    e.preventDefault();
    localStorage.setItem("enquiry_page", location.pathname);
    navigate(`/edit-enquiry/${value}`);
  };

  const handleOpenButtonLinkView = (e, value) => {
    e.preventDefault();
    localStorage.setItem("enquiry_page", location.pathname);
    navigate(`/view-enquiry/${value}`);
  };
  return (
    <Layout>
      <EnquiryFilter />
      <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Enquiry Overdue List
        </h3>

        {/* <button
          onClick={handleOpenButton}
          className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
        >
          + Add Enquiry
        </button> */}
        <EnquiryOverDueCreate
          onClick={handleOpenButton}
          className={ButtonCreate}
        />
      </div>
      <div className="mt-5">
        <MUIDataTable
          data={overdueListData ? overdueListData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default OverdueListEnquiry;
