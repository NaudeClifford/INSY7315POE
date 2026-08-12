// Photography services mock dataset containing packages, pricing tiers, inclusions, and sample galleries
import { Service } from "@/types/service";

// Complete list of photography services offered by Camryn Burger Photography
export const MOCK_SERVICES: Service[] = [

  {
    id: "serv-weddings",
    slug: "weddings",
    title: "Wedding Photography",
    tagline: "Timeless, romantic & editorial coverage for your most sacred day.",
    description: "Documenting genuine love stories, intricate details, and heartfelt emotions with fine-art precision.",
    longDescription: "Our wedding experience is designed to give you peace of mind while we capture every raw, intimate, and exhilarating moment of your day. From pre-ceremony preparations to grand receptions, our editorial documentary approach ensures your family heirloom photos remain timeless for generations.",
    imageUrl: "/backgrounds/demo-wedding.jpg",
    startingPriceZAR: 6500,
    approxDuration: "4 to 12 Hours",
    editedImagesSummary: "250 to 700+ High-Res Edited Images",
    inclusions: [
      "Full coverage options (Prep, Ceremony, Portraits, Reception)",
      "High-resolution online password-protected gallery",
      "Print-ready retouched digital downloads",
      "Pre-wedding consultation & timeline planning guide",
      "Sneak-peek photos delivered within 48 hours"
    ],
    packages: [
      {
        id: "pkg-wed-essential",
        serviceId: "serv-weddings",
        name: "Essential Story",
        tagline: "Ideal for intimate ceremonies & micro-weddings",
        durationHours: 5,
        editedImagesCount: 250,
        startingPriceZAR: 6500,
        features: [
          "5 Hours continuous coverage",
          "1 Professional Photographer",
          "250+ High-resolution edited photos",
          "Private online gallery valid for 3 months",
          "Sneak peek within 48 hours"
        ]
      },
      {
        id: "pkg-wed-editorial",
        serviceId: "serv-weddings",
        name: "Editorial Elegance",
        tagline: "Our most sought-after full wedding day package",
        durationHours: 8,
        editedImagesCount: 450,
        startingPriceZAR: 10500,
        popular: true,
        features: [
          "8 Hours continuous coverage",
          "Lead Photographer + Assistant",
          "450+ High-resolution edited photos",
          "Complimentary mini engagement shoot",
          "Private online gallery valid for 3 months",
          "Sneak peek within 48 hours"
        ]
      },
      {
        id: "pkg-wed-grand",
        serviceId: "serv-weddings",
        name: "The Grand heirloom",
        tagline: "Complete multi-photographer luxury coverage",
        durationHours: 12,
        editedImagesCount: 700,
        startingPriceZAR: 16000,
        features: [
          "Full day coverage (up to 12 Hours)",
          "2 Senior Photographers",
          "700+ High-resolution edited photos",
          "Full Engagement Session included",
          "Custom luxury photo album print voucher (R2,000 value)",
          "Priority 10-day turnaround"
        ]
      }
    ],
    addons: [
      { id: "add-extra-hour", name: "Extra Hourly Coverage", description: "Additional coverage per hour beyond package limit", priceZAR: 1200 },
      { id: "add-second-shooter", name: "Second Shooter", description: "Additional photographer for complete angle coverage", priceZAR: 2500 },
      { id: "add-album", name: "Fine Art Leather Album", description: "Handcrafted 30-page luxury layflat wedding album", priceZAR: 3800 }
    ]
  },
  {
    id: "serv-matric",
    slug: "matric-dances",
    title: "Matric Dances",
    tagline: "Glamorous, editorial portraits celebrating your high school milestone.",
    description: "Capturing the elegance, excitement, and style of your matric dance arrival and couples/individual portraits.",
    longDescription: "Your matric dance is a once-in-a-lifetime evening of celebration. We offer high-fashion pre-dance portrait sessions for individuals, couples, and friend groups at beautiful locations prior to your venue arrival.",
    imageUrl: "/backgrounds/demo-matric.jpg",
    startingPriceZAR: 2200,
    approxDuration: "1.5 to 3 Hours",
    editedImagesSummary: "40 to 100 Edited Images",
    inclusions: [
      "Pre-event portrait session at venue or scenic park",
      "Individual, partner, and family group portraits",
      "Car arrival photos",
      "Professional color grading & skin retouching"
    ],
    packages: [
      {
        id: "pkg-mat-solo",
        serviceId: "serv-matric",
        name: "Solo Glamour",
        tagline: "Focused on individual and family pre-dance portraits",
        durationHours: 1.5,
        editedImagesCount: 40,
        startingPriceZAR: 2200,
        features: [
          "1.5 Hours shoot time",
          "40 Hand-edited high-resolution photos",
          "Family & solo portraits",
          "Online gallery link"
        ]
      },
      {
        id: "pkg-mat-couple",
        serviceId: "serv-matric",
        name: "Couple & Arrival",
        tagline: "Full pre-dance portraits plus arrival coverage",
        durationHours: 2.5,
        editedImagesCount: 75,
        startingPriceZAR: 3400,
        popular: true,
        features: [
          "2.5 Hours shoot time",
          "75 Hand-edited high-resolution photos",
          "Couple, solo & family portraits",
          "Luxury car arrival shots",
          "Online gallery link"
        ]
      }
    ],
    addons: [
      { id: "add-friend-group", name: "Friend Group Add-on", description: "Include up to 4 extra friends for group portraits", priceZAR: 800 }
    ]
  },
  {
    id: "serv-graduations",
    slug: "graduations",
    title: "Graduation Sessions",
    tagline: "Commemorating academic success with classic, proud portraiture.",
    description: "Honor years of hard work with timeless graduation portraits on campus or in studio.",
    longDescription: "Walk tall with your cap, gown, and degree. We capture proud solo portraits, warm family group shots, and iconic campus walkway moments to preserve your proudest achievement.",
    imageUrl: "/backgrounds/demo-graduation.jpg",
    startingPriceZAR: 1800,
    approxDuration: "1 to 2 Hours",
    editedImagesSummary: "35 to 80 Edited Images",
    inclusions: [
      "On-campus or location portraits",
      "Gown, hood & scroll posing guidance",
      "Family & graduate group photos",
      "Digital delivery in high resolution"
    ],
    packages: [
      {
        id: "pkg-grad-std",
        serviceId: "serv-graduations",
        name: "Graduate Portrait",
        tagline: "Perfect for single graduates",
        durationHours: 1,
        editedImagesCount: 35,
        startingPriceZAR: 1800,
        features: [
          "1 Hour shoot",
          "35 Edited photos",
          "Graduate & immediate family shots",
          "Private online gallery"
        ]
      },
      {
        id: "pkg-grad-dlx",
        serviceId: "serv-graduations",
        name: "Graduate & Family Celebration",
        tagline: "Comprehensive campus & family portrait session",
        durationHours: 2,
        editedImagesCount: 80,
        startingPriceZAR: 2800,
        popular: true,
        features: [
          "2 Hours shoot time",
          "80 Edited photos",
          "Multiple outfit changes option",
          "Extended family shots",
          "Private online gallery"
        ]
      }
    ],
    addons: []
  },
  {
    id: "serv-corporate",
    slug: "corporate",
    title: "Corporate Events & Headshots",
    tagline: "Professional branding, executive headshots & dynamic event coverage.",
    description: "Elevate your corporate identity with crisp, modern headshots and seamless event documentation.",
    longDescription: "From annual summits and product launches to executive team headshots, we deliver high-caliber commercial imagery tailored to modern corporate branding standards.",
    imageUrl: "/backgrounds/demo-corporate.jpg",
    startingPriceZAR: 3200,
    approxDuration: "2 to 8 Hours",
    editedImagesSummary: "100 to 400 Edited Images",
    inclusions: [
      "High-speed event coverage & keynote documentation",
      "Mobile studio setup for headshots if needed",
      "Full commercial usage rights included",
      "Fast 5-day corporate turnaround option"
    ],
    packages: [
      {
        id: "pkg-corp-event",
        serviceId: "serv-corporate",
        name: "Half-Day Corporate Event",
        tagline: "Conferences, galas, and seminars",
        durationHours: 4,
        editedImagesCount: 180,
        startingPriceZAR: 4500,
        popular: true,
        features: [
          "4 Hours event coverage",
          "180 High-resolution corporate photos",
          "Commercial licensing included",
          "Candid networking & keynote shots"
        ]
      },
      {
        id: "pkg-corp-headshots",
        serviceId: "serv-corporate",
        name: "Team Headshots (Up to 15 Staff)",
        tagline: "Uniform corporate headshots for website & LinkedIn",
        durationHours: 3,
        editedImagesCount: 45,
        startingPriceZAR: 3200,
        features: [
          "3 Headshots per team member (15 staff max)",
          "Background color options",
          "Professional retouching",
          "Fast digital delivery"
        ]
      }
    ],
    addons: []
  },
  {
    id: "serv-couples",
    slug: "couples",
    title: "Couples & Engagements",
    tagline: "Warm, candid, and romantic connection shoots.",
    description: "Golden-hour lovers' shoots, surprise proposals, and engagement announcement sessions.",
    longDescription: "Relaxed, story-driven sessions that showcase your true chemistry. Whether in the bushveld, along golden grasslands, or in urban settings, we capture authentic love.",
    imageUrl: "/backgrounds/demo-couples.jpg",
    startingPriceZAR: 2400,
    approxDuration: "1.5 Hours",
    editedImagesSummary: "50 Edited Images",
    inclusions: [
      "1.5 Hours sunset or sunrise shoot",
      "Multiple outfit options",
      "Posing guidance for natural interaction",
      "Online high-res gallery"
    ],
    packages: [
      {
        id: "pkg-cpl-golden",
        serviceId: "serv-couples",
        name: "Golden Hour Romance",
        tagline: "Outdoor romantic couple or engagement shoot",
        durationHours: 1.5,
        editedImagesCount: 50,
        startingPriceZAR: 2400,
        popular: true,
        features: [
          "90 Minutes shoot time",
          "50 Hand-crafted edited photos",
          "Location recommendation included",
          "Private online gallery"
        ]
      }
    ],
    addons: []
  },
  {
    id: "serv-events",
    slug: "events",
    title: "Parties & Celebrations",
    tagline: "Vibrant documentation of birthdays, anniversaries, and family milestones.",
    description: "Capture the laughter, décor details, and joyful moments with family and friends.",
    longDescription: "From 21st birthday bashes and silver wedding anniversaries to baby showers and family reunions, we ensure every detail and guest reaction is documented with artistry.",
    imageUrl: "/backgrounds/demo-events.jpg",
    startingPriceZAR: 2800,
    approxDuration: "3 Hours",
    editedImagesSummary: "120 Edited Images",
    inclusions: [
      "Candid guest photos & venue décor details",
      "Speeches & cake cutting coverage",
      "Online shareable gallery for guests"
    ],
    packages: [
      {
        id: "pkg-evt-standard",
        serviceId: "serv-events",
        name: "Celebration Essentials",
        tagline: "3 Hours event coverage",
        durationHours: 3,
        editedImagesCount: 120,
        startingPriceZAR: 2800,
        popular: true,
        features: [
          "3 Hours coverage",
          "120 High-resolution photos",
          "Décor & candid guest shots",
          "Online gallery for 3 months"
        ]
      }
    ],
    addons: []
  }
];
