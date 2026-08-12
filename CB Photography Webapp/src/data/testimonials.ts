// Client testimonials mock dataset for showcasing reviews and social proof
export interface Testimonial {
  id: string;
  clientName: string;
  roleOrEvent: string;
  quote: string;
  rating: number;
  imageUrl?: string;
  date: string;
}

// Client review feedback list displayed on home and about pages
export const MOCK_TESTIMONIALS: Testimonial[] = [

  {
    id: "test-1",
    clientName: "Anika & Johan Van Der Merwe",
    roleOrEvent: "Wedding Client",
    quote: "Camryn captured our wedding at Cradle Valley with such artistic nuance. When we received our private gallery, we were in tears—every emotion, every laugh was preserved so beautifully.",
    rating: 5,
    date: "December 2025"
  },
  {
    id: "test-2",
    clientName: "Sipho & Thandi Mobisa",
    roleOrEvent: "Matric Dance Parents",
    quote: "The Camryn Burger Photography team was so professional, punctual, and patient. Our daughter's matric dance arrival photos look like they belong in Vogue. Worth every single rand!",
    rating: 5,
    date: "October 2025"
  },
  {
    id: "test-3",
    clientName: "Dr. Megan Pillay",
    roleOrEvent: "Graduation Session",
    quote: "Booking online was seamless. Camryn made me feel relaxed immediately, and the final edited photographs were delivered ahead of schedule. Truly premium service.",
    rating: 5,
    date: "November 2025"
  },
  {
    id: "test-4",
    clientName: "Marcus Sterling",
    roleOrEvent: "Head of Marketing, Apex Global",
    quote: "We hired Camryn Burger Photography for our annual executive summit in Sandton. The corporate coverage and turnaround time exceeded our expectations. Highly recommended.",
    rating: 5,
    date: "January 2026"
  }
];
