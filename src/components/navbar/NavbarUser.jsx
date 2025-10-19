import React from 'react';
import {
  Box,
  Flex,
  IconButton,
  Button,
  useColorModeValue,
  Text,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  useDisclosure,
} from '@chakra-ui/react';
import {
  MdMenu,
  MdPerson,
  MdSettings,
  MdLogout,
  MdSchool,
} from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

const NavbarUser = ({ onOpen, brandText, ...rest }) => {
  const { t } = useTranslation();
  const history = useHistory();
  
  // Chakra Color Mode
  const navbarFilter = useColorModeValue(
    'none',
    'drop-shadow(0px 7px 23px rgba(0, 0, 0, 0.05))'
  );
  const navbarBg = useColorModeValue(
    'rgba(244, 247, 254, 0.2)',
    'rgba(11,20,55,0.5)'
  );
  const navbarBorder = useColorModeValue('#FFFFFF', 'rgba(255, 255, 255, 0.31)');
  const brandColor = useColorModeValue('brand.500', 'white');
  const brandStarColor = useColorModeValue('brand.500', 'brand.400');
  const linkColor = useColorModeValue('#422AFB', 'white');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorBrand = useColorModeValue('brand.700', 'brand.400');
  const ethColor = useColorModeValue('gray.700', 'white');
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
  const ethBg = useColorModeValue('secondaryGray.300', 'navy.900');
  const ethBox = useColorModeValue('white', 'navy.800');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(112, 144, 176, 0.06)'
  );

  const handleLogout = () => {
    // Add logout logic here
    localStorage.removeItem('token');
    history.push('/auth/sign-in');
  };

  // Extract non-DOM props from rest
  const { fixed, secondary, ...domProps } = rest;

  return (
    <Box
      position="fixed"
      boxShadow={shadow}
      bg={navbarBg}
      borderColor={navbarBorder}
      filter={navbarFilter}
      backdropFilter="blur(20px)"
      backgroundPosition="center"
      backgroundSize="cover"
      borderRadius="16px"
      border="1.5px solid"
      borderBottomColor="transparent"
      left="50%"
      top="22px"
      transform="translate(-50%, 0%)"
      right="30px"
      width={{ base: 'calc(100vw - 30px)', md: 'calc(100vw - 30px)', lg: 'calc(100vw - 365px)' }}
      mx="auto"
      px="15px"
      py="8px"
      zIndex="1004"
      {...domProps}
    >
      <Flex
        w="100%"
        flexDirection={{
          sm: 'row',
          md: 'row',
        }}
        alignItems={{ xl: 'center' }}
        justify="space-between"
      >
        <Box mb={{ sm: '8px', md: '0px' }}>
          {/* Mobile menu button */}
          <IconButton
            variant="no-hover"
            bg="transparent"
            p="0px"
            minW="unset"
            minH="unset"
            h="18px"
            w="max-content"
            onClick={onOpen}
            display={{ base: 'flex', xl: 'none' }}
          >
            <MdMenu size="20px" color={ethColor} />
          </IconButton>

          {/* Brand text */}
          <Text
            w="max-content"
            color={brandColor}
            fontSize="sm"
            fontWeight="700"
            lineHeight="100%"
            display={{ base: 'none', md: 'block' }}
          >
            {brandText}
          </Text>
        </Box>

        <HStack spacing={{ base: '0px', xl: '8px' }}>
          {/* User menu */}
          <Menu>
            <MenuButton as={Button} variant="no-hover" bg="transparent" p="0px">
              <Avatar
                _hover={{ cursor: 'pointer' }}
                color="white"
                bg="linear-gradient(135deg, #868CFF 0%, #4318FF 100%)"
                size="sm"
                w="40px"
                h="40px"
                icon={<MdPerson size="20px" />}
              />
            </MenuButton>
            <MenuList
              boxShadow={shadow}
              p="20px"
              borderRadius="20px"
              bg={ethBox}
              border="none"
              mt="22px"
              me={{ base: '30px', md: 'unset' }}
              minW={{ base: 'unset', md: '400px', xl: '450px' }}
              maxW={{ base: '360px', md: 'unset' }}
            >
              <Flex w="100%" mb="0px">
                <Text
                  ps="20px"
                  pt="16px"
                  pb="16px"
                  w="100%"
                  borderRadius="8px"
                  _hover={{
                    bg: borderColor
                  }}
                  color={textColor}
                  fontWeight="bold"
                  fontSize="14px"
                  borderBottom="1px solid"
                  borderColor={borderColor}
                >
                  {t('navigation.profile')}
                </Text>
              </Flex>
              <Flex flexDirection="column" p="0px">
                <MenuItem
                  _hover={{ bg: 'none' }}
                  _focus={{ bg: 'none' }}
                  color={textColor}
                  borderRadius="8px"
                  px="14px"
                  onClick={() => history.push('/user/courses')}
                >
                  <MdSchool size="16px" />
                  <Text fontWeight="400" ml="12px">
                    {t('navigation.myCourses')}
                  </Text>
                </MenuItem>
                <MenuItem
                  _hover={{ bg: 'none' }}
                  _focus={{ bg: 'none' }}
                  color={textColor}
                  borderRadius="8px"
                  px="14px"
                  onClick={() => history.push('/user/settings')}
                >
                  <MdSettings size="16px" />
                  <Text fontWeight="400" ml="12px">
                    {t('navigation.settings')}
                  </Text>
                </MenuItem>
                <MenuItem
                  _hover={{ bg: 'none' }}
                  _focus={{ bg: 'none' }}
                  color="red.400"
                  borderRadius="8px"
                  px="14px"
                  onClick={handleLogout}
                >
                  <MdLogout size="16px" />
                  <Text fontWeight="400" ml="12px">
                    {t('navigation.logout')}
                  </Text>
                </MenuItem>
              </Flex>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
};

export default NavbarUser;
