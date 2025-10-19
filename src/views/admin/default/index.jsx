import {
  Avatar,
  Box,
  Flex,
  Icon,
  SimpleGrid,
  Spinner,
  Text,
  useColorModeValue,
  Heading,
  VStack,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { getAllUsers, allOrders, getAllcourses, getAllsignals } from "utils/Dashboard/dashboard";
import { Registrationstats } from "utils/Dashboard/dashboard";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React from "react";
import { MdPeople, MdShoppingCart, MdClass, MdFileCopy, MdTrendingUp, MdPieChart, MdRefresh } from "react-icons/md";
import ColumnChart from "components/charts/BarChart";
import PieChart from "components/charts/PieChart";
import WorldMap from "../../../components/WorldMap";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import styles from './Dashboard.module.css';

export default function UserReports() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState(0);
  const [courses, setCourses] = useState(0);
  const [signals, setSignals] = useState(0);
  const [registrationStats, setRegistrationStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true); // Track if component is mounted

  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.700", "whiteAlpha.600");
  const cardBg = useColorModeValue("white", "navy.800");
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );

  const theme = createTheme({
    palette: {},
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!isMountedRef.current) return; // Don't fetch if unmounted
      
      setLoading(true);
      setError(null);
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
          setError(error.message || t('dashboard.errors.fetchError'));
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
  }, [t]);

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
    colors: ["#4318FF", "#25BEFFFF", "#D1132FFF", "#08E89DFF", "#8461F8FF", "#FF6B9D"],
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
    },
    legend: {
      show: true,
      position: 'bottom',
      fontSize: '14px',
      fontFamily: 'inherit',
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
      },
    },
    fill: {
      colors: ["#4318FF", "#25BEFFFF", "#D1132FFF", "#08E89DFF", "#8461F8FF", "#FF6B9D"],
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      y: {
        formatter: function(value) {
          return value + " users";
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: '100%'
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  const columnChartData = registrationStats
    ? [
        {
          name: t('dashboard.charts.userGrowth'),
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
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: '60%',
      }
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: registrationStats ? registrationStats.months : [],
      labels: {
        style: {
          fontSize: '12px',
        }
      }
    },
    yaxis: {
      title: {
        text: t('common.students')
      }
    },
    fill: {
      opacity: 1,
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.25,
        gradientToColors: ['#FF6B9D'],
        inverseColors: true,
        opacityFrom: 0.85,
        opacityTo: 0.85,
        stops: [50, 0, 100]
      },
    },
    colors: ["#FF4560"],
    grid: {
      borderColor: '#f1f1f1',
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return val + " " + t('common.students');
        }
      }
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <Box className={styles.dashboardContainer}>
      {loading ? (
        <Flex className={styles.loadingContainer}>
          <Spinner 
            size="xl" 
            thickness="4px"
            speed="0.65s"
            color="brand.500"
          />
          <Text className={styles.loadingText} color={textColorSecondary}>
            {t('dashboard.loadingData')}
          </Text>
        </Flex>
      ) : error ? (
        <Box className={styles.errorContainer}>
          <Icon as={MdRefresh} className={styles.errorIcon} />
          <Heading size="md" className={styles.errorText} color={textColor}>
            {t('dashboard.errors.fetchError')}
          </Heading>
          <Text className={styles.errorSubtext} color={textColorSecondary}>
            {error}
          </Text>
          <Button
            className={styles.retryButton}
            onClick={handleRetry}
            leftIcon={<MdRefresh />}
            colorScheme="brand"
            size="md"
          >
            {t('dashboard.errors.tryAgain')}
          </Button>
        </Box>
      ) : (
        <>
          {/* Page Header */}
          <VStack align="start" spacing={2} mb={6} className={styles.fadeIn}>
      
            <Text color={textColorSecondary} fontSize="md">
              {t('dashboard.subtitle')}
            </Text>
          </VStack>

          {/* Statistics Cards */}
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3, "2xl": 4 }}
            gap="20px"
            mb="20px"
            marginTop="60px"
          >
            <Box className={`${styles.statCardWrapper} ${styles.fadeInDelay1}`}>
              <MiniStatistics
                startContent={
                  <IconBox
                    w="56px"
                    h="56px"
                    bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    icon={<Icon w="32px" h="32px" as={MdPeople} color="white" />}
                  />
                }
                name={t('dashboard.stats.totalUsers')}
                value={users.length}
              />
            </Box>
            
            <Box className={`${styles.statCardWrapper} ${styles.fadeInDelay2}`}>
              <MiniStatistics
                startContent={
                  <IconBox
                    w="56px"
                    h="56px"
                    bg="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                    icon={<Icon w="32px" h="32px" as={MdShoppingCart} color="white" />}
                  />
                }
                name={t('dashboard.stats.totalOrders')}
                value={orders}
              />
            </Box>
            
            <Box className={`${styles.statCardWrapper} ${styles.fadeInDelay3}`}>
              <MiniStatistics
                startContent={
                  <IconBox
                    w="56px"
                    h="56px"
                    bg="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                    icon={<Icon w="32px" h="32px" as={MdClass} color="white" />}
                  />
                }
                name={t('dashboard.stats.totalCourses')}
                value={courses}
              />
            </Box>
            
            <Box className={`${styles.statCardWrapper} ${styles.fadeInDelay3}`}>
              <MiniStatistics
                startContent={
                  <IconBox
                    w="56px"
                    h="56px"
                    bg="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                    icon={<Icon w="32px" h="32px" as={MdFileCopy} color="white" />}
                  />
                }
                name={t('dashboard.stats.totalSignals')}
                value={signals}
              />
            </Box>
          </SimpleGrid>

          {/* Charts Section */}
          <SimpleGrid columns={{ base: 1, md: 2 }} gap="20px" mb="20px">
            {/* Pie Chart - User Roles */}
            <Box 
              bg={cardBg}
              boxShadow={cardShadow}
              borderRadius="20px"
              className={`${styles.chartCard} ${styles.fadeIn}`}
            >
              <Flex align="center" mb={4}>
                <Icon as={MdPieChart} className={styles.chartTitleIcon} color={brandColor} mr={2} />
                <Box>
                  <Text 
                    fontSize="xl" 
                    fontWeight="700"
                    color={textColor}
                  >
                    {t('dashboard.charts.userRoles')}
                  </Text>
                  <Text 
                    fontSize="sm" 
                    color={textColorSecondary}
                    mt={1}
                  >
                    {t('dashboard.charts.userRolesSubtitle')}
                  </Text>
                </Box>
              </Flex>
              
              {pieChartData.length > 0 ? (
                <PieChart chartData={pieChartData} chartOptions={pieChartOptions} />
              ) : (
                <Box className={styles.emptyState}>
                  <Text color={textColorSecondary}>
                    {t('dashboard.errors.noData')}
                  </Text>
                </Box>
              )}
            </Box>

            {/* Column Chart - User Growth */}
            <Box 
              bg={cardBg}
              boxShadow={cardShadow}
              borderRadius="20px"
              className={`${styles.chartCard} ${styles.fadeInDelay1}`}
            >
              <Flex align="center" mb={4}>
                <Icon as={MdTrendingUp} className={styles.chartTitleIcon} color={brandColor} mr={2} />
                <Box>
                  <Text 
                    fontSize="xl" 
                    fontWeight="700"
                    color={textColor}
                  >
                    {t('dashboard.charts.userGrowth')}
                  </Text>
                  <Text 
                    fontSize="sm" 
                    color={textColorSecondary}
                    mt={1}
                  >
                    {t('dashboard.charts.userGrowthSubtitle')}
                  </Text>
                </Box>
              </Flex>
              
              {registrationStats ? (
                <ColumnChart chartData={columnChartData} chartOptions={columnChartOptions} />
              ) : (
                <Box className={styles.emptyState}>
                  <Spinner size="md" color={brandColor} />
                  <Text color={textColorSecondary} mt={2}>
                    {t('common.loading')}
                  </Text>
                </Box>
              )}
            </Box>
          </SimpleGrid>

          {/* World Map Section */}
          <Box className={`${styles.mapContainer} ${styles.fadeInDelay2}`}>
            <Box 
              bg={cardBg}
              p={6}
              borderRadius="20px"
              boxShadow={cardShadow}
            >
              <Heading size="md" color={textColor} mb={2}>
                {t('dashboard.charts.userMap')}
              </Heading>
              <Text color={textColorSecondary} fontSize="sm" mb={4}>
                {t('dashboard.charts.userMapSubtitle')}
              </Text>
              
              <ThemeProvider theme={theme}>
                <WorldMap userData={users} />
              </ThemeProvider>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
