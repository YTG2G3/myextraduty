'use server';

export default async function cancelInvitation(
  school_id: string,
  email: string
) {
  const invitation = await prisma.invitation.findFirst({
    where: {
      schoolId: school_id,
      email: email
    }
  });
  if (!invitation) {
    throw new Error('Invitation is not found.');
  }

  try {
    await prisma.invitation.delete({
      where: {
        id: invitation.id
      }
    });
  } catch {
    throw new Error('Failed to cancel invitation.');
  }

  return;
}
