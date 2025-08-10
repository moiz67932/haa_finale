import { createClient } from "@/lib/supabase";

export async function uploadPublicImage(
  file: File,
  folder = "general"
): Promise<string | null> {
  const supabase = createClient();

  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return null;
    }

    const { data } = supabase.storage.from("uploads").getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error("Storage error:", error);
    return null;
  }
}

export async function deleteFile(url: string): Promise<boolean> {
  const supabase = createClient();

  try {
    // Extract file path from URL
    const urlParts = url.split("/uploads/");
    if (urlParts.length < 2) return false;

    const filePath = urlParts[1];

    const { error } = await supabase.storage.from("uploads").remove([filePath]);

    return !error;
  } catch (error) {
    console.error("Delete error:", error);
    return false;
  }
}
