const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Batch = require('./models/Batch');
const Session = require('./models/Session');
const Attendance = require('./models/Attendance');

// Load env vars
dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

const importData = async () => {
  try {
    await User.deleteMany();
    await Batch.deleteMany();
    await Session.deleteMany();
    await Attendance.deleteMany();

    // Create 1 Monitoring Officer
    const monitor = await User.create({
      name: 'Mohon Officer',
      email: 'monitor@test.com',
      password: 'password123',
      role: 'monitoring_officer'
    });

    // Create 1 Programme Manager
    const manager = await User.create({
      name: 'Priya Manager',
      email: 'manager@test.com',
      password: 'password123',
      role: 'programme_manager'
    });

    // Create 1 Institution
    const inst1 = await User.create({
      name: 'Tech Skilling Institute',
      email: 'inst1@test.com',
      password: 'password123',
      role: 'institution'
    });

    // Create 1 Trainer for Inst1
    const trainer1 = await User.create({
      name: 'Rahul Trainer',
      email: 'trainer@test.com',
      password: 'password123',
      role: 'trainer',
      institution_id: inst1._id
    });

    // Create 1 Student
    const student1 = await User.create({
      name: 'Amit Student',
      email: 'student@test.com',
      password: 'password123',
      role: 'student'
    });

    // Create a Batch
    const batch1 = await Batch.create({
      name: 'Full Stack Web Dev - Batch A',
      institution_id: inst1._id,
      trainers: [trainer1._id],
      students: [student1._id],
      inviteCode: 'TEST1234'
    });

    // Create a Session
    const session1 = await Session.create({
      title: 'Intro to React',
      batch_id: batch1._id,
      trainer_id: trainer1._id,
      date: new Date(),
      start_time: '10:00',
      end_time: '12:00'
    });

    // Mark Attendance
    await Attendance.create({
      session_id: session1._id,
      student_id: student1._id,
      status: 'present'
    });

    console.log('Data Imported successfully!');
    console.log('Test Accounts (Password: password123)');
    console.log('- monitor@test.com');
    console.log('- manager@test.com');
    console.log('- inst1@test.com');
    console.log('- trainer@test.com');
    console.log('- student@test.com');

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else {
  console.log('Use `node seed.js -i` to import data');
  process.exit();
}
