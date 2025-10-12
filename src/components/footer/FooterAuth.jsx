/*eslint-disable*/
import React from "react";
import {
  Flex,
  Link,
  List,
  ListItem,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Footer() {
  let textColor = useColorModeValue("gray.400", "white");
  let linkColor = useColorModeValue({ base: "gray.400", lg: "white" }, "white");
  return (
    <Flex
      zIndex='3'
      flexDirection={{
        base: "column",
        lg: "row",
      }}
      alignItems={{
        base: "center",
        xl: "start",
      }}
      justifyContent='space-between'
      px={{ base: "30px", md: "0px" }}
      pb='30px'>
      <Text
        color={textColor}
        textAlign={{
          base: "center",
          xl: "start",
        }}
        mb={{ base: "20px", lg: "0px" }}>
        {" "}
        &copy; {1900 + new Date().getYear()}
        <Text as='span' fontWeight='500' ms='4px'>
         Market Whales. All . Made by
          <Link
            mx='3px'
            color={textColor}
            target='_blank'
            fontWeight='700'>
            Eng Ibrahim Hamed
          </Link>
        </Text>
      </Text>


      
      {/* <List display='flex'>
        <ListItem
          me={{
            base: "20px",
            md: "44px",
          }}>
          <Link
            fontWeight='500'
            color={linkColor}
            href='mailto:ibrahim.hamed112@hotmail.com'>
            Support
          </Link>
        </ListItem>
        <ListItem
          me={{
            base: "20px",
            md: "44px",
          }}>
          
        </ListItem>
        <ListItem
          me={{
            base: "20px",
            md: "44px",
          }}>
         
        </ListItem>
        <ListItem>
         
        </ListItem>
      </List> */}
    </Flex>
  );
}
