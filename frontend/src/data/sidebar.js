import { FaTh, FaUser, FaUserCog, FaRegChartBar, FaCommentAlt, FaHospitalUser } from "react-icons/fa";
import { BiImageAdd } from "react-icons/bi";

const menu = [
  {
    title: "Dashboard",
    icon: <FaTh />,
    path: "/dashboard",
  },
  {
    title: "Add Product",
    icon: <BiImageAdd />,
    path: "/add-product",
  },
  {
    title: "Account",
    icon: <FaRegChartBar />,
    childrens: [
      {
        title: "Profile",
        path: "/profile",
        icon: <FaUser />,
      },
      {
        title: "Edit Profile",
        path: "/edit-profile",
        icon: <FaUserCog />,
      },
    ],
  },
  {
    title: "Report Bug",
    icon: <FaCommentAlt />,
    path: "/contact-us",
  },
  {
    title: "User List",
    icon: <FaHospitalUser />,
    path: "/users",
  },
];

export default menu;