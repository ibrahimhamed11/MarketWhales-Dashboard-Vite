/* eslint-disable */
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
// chakra imports
import { Box, Flex, HStack, Text, useColorModeValue, Icon, Collapse } from "@chakra-ui/react";
import { MdExpandMore, MdExpandLess } from "react-icons/md";

export function SidebarLinks(props) {
  //   Chakra color mode
  let location = useLocation();
  let activeColor = useColorModeValue("gray.700", "white");
  let inactiveColor = useColorModeValue(
    "secondaryGray.600",
    "secondaryGray.600"
  );
  let activeIcon = useColorModeValue("brand.500", "white");
  let textColor = useColorModeValue("secondaryGray.500", "white");
  let brandColor = useColorModeValue("brand.500", "brand.400");

  const { routes } = props;
  
  // State to manage expanded menus
  const [expandedMenus, setExpandedMenus] = useState({});

  // Auto-expand menus that have active children
  React.useEffect(() => {
    const checkActiveRoutes = (routes) => {
      routes.forEach(route => {
        if (route.items && hasActiveChild(route.items)) {
          setExpandedMenus(prev => ({
            ...prev,
            [route.name]: true
          }));
        }
      });
    };
    checkActiveRoutes(routes);
  }, [location.pathname]);

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };

  // Toggle expanded state for menus
  const toggleMenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  // Check if any child route is active
  const hasActiveChild = (items) => {
    if (!items) return false;
    return items.some(item => {
      if (item.path && activeRoute(item.path.toLowerCase())) return true;
      if (item.items) return hasActiveChild(item.items);
      return false;
    });
  };

  // this function creates the links from the secondary accordions (for example auth -> sign-in -> default)
  const createLinks = (routes) => {
    return routes.map((route, index) => {
      // Skip hidden routes from sidebar
      if (route.hidden) {
        return null;
      }
      
      // Handle nested menu items
      if (route.items) {
        const isExpanded = expandedMenus[route.name];
        const hasActive = hasActiveChild(route.items);
        
        return (
          <Box key={index}>
            <Box
              onClick={() => toggleMenu(route.name)}
              cursor="pointer"
              _hover={{ bg: useColorModeValue("gray.50", "whiteAlpha.100") }}
              borderRadius="md"
              mx="2"
              mb="2"
            >
              <HStack
                spacing="22px"
                py='5px'
                ps='10px'
                pr="4px"
              >
                <Flex w='100%' alignItems='center' justifyContent='space-between'>
                  <HStack spacing="18px">
                    {route.icon && (
                      <Box
                        color={hasActive ? activeIcon : textColor}
                      >
                        {route.icon}
                      </Box>
                    )}
                    <Text
                      color={hasActive ? activeColor : textColor}
                      fontWeight={hasActive ? "bold" : "normal"}
                      fontSize="md"
                    >
                      {route.name}
                    </Text>
                  </HStack>
                  <Icon
                    as={isExpanded ? MdExpandLess : MdExpandMore}
                    color={textColor}
                    w="20px"
                    h="20px"
                  />
                </Flex>
              </HStack>
            </Box>
            <Collapse in={isExpanded} animateOpacity>
              <Box pl="8px">
                {createLinks(route.items)}
              </Box>
            </Collapse>
          </Box>
        );
      } else if (route.category) {
        return (
          <>
            <Text
              fontSize={"md"}
              color={activeColor}
              fontWeight='bold'
              mx='auto'
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              pt='18px'
              pb='12px'
              key={index}>
              {route.name}
            </Text>
            {createLinks(route.items)}
          </>
        );
      } else if (
        route.path && (
        route.layout === "/admin" ||
        route.layout === "/auth" ||
        route.layout === "/rtl" ||
        route.layout === "/user")
      ) {
        return (
          <Box
            key={index}
            _hover={{ bg: useColorModeValue("gray.50", "whiteAlpha.100") }}
            borderRadius="md"
            mx="2"
            mb="1"
          >
            <NavLink to={route.layout + route.path} style={{ display: 'block', textDecoration: 'none' }}>
              {route.icon ? (
                <HStack
                  spacing={
                    activeRoute(route.path?.toLowerCase()) ? "22px" : "26px"
                  }
                  py='5px'
                  ps='10px'
                  pr='10px'>
                  <Flex w='100%' alignItems='center' justifyContent='space-between'>
                    <HStack spacing="18px">
                      <Box
                        color={
                          activeRoute(route.path?.toLowerCase())
                            ? activeIcon
                            : textColor
                        }>
                        {route.icon}
                      </Box>
                      <Text
                        color={
                          activeRoute(route.path?.toLowerCase())
                            ? activeColor
                            : textColor
                        }
                        fontWeight={
                          activeRoute(route.path?.toLowerCase())
                            ? "bold"
                            : "normal"
                        }>
                        {route.name}
                      </Text>
                    </HStack>
                    <Box
                      h='36px'
                      w='4px'
                      bg={
                        activeRoute(route.path?.toLowerCase())
                          ? brandColor
                          : "transparent"
                      }
                      borderRadius='5px'
                    />
                  </Flex>
                </HStack>
              ) : (
                <HStack
                  spacing={
                    activeRoute(route.path?.toLowerCase()) ? "22px" : "26px"
                  }
                  py='5px'
                  ps='10px'
                  pr='10px'>
                  <Text
                    me='auto'
                    color={
                      activeRoute(route.path?.toLowerCase())
                        ? activeColor
                        : inactiveColor
                    }
                    fontWeight={
                      activeRoute(route.path?.toLowerCase()) ? "bold" : "normal"
                    }>
                    {route.name}
                  </Text>
                  <Box h='36px' w='4px' bg='brand.400' borderRadius='5px' />
                </HStack>
              )}
            </NavLink>
          </Box>
        );
      }
    });
  };
  //  BRAND
  return createLinks(routes);
}

export default SidebarLinks;
