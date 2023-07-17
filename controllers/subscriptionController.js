const knex = require('../config/db');

const getEnrolledCourses = async (req, res) => {
  const userId = req.user.id;
  try {
    const enrolledCourses = await knex('user_course')
      .select('user_course.id', 'course.id as courseId', 'name as courseName', 'author as courseAuthor', 'course.price as coursePrice', 'user_course.buy_price as buyPrice')
      .where('user_id', userId)
      .where('is_active', true)
      .join('course', 'user_course.course_id', 'course.id');

    res.json(enrolledCourses);
  } catch (error) {
    console.error('Failed to fetch enrolled courses:', error);
    res.status(500).json({ message: 'Failed to fetch enrolled courses' });
  }
};

const addEnrolledCourse = async (req, res) => {
  const userId = req.user.id;
  const { course_id, discountVoucher } = req.body;

  // Check if the course has been enrolled before by this user
  const existingEnrollment = await knex('user_course')
    .where({ user_id: userId, course_id })
    .where('is_active', true)
    .first();

  if (existingEnrollment) {
    return res.status(400).json({ message: 'Course has already been enrolled by this user.' });
  }


  // Get the course price from the 'course' table
  const course = await knex('course')
    .where({ id: course_id })
    .select('price')
    .first();

  if (!course) {
    return res.status(404).json({ message: 'Course not found.' });
  }

  let buy_price;
  if (discountVoucher) {
    // Apply discount logic here to calculate the buy_price with discount
    buy_price = calculateDiscountedPrice(discountVoucher, course.price);
  } else {
    // If no discount voucher, get the course price from the 'course' table
    buy_price = course.price;
  }

  try {
    await knex('user_course').insert({
      user_id: userId,
      course_id,
      buy_date: knex.fn.now(),
      buy_price,
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

const calculateDiscountedPrice = (discountVoucher, realPrice) => {
  // Define the discount percentages for the given discount vouchers
  const discounts = {
    KINGBIRTHDAY100: 1.0, // 100% discount (free)
    HAPPYFEAST: 0.5, // 50% discount
  };

  // Check if the discountVoucher is valid and exists in the discounts object
  if (discountVoucher in discounts) {
    console.log("Discount Applied : " + discountVoucher);
    // Apply the discount percentage to the realPrice
    const discountPercentage = discounts[discountVoucher];
    const discountedPrice = realPrice * (1 - discountPercentage);
    return discountedPrice;
  }

  // If the discountVoucher is not valid, return the original realPrice
  return realPrice;
};


module.exports = {
  getEnrolledCourses,
  addEnrolledCourse,
};
