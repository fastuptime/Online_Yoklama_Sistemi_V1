const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const path = require('path');

const prisma = new PrismaClient();

const isInstructor = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'INSTRUCTOR') {
    return res.status(403).redirect('/auth/login');
  }
  next();
};

router.use(isInstructor);

router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'WWW', 'instructor', 'dashboard.html'));
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
    const courses = await prisma.course.findMany({
      where: {
        instructorId: req.session.user.id
      }
    });
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/courses', async (req, res) => {
  try {
    const { name, code } = req.body;

    const existingCourse = await prisma.course.findUnique({
      where: { code }
    });

    if (existingCourse) {
      return res.status(400).json({ message: 'Course code already exists' });
    }

    const course = await prisma.course.create({
      data: {
        name,
        code,
        instructor: {
          connect: { id: req.session.user.id }
        }
      }
    });

    res.status(201).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/courses/:id', async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: {
        attendanceSessions: {
          orderBy: {
            startTime: 'desc'
          }
        },
        enrollments: {
          include: {
            student: {
              select: {
                id: true,
                tc: true,
                name: true,
                surname: true
              }
            }
          }
        }
      }
    });

    if (!course || course.instructorId !== req.session.user.id) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/courses/:id/attendance', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    const course = await prisma.course.findUnique({
      where: { id: req.params.id }
    });

    if (!course || course.instructorId !== req.session.user.id) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const activeSession = await prisma.attendanceSession.findFirst({
      where: {
        courseId: req.params.id,
        isActive: true
      }
    });

    if (activeSession) {
      return res.status(400).json({ message: 'An active attendance session already exists' });
    }

    const session = await prisma.attendanceSession.create({
      data: {
        course: {
          connect: { id: req.params.id }
        },
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      }
    });

    res.status(201).json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/attendance/:id/close', async (req, res) => {
  try {

    const session = await prisma.attendanceSession.findUnique({
      where: { id: req.params.id },
      include: { course: true }
    });

    if (!session) {
      return res.status(404).json({ message: 'Attendance session not found' });
    }

    if (session.course.instructorId !== req.session.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updatedSession = await prisma.attendanceSession.update({
      where: { id: req.params.id },
      data: {
        isActive: false,
        endTime: new Date()
      },
      include: {
        attendances: {
          include: {
            student: {
              select: {
                id: true,
                tc: true,
                name: true,
                surname: true
              }
            }
          }
        }
      }
    });

    res.json(updatedSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/attendance/:id', async (req, res) => {
  try {
    const session = await prisma.attendanceSession.findUnique({
      where: { id: req.params.id },
      include: {
        course: true,
        attendances: {
          include: {
            student: {
              select: {
                id: true,
                tc: true,
                name: true,
                surname: true
              }
            }
          }
        }
      }
    });

    if (!session) {
      return res.status(404).json({ message: 'Attendance session not found' });
    }

    if (session.course.instructorId !== req.session.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/attendance/:id/reopen', async (req, res) => {
  try {

    const session = await prisma.attendanceSession.findUnique({
      where: { id: req.params.id },
      include: { course: true }
    });

    if (!session) {
      return res.status(404).json({ message: 'Attendance session not found' });
    }

    if (session.course.instructorId !== req.session.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updatedSession = await prisma.attendanceSession.update({
      where: { id: req.params.id },
      data: {
        isActive: true,
        endTime: null
      }
    });

    res.json(updatedSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/attendance/:id/students/:studentId', async (req, res) => {
  try {

    const session = await prisma.attendanceSession.findUnique({
      where: { id: req.params.id },
      include: { course: true }
    });

    if (!session) {
      return res.status(404).json({ message: 'Attendance session not found' });
    }

    if (session.course.instructorId !== req.session.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: req.params.studentId,
          courseId: session.courseId
        }
      }
    });

    if (!enrollment) {
      return res.status(400).json({ message: 'Student is not enrolled in this course' });
    }

    const attendance = await prisma.attendance.create({
      data: {
        student: {
          connect: { id: req.params.studentId }
        },
        session: {
          connect: { id: req.params.id }
        },
        latitude: session.latitude,
        longitude: session.longitude,
        ipAddress: "Manually added by instructor"
      }
    });

    res.status(201).json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/attendance/:id/students/:studentId', async (req, res) => {
  try {

    const session = await prisma.attendanceSession.findUnique({
      where: { id: req.params.id },
      include: { course: true }
    });

    if (!session) {
      return res.status(404).json({ message: 'Attendance session not found' });
    }

    if (session.course.instructorId !== req.session.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await prisma.attendance.delete({
      where: {
        studentId_sessionId: {
          studentId: req.params.studentId,
          sessionId: req.params.id
        }
      }
    });

    res.json({ message: 'Student removed from attendance' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;