import { NextResponse } from 'next/server';

// Get enrollments and schools of user
export function GET(_, { params }: { params: { hello: string } }) {
  return NextResponse.json(params.hello + ' world!');
}
