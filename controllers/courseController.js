const knex = require('../config/db');
  
  const getCourses = async (req, res) => {
    try {
      const courses = await knex('course').select('id', 'name', 'author', 'price');
      res.json(courses);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      res.status(500).json({ message: 'Failed to fetch courses' });
    }
  };
  
  const getCourseById = async (req, res) => {
    const courseId = parseInt(req.params.courseId);
    try {
      const course = await knex('course').where('id', courseId).first();
      if (course) {
        res.json(course);
      } else {
        res.status(404).json({ message: 'Course not found' });
      }
    } catch (error) {
      console.error('Failed to fetch course by ID:', error);
      res.status(500).json({ message: 'Failed to fetch course by ID' });
    }
  };
  
  module.exports = {
    getCourses,
    getCourseById,
  };
  