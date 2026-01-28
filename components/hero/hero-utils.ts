import { projectData } from "@/data/projectData";

// Utility function to convert publicationDate to short format (e.g., "July 03, 2024" -> "Jul 2024")
export function formatDateShort(publicationDate: string): string {
  const monthMap: { [key: string]: string } = {
    January: "Jan",
    February: "Feb",
    March: "Mar",
    April: "Apr",
    May: "May",
    June: "Jun",
    July: "Jul",
    August: "Aug",
    September: "Sep",
    October: "Oct",
    November: "Nov",
    December: "Dec",
  };

  // Try to parse using Date constructor first
  const date = new Date(publicationDate);
  if (!isNaN(date.getTime())) {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${year}`;
  }

  // Fallback: try to parse common formats manually (e.g., "July 03, 2024" or "Feb 1, 2025")
  const match = publicationDate.match(/(\w+)\s+\d+,\s+(\d{4})/);
  if (match) {
    const fullMonth = match[1];
    const year = match[2];
    const shortMonth = monthMap[fullMonth] || fullMonth.substring(0, 3);
    return `${shortMonth} ${year}`;
  }

  return publicationDate; // Return original if parsing fails
}

// Utility function to get raw publicationDate for sorting
export function getProjectRawDate(url: string): Date | null {
  // Extract slug from URL (e.g., "/projects/machine-man" -> "machine-man")
  const slugMatch = url.match(/\/projects\/(.+)/);
  if (!slugMatch) return null;

  const slug = slugMatch[1];
  const project = projectData.find((p) => p.slug === slug);

  if (project && project.publicationDate) {
    const date = new Date(project.publicationDate);
    return isNaN(date.getTime()) ? null : date;
  }

  return null;
}

// Utility function to match a project URL with projectData entry and get the date
export function getProjectDate(url: string): string | null {
  // Extract slug from URL (e.g., "/projects/machine-man" -> "machine-man")
  const slugMatch = url.match(/\/projects\/(.+)/);
  if (!slugMatch) return null;

  const slug = slugMatch[1];
  const project = projectData.find((p) => p.slug === slug);

  if (project && project.publicationDate) {
    return formatDateShort(project.publicationDate);
  }

  return null;
}
