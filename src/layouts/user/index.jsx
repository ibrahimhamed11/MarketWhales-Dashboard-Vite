import React from 'react';
import { Box } from '@chakra-ui/react';
import { Route, Switch, Redirect } from 'react-router-dom';
import routes from '../../routes.jsx';

// Simple user layout without sidebar or admin navigation
export default function UserLayout() {
  // Filter routes that belong to user layout
  const getUserRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === '/user') {
        return <Route path={prop.layout + prop.path} component={prop.component} key={key} />;
      }
      return null;
    }).filter(route => route !== null);
  };

  return (
    <Box minHeight="100vh" bg="gray.50">
      <Switch>
        {getUserRoutes(routes)}
        <Redirect from="/user" exact to="/admin" />
      </Switch>
    </Box>
  );
}
