const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10);

  const instructor = await prisma.user.upsert({
    where: { tc: '12345678901' },
    update: {},
    create: {
      tc: '12345678901',
      password: hashedPassword,
      name: 'Ahmet',
      surname: 'Öğretim',
      email: 'ogretim@example.com',
      role: 'INSTRUCTOR'
    }
  });

  console.log({ instructor });

  const student1 = await prisma.user.upsert({
    where: { tc: '12345678902' },
    update: {},
    create: {
      tc: '12345678902',
      password: hashedPassword,
      name: 'Mehmet',
      surname: 'Öğrenci',
      email: 'ogrenci1@example.com',
      role: 'STUDENT'
    }
  });

  const student2 = await prisma.user.upsert({
    where: { tc: '12345678903' },
    update: {},
    create: {
      tc: '12345678903',
      password: hashedPassword,
      name: 'Ayşe',
      surname: 'Öğrenci',
      email: 'ogrenci2@example.com',
      role: 'STUDENT'
    }
  });

  console.log({ student1, student2 });

  const course = await prisma.course.upsert({
    where: { code: 'CSE101' },
    update: {},
    create: {
      name: 'Bilgisayar Mühendisliğine Giriş',
      code: 'CSE101',
      instructorId: instructor.id
    }
  });

  console.log({ course });

  const enrollment1 = await prisma.enrollment.upsert({
    where: {
      studentId_courseId: {
        studentId: student1.id,
        courseId: course.id
      }
    },
    update: {},
    create: {
      studentId: student1.id,
      courseId: course.id
    }
  });

  const enrollment2 = await prisma.enrollment.upsert({
    where: {
      studentId_courseId: {
        studentId: student2.id,
        courseId: course.id
      }
    },
    update: {},
    create: {
      studentId: student2.id,
      courseId: course.id
    }
  });

  console.log({ enrollment1, enrollment2 });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
