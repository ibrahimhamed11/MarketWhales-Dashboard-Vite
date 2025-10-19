import React from 'react';
import { Grid } from '@mui/material';
import CourseCard from './CourseCard';
import * as styles from '../../views/user/UserPages.styles';

/**
 * CourseGrid Component
 * Displays a grid of course cards
 */
const CourseGrid = ({ courses, onCourseSelect }) => {
  return (
    <Grid {...styles.courseGridStyles}>
      {courses.map(course => (
        <Grid item {...styles.courseGridItemStyles} key={course._id}>
          <CourseCard course={course} onCourseSelect={onCourseSelect} />
        </Grid>
      ))}
    </Grid>
  );
};

export default CourseGrid;
