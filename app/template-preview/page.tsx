import Landscaper5 from '@/templates/landscaper/Landscaper5';
import type { BusinessData } from '@/templates/types';

const MOCK: BusinessData = {
  name:         'GreenRoots Landscaping',
  businessType: 'landscaper',
  city:         'Portland',
  phone:        '(503) 724-5510',
  email:        'hello@greenrootslandscape.com',
  address:      '1842 SE Hawthorne Blvd, Portland, OR 97214',
  tagline:      'Landscape & Garden Specialists',
  subTagline:   'Growing beautiful spaces that last.',
  bookingUrl:   '#',
  hours: {
    weekdays: 'Mon – Fri: 7am – 6pm',
    saturday: 'Sat: 8am – 4pm',
    sunday:   'Sun: Closed',
  },
  services: [
    {
      name:        'Lawn Mowing & Edging',
      price:       '$49',
      description: 'Precision mowing, clean edge trimming, and thorough cleanup every visit. Your lawn, always at its best.',
      features:    ['Custom height adjustment', 'Edge & border trimming', 'Clipping removal', 'Post-service photo update'],
    },
    {
      name:        'Garden Design & Planting',
      price:       '$299',
      description: 'From concept to planting day — we design gardens that thrive through every season and match your outdoor vision.',
      features:    ['On-site design consultation', 'Seasonal plant selection', 'Native & drought-resistant options', 'Drip irrigation setup'],
    },
    {
      name:        'Tree & Hedge Trimming',
      price:       '$149',
      description: 'Expert pruning for healthier trees, safer branches, and sculpted hedges that define your property beautifully.',
      features:    ['Crown shaping & reduction', 'Dead & diseased wood removal', 'Hedge sculpting & levelling', 'All debris hauled away'],
    },
    {
      name:        'Seasonal Clean-Up',
      price:       '$89',
      description: 'Full-property seasonal prep — clearing debris, cutting back overgrowth, and getting your yard ready for the months ahead.',
      features:    ['Leaf & debris removal', 'Bed edging & weed clearing', 'Mulch top-up', 'Spring & fall packages'],
    },
  ],
  testimonials: [
    { name: 'Rachel M.', text: 'Our backyard was completely transformed. We couldn\'t believe the difference after just one season. Truly exceptional work from a team that cares.', context: 'Garden Design Client', rating: 5 },
    { name: 'David L.',  text: 'They show up on time, every time, without us ever having to follow up. The lawn has genuinely never looked this good in 10 years.', context: 'Weekly Lawn Service', rating: 5 },
    { name: 'Susan K.',  text: 'We had a full garden border installed with native plants. Six months later and every single plant is flourishing. Incredible expertise.', context: 'Planting Installation', rating: 5 },
    { name: 'Tom B.',    text: 'From the free estimate to the last leaf being swept — the whole experience was professional, friendly, and absolutely worth every cent.', context: 'Annual Maintenance Plan', rating: 5 },
  ],
  faq: [
    { q: 'Do I need to be home when you come?',         a: "Not at all. Most of our clients aren't home. As long as we can access the yard, we take care of everything and send you a photo report when done." },
    { q: 'How often do you recommend lawn mowing?',     a: 'Weekly during peak growing season (spring and summer), and bi-weekly in autumn. We\'ll recommend the ideal schedule based on your specific grass type.' },
    { q: 'Are your estimates really free?',             a: 'Completely free, no commitment required. We\'ll visit the property, walk through your goals, and provide a detailed written quote within 24 hours.' },
    { q: 'What happens if it rains on my service day?', a: 'We keep a close eye on forecasts and proactively reschedule within 48 hours — at no extra charge. Your service stays consistent no matter what.' },
  ],
  stats: [
    { value: 840,  label: 'Happy Clients',     suffix: '+' },
    { value: 12,   label: 'Years in Business', suffix: '+' },
    { value: 98,   label: 'Satisfaction Rate', suffix: '%' },
    { value: 4.9,  label: 'Average Rating',    suffix: '★' },
  ],
  gallery:        [],
  certifications: ['ISA Certified Arborist', 'Licensed & Insured', 'Eco-Friendly Products', 'EPA WaterSmart Partner'],
  serviceAreas:   ['Portland', 'Beaverton', 'Lake Oswego', 'Tigard', 'Tualatin'],
};

export default function TemplatePreviewPage() {
  return <Landscaper5 businessData={MOCK} />;
}
