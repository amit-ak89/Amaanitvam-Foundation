require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Application = require('./models/Application');
const connectDB = require('./config/db');

const seed = async () => {
  await connectDB();

  await Admin.deleteMany();
  await Application.deleteMany();

  // Create Super Admin
  await Admin.create({
    name: 'Super Admin',
    email: 'admin@amaanitvam.org',
    password: 'Admin@123',
    role: 'super_admin',
  });

  // Create Volunteer Admin
  await Admin.create({
    name: 'Volunteer Admin',
    email: 'volunteer@amaanitvam.org',
    password: 'Admin@123',
    role: 'volunteer_admin',
  });

  // Sample applications
  const apps = [
    { fullName: 'Arjun Sharma', email: 'arjun@example.com', phone: '9876543210', college: 'IIT Delhi', skills: ['React', 'Node.js'], role: 'Web Developer', status: 'completed', startDate: new Date('2026-01-01'), endDate: new Date('2026-03-31'), resumeUrl: 'https://res.cloudinary.com/demo/raw/upload/sample.pdf' },
    { fullName: 'Priya Patel', email: 'priya@example.com', phone: '9876543211', college: 'NIT Surat', skills: ['Python', 'ML'], role: 'Data Analyst', status: 'selected', startDate: new Date('2026-02-01'), endDate: new Date('2026-04-30'), resumeUrl: 'https://res.cloudinary.com/demo/raw/upload/sample.pdf' },
    { fullName: 'Rahul Verma', email: 'rahul@example.com', phone: '9876543212', college: 'BITS Pilani', skills: ['Figma', 'UI/UX'], role: 'UI/UX Designer', status: 'pending', resumeUrl: 'https://res.cloudinary.com/demo/raw/upload/sample.pdf' },
    { fullName: 'Sneha Gupta', email: 'sneha@example.com', phone: '9876543213', college: 'Delhi University', skills: ['Content Writing', 'SEO'], role: 'Content Writer', status: 'rejected', resumeUrl: 'https://res.cloudinary.com/demo/raw/upload/sample.pdf' },
    { fullName: 'Vikram Singh', email: 'vikram@example.com', phone: '9876543214', college: 'VIT Vellore', skills: ['Java', 'Spring Boot'], role: 'Backend Developer', status: 'pending', resumeUrl: 'https://res.cloudinary.com/demo/raw/upload/sample.pdf' },
    { fullName: 'Ananya Reddy', email: 'ananya@example.com', phone: '9876543215', college: 'IIIT Hyderabad', skills: ['React', 'TypeScript'], role: 'Frontend Developer', status: 'selected', startDate: new Date('2026-03-01'), endDate: new Date('2026-05-31'), resumeUrl: 'https://res.cloudinary.com/demo/raw/upload/sample.pdf' },
  ];

  await Application.insertMany(apps);

  console.log('✅ Seed data inserted successfully');
  console.log('📧 Super Admin: admin@amaanitvam.org | Password: Admin@123');
  console.log('📧 Volunteer Admin: volunteer@amaanitvam.org | Password: Admin@123');
  process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });
