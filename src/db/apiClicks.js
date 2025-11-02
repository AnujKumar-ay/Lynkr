import { UAParser } from "ua-parser-js";
import supabase from "./supabase";

export async function getClicksForUrls(urlIds) {
  const { data, error } = await supabase.from("clicks").select("*").in("url_id", urlIds)
  if (error){
    console.error(error.message)
    throw new Error("Unable to load Clicks");
  }
  return data;
}


// import { UAParser } from "ua-parser-js";
// import supabase from "./supabase";

export const storeClicks = async ({ id }) => {
  try {
    const parser = new UAParser();
    const device = parser.getResult().device.type || "desktop";

    // Fetch geolocation from frontend
    const response = await fetch("https://ipapi.co/json", { keepalive: true });
    const data = await response.json();
    
    const city = data.city || "unknown";
    const country = data.country_name || "unknown";

    // Insert click into Supabase
    const { data: clickData, error } = await supabase.from("clicks").insert({
      url_id: id,
      city,
      country,
      device,
    }).select();

    if (error) {
      console.error("Error inserting click:", error);
      throw error;
    }

    return clickData;
  } catch (error) {
    console.error("Error recording click:", error);
    throw error;
  }
};


export async function getClicksForUrl(url_id) {
  console.log("Fetching clicks for URL ID:", url_id);
  
  const { data, error } = await supabase
      .from("clicks")
      .select("*")
      .eq("url_id", url_id);
  
  if (error) {
    console.error("Database error:", error.message);
    throw new Error("Unable to load Stats");
  }
  
  console.log("Retrieved clicks data:", data);
  
  if (!data || data.length === 0) {
    console.log("No clicks found for this URL");
  }
  
  return data;
}