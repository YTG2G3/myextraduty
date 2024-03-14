'use server';

export default async function inviteMember(
  school_id: string,
  email: string,
  manager: boolean = false
) {
  const result = await prisma.enrollment.findFirst({
    where: {
      schoolId: school_id,
      user: {
        email: email
      }
    }
  });
  if (result) {
    throw new Error('User is already enrolled.');
  }

  const invitation = await prisma.invitation.findFirst({
    where: {
      schoolId: school_id,
      email: email
    }
  });
  if (invitation) {
    throw new Error('User is already invited.');
  }

  try {
    await prisma.invitation.create({
      data: {
        schoolId: school_id,
        email: email,
        manager: manager
      }
    });
  } catch {
    throw new Error('Failed to invite user.');
  }

  return;
}
