import moment from 'moment-timezone';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // TODO - cache
  // TODO - make sure the date is in correct timezone
  let tasks = await prisma.task.findMany({
    where: {
      startingDate: moment().add(1, 'day').toDate()
    },
    include: {
      assignments: {
        include: {
          user: true
        }
      }
    }
  });

  // TODO - use this as an option once tomorrow cron is working
  // await prisma.task.findMany({
  //   where: {
  //     startingDate: moment().add(3, 'day').toDate()
  //   },
  //   include: {
  //     assignments: {
  //       include: {
  //         user: true
  //       }
  //     }
  //   },
  // });

  tasks.forEach((task) => {
    // TODO - Send SES email
  });

  return NextResponse.json({ ok: true });
}
