const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const geolib = require('geolib');

const prisma = new PrismaClient();

const isStudent = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'STUDENT') {
    return res.status(403).redirect('/auth/login');
  }
  next();
};

router.use(isStudent);

router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'WWW', 'student', 'dashboard.html'));
});

router.get('/profile', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.session.user.id },
      select: {
        id: true,
        name: true,
        surname: true,
        tc: true,
        email: true,
        role: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/courses', async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId: req.session.user.id
      },
      include: {
        course: true
      }
    });

    const courses = enrollments.map(enrollment => enrollment.course);

    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/active-sessions', async (req, res) => {
  try {

    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId: req.session.user.id
      },
      select: {
        courseId: true
      }
    });

    const courseIds = enrollments.map(e => e.courseId);

    const activeSessions = await prisma.attendanceSession.findMany({
      where: {
        courseId: {
          in: courseIds
        },
        isActive: true
      },
      include: {
        course: true
      }
    });

    res.json(activeSessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/attendance/:sessionId', async (req, res) => {
  try {
    const { latitude, longitude, ipAddress, deviceInfo } = req.body;

    const session = await prisma.attendanceSession.findUnique({
      where: { id: req.params.sessionId }
    });

    if (!session || !session.isActive) {
      return res.status(404).json({ message: 'Active attendance session not found' });
    }

    const enrollment = await prisma.enrollment.findFirst({
      where: {
        studentId: req.session.user.id,
        courseId: session.courseId
      }
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        studentId_sessionId: {
          studentId: req.session.user.id,
          sessionId: req.params.sessionId
        }
      }
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Already marked attendance for this session' });
    }

    const distance = geolib.getDistance(
      { latitude, longitude },
      { latitude: session.latitude, longitude: session.longitude }
    );

    if (distance > 1000) {
      return res.status(400).json({ 
        message: 'Location too far from class',
        distance: distance
      });
    }

    const attendance = await prisma.attendance.create({
      data: {
        student: {
          connect: { id: req.session.user.id }
        },
        session: {
          connect: { id: req.params.sessionId }
        },
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        ipAddress,
        deviceInfo: JSON.stringify(deviceInfo)
      }
    });

    res.status(201).json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/attendance-history', async (req, res) => {
  try {
    const attendances = await prisma.attendance.findMany({
      where: {
        studentId: req.session.user.id
      },
      include: {
        session: {
          include: {
            course: true
          }
        }
      },
      orderBy: {
        time: 'desc'
      }
    });

    res.json(attendances);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;