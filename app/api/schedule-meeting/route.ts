import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "../(lib)/mongodb";
import Meeting, { IMeeting } from "../(model)/Meeting";

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const data = await req.json();

        const {
          name, email, phone, course, year,
          preferredDate, preferredTime, topics, message,
        } = data;

        if (
            !name ||
            !email ||
            !phone ||
            !course ||
            !year ||
            !preferredDate ||
            !preferredTime ||
            !topics
        ) {
            return NextResponse.json(
              { message: "Missing required fields" },
              { status: 400 }
            );
        }

        const meeting: Partial<IMeeting> = {
            name, email, phone, course, year,
            preferredDate, preferredTime, topics, message,
            timestamp: new Date()
        }

        const savedMeeting = await Meeting.create(meeting);

        return NextResponse.json(
            { message: "Meeting created successfully", Meeting: savedMeeting },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error('Error scheduling meeting:', error);
        return NextResponse.json(
            { message: 'Internal Server Error', error: (error as Error).message } , 
            { status: 500 }
        );
    }
}