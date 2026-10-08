export function whatsappUrl(number: string, message: string): string {
  const digits = number.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}` : "";
}

export function packageEnquiryMessage(packageName: string, companyName: string): string {
  return `Hello ${companyName || "there"},\n\nI am interested in the package:\n${packageName}\n\nCould you please provide more details?\n\nThank you.`;
}

export function telephoneUrl(phone: string): string {
  const value = phone.trim().replace(/[^\d+*#,;]/g, "");
  return value ? `tel:${value}` : "";
}

const optimizedRemoteHosts = new Set([
  "images.unsplash.com",
  ...(process.env.NEXT_IMAGE_HOSTS ?? "")
    .split(",")
    .map((hostname) => hostname.trim().toLowerCase())
    .filter(Boolean),
]);

export function shouldOptimizeImage(src: string): boolean {
  if (src.startsWith("/") && !src.startsWith("//")) return true;

  try {
    const url = new URL(src);
    return url.protocol === "https:" && optimizedRemoteHosts.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}
