import { ActionFunction, json } from "@remix-run/node";
import { uploadAvatar } from "~/utils/s3.server";
import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  try {
    // 1. Get the user ID
    const userId = await requireUserId(request);

    // 2. Upload the avatar and get the image URL
    const imageUrl = await uploadAvatar(request) as string;
    console.log("imageUrl from avatar.tsx", imageUrl)

    // 3. Update the user profile picture in the database
    await db.user.update({
      where: {
        id: userId
      },
      data: {
        profilePicture: imageUrl
      }
    });

    // 4. Return the image URL in the response
    return json({ imageUrl });
  } catch (error) {
    console.error("Error in avatar action:", error);

    // Handle the error appropriately, you might want to return an error response
    return json({ error: "Failed to update avatar" }, { status: 500 });
  }
};
