import React from "react";

// Chakra imports
import { Flex, useColorModeValue } from "@chakra-ui/react";

// Custom components
import { HSeparator } from "components/separator/Separator";

import logoImage from '../../../assets/img/Logo.png';

export function SidebarBrand() {
  // Chakra color mode
  // let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align='center' direction='column'>
      <img src={logoImage} alt="Logo" style={{ height: '120px', width: '175px' }} />
      <HSeparator mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;
