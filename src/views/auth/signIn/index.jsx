import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Box, Button, Flex, FormControl, FormLabel, Heading, Icon, Input, InputGroup, InputRightElement, Text, useColorModeValue } from "@chakra-ui/react";
import DefaultAuth from "layouts/auth/Default";
import illustration from "assets/img/auth/auth.png";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { login } from '../../../utils/auth/auth'; // Assuming this is the correct path
import { useFormik } from 'formik';

function SignIn() {
  const history = useHistory();
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const brandStars = useColorModeValue("brand.500", "brand.400");

  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);

  const handleClick = () => setShow(!show);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      remember: false,
    },
    onSubmit: async (values) => {
      try {
        const response = await login(values.email, values.password);

        if (response && response.role === 'admin') {
          history.push("/admin");
        } else {
          setError("Access restricted to admin users only.");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError("Email or password is incorrect.");
        } else {
          console.error(error);
        }
      }
    },
  });

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex maxW={{ base: "100%", md: "max-content" }} w="100%" h="100%" alignItems="start" justifyContent="center" flexDirection="column">
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="10px">Sign In</Heading>
          <Text mb="36px" ms="4px" color={textColorSecondary} fontWeight="400" fontSize="md">
            Enter your email and password to sign in!
          </Text>
        </Box>
        <Flex direction="column" w={{ base: "100%", md: "420px" }} background="transparent" borderRadius="15px" mx="auto" mb="auto">
          <form onSubmit={formik.handleSubmit}>
            <FormControl>
              <FormLabel ms="4px" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
                Email<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired
                variant="auth"
                fontSize="sm"
                type="email"
                placeholder="admin@marketwhales.com"
                mb="24px"
                name="email"
                {...formik.getFieldProps('email')}
              />
              <FormLabel ms="4px" fontSize="sm" fontWeight="500" color={textColor} display="flex">
                Password<Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size="md">
                <Input
                  isRequired
                  fontSize="sm"
                  placeholder="Min. 8 characters"
                  mb="24px"
                  type={show ? "text" : "password"}
                  variant="auth"
                  name="password"
                  {...formik.getFieldProps('password')}
                />
                <InputRightElement display="flex" alignItems="center" mt="4px">
                  <Icon color={textColorSecondary} as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye} onClick={handleClick} />
                </InputRightElement>
              </InputGroup>
              <FormControl>
                {error && (
                  <Text color="red.500" fontSize="15" textAlign="center">
                    {error}
                  </Text>
                )}
              </FormControl>
              <Button type="submit" fontSize="sm" variant="brand" fontWeight="500" w="100%" h="50" mb="24px">
                Sign In
              </Button>
            </FormControl>
          </form>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
