import {
  Avatar,
  Box,
  Flex,
  Icon,
  SimpleGrid,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { getAllUsers, allOrders, getAllcourses, getAllsignals } from "utils/Dashboard/dashboard";
import { Registrationstats } from "utils/Dashboard/dashboard";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React from "react";
import { MdPeople, MdShoppingCart, MdClass, MdFileCopy } from "react-icons/md";
import ColumnChart from "components/charts/BarChart";
import PieChart from "components/charts/PieChart";
import WorldMap from "../../../components/WorldMap";
import { ThemeProvider, createTheme } from '@mui/material/styles';

export default function UserReports() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState(0);
  const [courses, setCourses] = useState(0);
  const [signals, setSignals] = useState(0);
  const [registrationStats, setRegistrationStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMountedRef = useRef(true); // Track if component is mounted

  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

  const theme = createTheme({
    palette: {},
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!isMountedRef.current) return; // Don't fetch if unmounted
      
      setLoading(true);
      try {
        // Check if still mounted before each operation
        if (!isMountedRef.current) return;
        
        const fetchedUsers = await getAllUsers();
        if (isMountedRef.current) setUsers(fetchedUsers.data);

        if (!isMountedRef.current) return;
        const fetchedOrders = await allOrders();
        if (isMountedRef.current) setOrders(fetchedOrders.length);

        if (!isMountedRef.current) return;
        const fetchedCourses = await getAllcourses();
        if (isMountedRef.current) setCourses(fetchedCourses.length);

        if (!isMountedRef.current) return;
        const fetchedSignals = await getAllsignals();
        if (isMountedRef.current) setSignals(fetchedSignals.signals.length);

        if (!isMountedRef.current) return;
        const fetchedRegistrationStats = await Registrationstats();
        if (isMountedRef.current) setRegistrationStats(fetchedRegistrationStats);
      } catch (error) {
        if (isMountedRef.current) {
          console.error("Error fetching data:", error);
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Calculate user roles distribution dynamically
  const roleDistribution = users.reduce((acc, user) => {
    const role = user.role;
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  // Prepare pie chart data and options
  const pieChartData = Object.values(roleDistribution);
  const pieChartOptions = {
    labels: Object.keys(roleDistribution),
    colors: ["#4318FF", "#25BEFFFF", "#D1132FFF", "#08E89DFF", "#8461F8FF", "#8461F8FF"],
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
    },
    legend: {
      show: true,
    },
    dataLabels: {
      enabled: true,
    },
    fill: {
      colors: ["#4318FF", "#25BEFFFF", "#D1132FFF", "#08E89DFF", "#8461F8FF", "#8461F8FF"],
    },
    tooltip: {
      enabled: true,
      theme: "dark",
    },
  };

  const columnChartData = registrationStats
    ? [
        {
          name: "User Growth",
          data: registrationStats.userCounts,
        },
      ]
    : [];

  const columnChartOptions = {
    chart: {
      id: "user-growth-chart",
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: registrationStats ? registrationStats.months : [],
    },
    colors: ["#FF4560"],
  };

  return (
    <Box >
      {loading ? (
        <Flex justifyContent="center" alignItems="center" height="100vh">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <>
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3, "2xl": 4 }}
            gap="20px"
            mb="20px"
            marginTop="60px"
          >
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={<Icon w="32px" h="32px" as={MdPeople} color={brandColor} />}
                />
              }
              name="Total Users"
              value={users.length}
            />
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={<Icon w="32px" h="32px" as={MdShoppingCart} color={brandColor} />}
                />
              }
              name="Total Orders"
              value={orders}
            />
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={<Icon w="32px" h="32px" as={MdClass} color={brandColor} />}
                />
              }
              name="Number of Courses"
              value={courses}
            />
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={<Icon w="32px" h="32px" as={MdFileCopy} color={brandColor} />}
                />
              }
              name="Total Signals"
              value={signals}
            />
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap="20px" mb="20px">
            <Box p={4} borderWidth={1} borderRadius="lg" boxShadow="md">
              <Text fontSize="lg" mb={4}>User Roles Distribution</Text>
              <PieChart chartData={pieChartData} chartOptions={pieChartOptions} />
            </Box>

            <Box p={4} borderWidth={1} borderRadius="lg" boxShadow="md">
              <Text fontSize="lg" mb={4}>User Growth Over Months</Text>
              {registrationStats ? (
                <ColumnChart chartData={columnChartData} chartOptions={columnChartOptions} />
              ) : (
                <Text>Loading user growth data...</Text>
              )}
            </Box>
          </SimpleGrid>

          <ThemeProvider theme={theme}>
            <WorldMap userData={users} />
          </ThemeProvider>
        </>
      )}
    </Box>
  );
}
