import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "../(lib)/mongodb";
import StudentActivity, { IStudentActivity } from "../(model)/StudentActivity";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const {
      userId,
      userName,
      year,
      branch,
      subject,
      unitNumber,
      activityType,
      quizResult,
    } = body;

    if (
      !userId ||
      !userName ||
      !year ||
      !branch ||
      !subject ||
      !unitNumber ||
      !activityType
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const activity: Partial<IStudentActivity> = {
      userId,
      userName,
      year,
      branch,
      subject,
      unitNumber,
      activityType,
      timestamp: new Date(),
    };

    if (activityType === "quiz_submission" && quizResult) {
      activity.quizResult = quizResult;
    }

    const savedActivity = await StudentActivity.create(activity);

    return NextResponse.json(
      { message: "Activity logged successfully", activity: savedActivity },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error logging activity:", error);
    return NextResponse.json(
      { message: "Error logging activity", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const isAdmin = url.searchParams.get("isAdmin") === "true";

    if (!isAdmin && !userId) {
      return NextResponse.json(
        { message: "Unauthorized: userId or admin access required" },
        { status: 401 }
      );
    }

    const query: any = {};
    if (userId && !isAdmin) {
      query.userId = userId;
    }

    const activities = await StudentActivity.find(query).sort({
      timestamp: -1,
    });

    return NextResponse.json({ activities }, { status: 200 });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { message: "Error fetching activities", error: (error as Error).message },
      { status: 500 }
    );
  }
}