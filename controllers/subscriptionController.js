const knex = require('../config/db');
  
  const getEnrolledCourses = async (req, res) => {
    const userId = req.user.id;
    try {
      const enrolledCourses = await knex('user_course')
        .select('course.*')
        .where('user_id', userId)
        .join('course', 'user_course.course_id', 'course.id');
  
      res.json(enrolledCourses);
    } catch (error) {
      console.error('Failed to fetch enrolled courses:', error);
      res.status(500).json({ message: 'Failed to fetch enrolled courses' });
    }
  };
  
  const addEnrolledCourse = async (req, res) => {
    const userId = req.user.id;
    const { course_id } = req.body;
  
    try {
      await knex('user_course').insert({
        user_id: userId,
        course_id,
        buy_date: knex.fn.now(),
        buy_price: 0, // Replace with actual buy price
        is_active: true,
        created_date: knex.fn.now(),
        modified_date: knex.fn.now(),
        created_by: 'Seeder', // Replace with actual created_by
        modified_by: 'Seeder', // Replace with actual modified_by
        lock_verify: 'ABC123', // Replace with actual lock_verify
      });
  
      res.json({ message: 'Course enrolled successfully' });
    } catch (error) {
      console.error('Failed to add enrolled course:', error);
      res.status(500).json({ message: 'Failed to add enrolled course' });
    }
  };
  
  module.exports = {
    getEnrolledCourses,
    addEnrolledCourse,
  };
  