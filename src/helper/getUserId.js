import { cookies } from "next/headers";
import jwt, { decode } from "jsonwebtoken";


/**
 * Extracts the user ID from a JWT token stored in cookies.
 * 
 * @async
 * @function getUserID
 * @returns {Promise<Object>} An object containing the user ID extracted from the token.
 * @returns {string} returns.userId - The ID of the authenticated user.
 * @throws {Error} Throws an error if token verification fails or if token is missing.
 * @description This function retrieves the JWT token from cookies, verifies it using the
 * REFRESH_TOKEN_SECRET environment variable, and extracts the user ID from the decoded token.
 */
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
