import { cookies } from "next/headers";
import jwt, { decode } from "jsonwebtoken";

export const getUserID = async () => {
  try {
    const cookiesStore = await cookies();
    const token = cookiesStore.get("token")?.value;
  
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  
    return { userId: decoded?.id };
  } catch (error) {
    console.log("Something went wrong : ", error.message)
    throw new Error(error.message)
  }
};
