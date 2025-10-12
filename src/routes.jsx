import React from "react";

import { Icon } from "@chakra-ui/react";
import {
  MdHome,
  MdPerson,
  MdBarChart,
  MdLock,
  MdClass,
  MdSignalCellularAlt,
  MdAttachMoney,
  MdBusiness,
  MdForum,
  MdBuild,
  MdShoppingCart,
  MdGroups
  
} from "react-icons/md";

import { FaLifeRing, FaBell, FaToolbox, FaUserShield } from "react-icons/fa";

import MainDashboard from "views/admin/default";
import Users from "views/admin/users";
import courses from "views/admin/courses";
import signals from "views/admin/signals";
import orders from "views/admin/orders";
import DataTables from "views/admin/dataTables";
import SignInCentered from "views/auth/signIn";
import cashback from "views/admin/cashback";
import companies from "views/admin/companies";
import support from "views/admin/support";
import { MdPayment } from "react-icons/md";
import { MdReceipt } from "react-icons/md"
import announcement from "views/admin/announcement";
import SuperVisors from "views/admin/superVisors";
import blogs from "views/admin/Blogs";
import WhalesRequsts from "views/admin/whalesFamily";
import PaymentsMethods from "views/admin/paymentsMethods";
import Logger from "views/admin/Logger";
import TradingtoolsTable from "views/admin/tradingtools";

import CompetitionsTable from "views/admin/Competitions";
import { MdEmojiEvents } from "react-icons/md";
import videoCoursesManagement from "views/admin/videoCoursesManagement";
import VideoUpload from "views/admin/videoUpload";
import CourseVideosManagement from "views/admin/CourseVideosManagement";
import VideoPlayerPage from "views/admin/VideoPlayerPage";
import CoursePage from "views/user/CoursePage";
import { MdVideoLibrary, MdPlayCircle, MdCloudUpload } from "react-icons/md";


const routes = [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: MainDashboard,
  },

  {
    name: "Users",
    layout: "/admin",
    path: "/users",
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: Users,
  },
  {
    name: "Courses",
    layout: "/admin",
    icon: <Icon as={MdClass} width="20px" height="20px" color="inherit" />,
    path: "/courses",
    component: courses,
  },
  {
    name: "Video Courses",
    layout: "/admin",
    icon: <Icon as={MdVideoLibrary} width="20px" height="20px" color="inherit" />,
    path: "/video-courses",
    component: videoCoursesManagement,
  },
  {
    name: "Upload Video",
    layout: "/admin",
    icon: <Icon as={MdCloudUpload} width="20px" height="20px" color="inherit" />,
    path: "/video-upload",
    component: VideoUpload,
  },
  {
    name: "Upload Video for Course",
    layout: "/admin",
    path: "/upload-video/:courseId",
    component: VideoUpload,
    hidden: true, // Hidden from sidebar
  },
  {
    name: "Course Videos Management",
    layout: "/admin",
    path: "/course-videos/:courseId",
    component: CourseVideosManagement,
    hidden: true, // Hidden from sidebar
  },
  {
    name: "Video Player",
    layout: "/admin",
    path: "/video-player/:courseId/:videoId",
    component: VideoPlayerPage,
    hidden: true, // Hidden from sidebar
  },


  {
    name: "Signals",
    layout: "/admin",
    icon: (
      <Icon
        as={MdSignalCellularAlt}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    path: "/signals",
    component: signals,
  },
  {
    name: "Orders",
    layout: "/admin",
    icon: (
      <Icon as={MdShoppingCart} width="20px" height="20px" color="inherit" />
    ),
    path: "/orders",
    component: orders,
  },
  {
    name: "Cash back",
    layout: "/admin",
    icon: (
      <Icon as={MdAttachMoney} width="20px" height="20px" color="inherit" />
    ),
    path: "/cashback",
    component: cashback,
  },
  {
    name: "Companies",
    layout: "/admin",
    icon: <Icon as={MdBusiness} width="20px" height="20px" color="inherit" />,
    path: "/companies",
    component: companies,
  },
  {
    name: "Announcement",
    layout: "/admin",
    icon: <Icon as={FaBell} width="20px" height="20px" color="inherit" />,
    path: "/announcement",
    component: announcement,
  },
  {
    name: "Support",
    layout: "/admin",
    icon: <Icon as={FaLifeRing} width="20px" height="20px" color="inherit" />,
    path: "/support",
    component: support,
  },
  {
    name: "Blogs",
    layout: "/admin",
    icon: <Icon as={MdForum} width="20px" height="20px" color="inherit" />,
    path: "/blogs",
    component: blogs,
  },
  {
    name: "Trading Tools",
    layout: "/admin",
    path: "/trading-tools",
    icon: <Icon as={FaToolbox} width="20px" height="20px" color="inherit" />,
    component: TradingtoolsTable,
  },
  {
    name: "Whales Family",
    layout: "/admin",
    path: "/whales-family",
    icon: <Icon as={MdGroups} width="20px" height="20px" color="inherit" />,
    component: WhalesRequsts,
  },
  {
    name: "Supervisors",
    layout: "/admin",
    path: "/supervisors",
    icon: <Icon as={FaUserShield} width="20px" height="20px" color="inherit" />,
    component: SuperVisors,
  },


  

  {
    name: "Competitions",
    layout: "/admin",
    path: "/competitions",
    icon: <Icon as={MdEmojiEvents} width="20px" height="20px" color="inherit" />,
    component: CompetitionsTable,
  },


  {
    name: "Payments Methods",
    layout: "/admin",
    path: "/payments-methods",
    icon: <Icon as={MdPayment} width="20px" height="20px" color="inherit" />,
    component: PaymentsMethods,
  },

  {
    name: "Logger",
    layout: "/admin",
    path: "/logger",
    icon: <Icon as={MdReceipt} width="20px" height="20px" color="inherit" />,
    component: Logger,
  },



  // User routes (for students/course viewers)
  {
    name: "Course Viewer",
    layout: "/user",
    path: "/course/:courseId",
    component: CoursePage,
    hidden: true, // Hidden from sidebar
  },

  {
    name: "Sign In",
    layout: "/auth",
    path: "/sign-in",
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: SignInCentered,
  },


];

export default routes;
