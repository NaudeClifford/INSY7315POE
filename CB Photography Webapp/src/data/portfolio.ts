// Portfolio gallery dataset containing indexed real photographer photographs across categories
import { GalleryItem } from "@/types/gallery";

// Featured gallery items showcasing real client & photographer portrait sessions
export const MOCK_PORTFOLIO: GalleryItem[] = [
  // --- SOLO PORTRAITS ---
  {
    id: "port-solo-1",
    title: "Studio Golden Hour Solo Portrait",
    category: "Solo",
    imageUrl: "/portfolio/solo-1.jpg",
    aspectRatio: "portrait",
    location: "Pretoria East, Gauteng",
    date: "February 2026",
    photographer: "Camryn Burger"
  },
  {
    id: "port-solo-2",
    title: "Urban Minimalist Solo Shoot",
    category: "Solo",
    imageUrl: "/portfolio/solo-2.jpg",
    aspectRatio: "portrait",
    location: "Rosebank, Sandton",
    date: "January 2026",
    photographer: "Camryn Burger"
  },
  {
    id: "port-solo-3",
    title: "Warm Sunset Solo Portraiture",
    category: "Solo",
    imageUrl: "/portfolio/solo-3.jpg",
    aspectRatio: "portrait",
    location: "Muldersdrift, Gauteng",
    date: "February 2026",
    photographer: "Lethabo Ndlovu"
  },
  {
    id: "port-solo-4",
    title: "Classic Editorial Solo Session",
    category: "Solo",
    imageUrl: "/portfolio/solo-4.jpg",
    aspectRatio: "portrait",
    location: "Johannesburg Studio",
    date: "January 2026",
    photographer: "Camryn Burger"
  },
  {
    id: "port-solo-5",
    title: "Natural Light Outdoor Solo Shoot",
    category: "Solo",
    imageUrl: "/portfolio/solo-5.jpg",
    aspectRatio: "portrait",
    location: "Kirstenbosch, Cape Town",
    date: "December 2025",
    photographer: "Camryn Burger"
  },
  {
    id: "port-solo-6",
    title: "Contemporary Fine Art Solo Portrait",
    category: "Solo",
    imageUrl: "/portfolio/solo-6.jpg",
    aspectRatio: "portrait",
    location: "Pretoria Studio",
    date: "February 2026",
    photographer: "Lethabo Ndlovu"
  },
  {
    id: "port-solo-7",
    title: "Elegance & Radiance Solo Shoot",
    category: "Solo",
    imageUrl: "/portfolio/solo-7.jpg",
    aspectRatio: "portrait",
    location: "Northcliff, JHB",
    date: "November 2025",
    photographer: "Camryn Burger"
  },
  {
    id: "port-solo-8",
    title: "Captivating Studio Solo Experience",
    category: "Solo",
    imageUrl: "/portfolio/solo-8.jpg",
    aspectRatio: "portrait",
    location: "Fourways, Sandton",
    date: "January 2026",
    photographer: "Camryn Burger"
  },
  {
    id: "port-solo-corp",
    title: "Executive Headshot Solo Shoot",
    category: "Corporate",
    imageUrl: "/portfolio/corporate-solo-1.jpg",
    aspectRatio: "portrait",
    location: "Sandton Financial District",
    date: "February 2026",
    photographer: "Camryn Burger"
  },

  // --- COUPLE SESSIONS ---
  {
    id: "port-couple-1",
    title: "Golden Sunset Engagement Session",
    category: "Couples",
    imageUrl: "/portfolio/couple-1.jpg",
    aspectRatio: "portrait",
    location: "Cradle of Humankind",
    date: "February 2026",
    photographer: "Camryn Burger"
  },
  {
    id: "port-couple-2",
    title: "Intimate Grassland Couple Shoot",
    category: "Couples",
    imageUrl: "/portfolio/couple-2.jpg",
    aspectRatio: "landscape",
    location: "Muldersdrift, Gauteng",
    date: "January 2026",
    photographer: "Camryn Burger"
  },
  {
    id: "port-couple-3",
    title: "Romantic Garden Walk Couple Portrait",
    category: "Couples",
    imageUrl: "/portfolio/couple-3.jpg",
    aspectRatio: "portrait",
    location: "Walter Sisulu Gardens",
    date: "December 2025",
    photographer: "Lethabo Ndlovu"
  },
  {
    id: "port-couple-4",
    title: "High Fashion Anniversary Session",
    category: "Couples",
    imageUrl: "/portfolio/couple-4.jpg",
    aspectRatio: "portrait",
    location: "Sandton, Johannesburg",
    date: "January 2026",
    photographer: "Camryn Burger"
  },
  {
    id: "port-couple-5",
    title: "Sunset Promenade Couples Shoot",
    category: "Couples",
    imageUrl: "/portfolio/couple-5.jpg",
    aspectRatio: "portrait",
    location: "Pretoria East",
    date: "February 2026",
    photographer: "Camryn Burger"
  },
  {
    id: "port-couple-6",
    title: "Charming Outdoor Couples Portrait",
    category: "Couples",
    imageUrl: "/portfolio/couple-6.jpg",
    aspectRatio: "portrait",
    location: "Magaliesburg",
    date: "November 2025",
    photographer: "Lethabo Ndlovu"
  },
  {
    id: "port-couple-7",
    title: "Golden Hour Embrace Couple Shoot",
    category: "Couples",
    imageUrl: "/portfolio/couple-7.jpg",
    aspectRatio: "portrait",
    location: "Hartbeespoort, North West",
    date: "December 2025",
    photographer: "Camryn Burger"
  },

  // --- GRADUATIONS ---
  {
    id: "port-grad-1",
    title: "Wits Honors Graduation Portrait",
    category: "Graduations",
    imageUrl: "/portfolio/graduation-1.jpg",
    aspectRatio: "portrait",
    location: "Braamfontein, Johannesburg",
    date: "December 2025",
    photographer: "Lethabo Ndlovu"
  },
  {
    id: "port-grad-2",
    title: "Pretoria Campus Commemorative Shoot",
    category: "Graduations",
    imageUrl: "/portfolio/graduation-2.jpg",
    aspectRatio: "portrait",
    location: "Hatfield, Pretoria",
    date: "November 2025",
    photographer: "Camryn Burger"
  },

  // --- EVENTS & BIRTHDAYS & CORPORATE ---
  {
    id: "port-birthday-1",
    title: "21st Birthday Milestone Celebration",
    category: "Events",
    imageUrl: "/portfolio/birthday-1.jpg",
    aspectRatio: "portrait",
    location: "Fourways, Sandton",
    date: "January 2026",
    photographer: "Lethabo Ndlovu"
  },
  {
    id: "port-corp-gather",
    title: "Corporate Annual Summit & Dinner",
    category: "Events",
    imageUrl: "/portfolio/corporate-gathering-1.jpg",
    aspectRatio: "landscape",
    location: "Rosebank Convention Center",
    date: "January 2026",
    photographer: "Camryn Burger"
  },

  // --- GROUP SHOOTS ---
  {
    id: "port-group-1",
    title: "Friends & Family Celebration Group Shoot",
    category: "Group",
    imageUrl: "/portfolio/group-1.jpg",
    aspectRatio: "landscape",
    location: "Rosebank, JHB",
    date: "February 2026",
    photographer: "Camryn Burger"
  },
  {
    id: "port-corp-grp1",
    title: "Executive Board Leadership Shoot",
    category: "Corporate",
    imageUrl: "/portfolio/corporate-group-1.jpg",
    aspectRatio: "landscape",
    location: "Sandton, Johannesburg",
    date: "February 2026",
    photographer: "Camryn Burger"
  },
  {
    id: "port-corp-grp2",
    title: "Department Team Synergy Group Session",
    category: "Corporate",
    imageUrl: "/portfolio/corporate-group-2.jpg",
    aspectRatio: "landscape",
    location: "Pretoria Business Hub",
    date: "January 2026",
    photographer: "Lethabo Ndlovu"
  },

  // --- MATRIC DANCES ---
  {
    id: "port-matric-1",
    title: "Matric Farewell Red Carpet Arrival",
    category: "Matric Dances",
    imageUrl: "/portfolio/matric-dance-1.jpg",
    aspectRatio: "portrait",
    location: "Centurion, Pretoria",
    date: "October 2025",
    photographer: "Camryn Burger"
  },
  {
    id: "port-matric-2",
    title: "Matric Dance Ballgown Glamour Portrait",
    category: "Matric Dances",
    imageUrl: "/portfolio/matric-solo-1.jpg",
    aspectRatio: "portrait",
    location: "Bedfordview, JHB",
    date: "November 2025",
    photographer: "Camryn Burger"
  },

  // --- WEDDINGS ---
  {
    id: "port-wedding-1",
    title: "Luxury Vineyard Wedding Ceremony",
    category: "Weddings",
    imageUrl: "/portfolio/wedding-1.jpg",
    aspectRatio: "landscape",
    location: "Muldersdrift Estate",
    date: "January 2026",
    photographer: "Camryn Burger"
  },
  {
    id: "port-wedding-2",
    title: "Romantic Reception Toast & Celebration",
    category: "Weddings",
    imageUrl: "/portfolio/wedding-2.jpg",
    aspectRatio: "landscape",
    location: "Stellenbosch Wine Estate",
    date: "December 2025",
    photographer: "Camryn Burger"
  },
  {
    id: "port-wedding-3",
    title: "Sunset Bridal & Groom Portraiture",
    category: "Weddings",
    imageUrl: "/portfolio/wedding-3.jpg",
    aspectRatio: "portrait",
    location: "Cradle of Humankind",
    date: "February 2026",
    photographer: "Camryn Burger"
  },
  {
    id: "port-wedding-solo",
    title: "Bridal Elegance Solo Portrait",
    category: "Weddings",
    imageUrl: "/portfolio/wedding-solo-1.jpg",
    aspectRatio: "portrait",
    location: "Pretoria Country Estate",
    date: "January 2026",
    photographer: "Lethabo Ndlovu"
  }
];

