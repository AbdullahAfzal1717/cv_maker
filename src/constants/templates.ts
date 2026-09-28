export interface Template {
  id: string;
  name: string;
  tagline: string;
  category: "basic" | "intermediate" | "professional";
  image: string;
  hasImage: boolean;
  isPopular?: boolean;
}

export const TEMPLATES_DATA: Template[] = [
  { id: "classic-clean", name: "Classic Clean", tagline: "Simple & Professional", category: "basic", image: "/images/templates/1.webp", hasImage: true, isPopular: true },
  { id: "minimal-pro", name: "Minimal Pro", tagline: "Clean & Structured", category: "intermediate", image: "/images/templates/2.webp", hasImage: false },
  { id: "simple-resume", name: "Simple Resume", tagline: "Vibrant & Engaging", category: "basic", image: "/images/templates/3.webp", hasImage: false, isPopular: true },
  { id: "simple-structured", name: "Simple Structured", tagline: "Structured & Clear", category: "professional", image: "/images/templates/4.webp", hasImage: false },
  { id: "classic-professional", name: "Classic Professional", tagline: "Bold & Distinctive", category: "professional", image: "/images/templates/5.webp", hasImage: true, isPopular: true },
  { id: "modern-clean", name: "Modern Clean", tagline: "Timeless & Elegant", category: "intermediate", image: "/images/templates/6.webp", hasImage: true, isPopular: true },
  { id: "professional-modern", name: "Professional Modern", tagline: "Contemporary & Sophisticated", category: "professional", image: "/images/templates/7.webp", hasImage: false, isPopular: true },
  { id: "simple-focus", name: "Simple Focus", tagline: "Concise & Effective", category: "basic", image: "/images/templates/8.webp", hasImage: true },
  { id: "creative-edge", name: "Creative Edge", tagline: "Innovative & Unique", category: "professional", image: "/images/templates/9.webp", hasImage: true, isPopular: true },
  { id: "sharp-edge", name: "Sharp Edge", tagline: "Structured & Clear", category: "intermediate", image: "/images/templates/10.webp", hasImage: true },
  { id: "modern-sharp", name: "Modern Sharp", tagline: "Contemporary & Clear", category: "professional", image: "/images/templates/11.webp", hasImage: true, isPopular: true },
  { id: "classic-sharp", name: "Classic Sharp", tagline: "Timeless & Clear", category: "intermediate", image: "/images/templates/12.webp", hasImage: true, isPopular: true },
  { id: "pro-minimal", name: "Pro Minimal", tagline: "Professional & Minimalist", category: "basic", image: "/images/templates/13.webp", hasImage: true, isPopular: true },
  { id: "modern-professional", name: "Modern Professional", tagline: "Contemporary & Sophisticated", category: "professional", image: "/images/templates/14.webp", hasImage: true, isPopular: true },
  { id: "creative-pro", name: "Creative Pro", tagline: "Innovative & Unique", category: "intermediate", image: "/images/templates/15.webp", hasImage: true },
];

export const CATEGORIES = [
  { id: "all", name: "All" },
  { id: "basic", name: "Basic" },
  { id: "intermediate", name: "Intermediate" },
  { id: "professional", name: "Professional" },
];
