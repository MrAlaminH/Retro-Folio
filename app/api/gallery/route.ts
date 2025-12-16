import { NextRequest, NextResponse } from "next/server";
import { discoverGalleryImagePaths } from "@/lib/gallery-discovery";
import { getAllCategories } from "@/data/gallery-data";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const limitParam = searchParams.get("limit");
  const offsetParam = searchParams.get("offset");

  try {
    // Discover all images (fast - just paths)
    const allImages = await discoverGalleryImagePaths();

    if (category) {
      const allCategoryImages = allImages.filter(
        (img) => img.category === category
      );
      const limit = limitParam ? parseInt(limitParam, 10) : undefined;
      const offset = offsetParam ? parseInt(offsetParam, 10) : 0;

      let result = allCategoryImages;
      if (limit !== undefined || offset > 0) {
        const start = offset;
        const end = limit ? offset + limit : undefined;
        result = allCategoryImages.slice(start, end);
      }

      return NextResponse.json(
        {
          images: result,
          total: allCategoryImages.length,
          category,
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        }
      );
    }

    // Return all categories if no specific category requested
    const categories = getAllCategories(allImages);
    return NextResponse.json(
      {
        categories,
        totalImages: allImages.length,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("Gallery API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery data" },
      { status: 500 }
    );
  }
}

