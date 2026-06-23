/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Movie, Showtime, TheaterShowtimes, Seat, DailyAnalytics, TheaterOccupancy, FoodItem } from '../types';

// Real-world, highly immersive movie metadata customized with stylish colors and gradient backgrounds
export const MOCK_MOVIES: Movie[] = [
  {
    id: 'm1',
    title: 'Kalki 2898 AD',
    rating: 'UA',
    genre: ['Sci-Fi', 'Action', 'Mythology'],
    duration: '3h 01m',
    synopsis: 'A modern avatar of Vishnu, a mythical savior figure, is believed to have descended to Earth to protect the world from evil forces in a decaying dystopian world called Kasi.',
    starring: ['Prabhas', 'Amitabh Bachchan', 'Kamal Haasan', 'Deepika Padukone'],
    director: 'Nag Ashwin',
    ratingScore: 9.4,
    backdrop: 'linear-gradient(135deg, rgba(20,20,35,0.95) 0%, rgba(122,92,38,0.4) 100%)',
    accentColor: '#FFB800', // Miraj Gold
    isFeatured: true,
    posterUrl: 'https://image.tmdb.org/t/p/w500/rstcAnBeCkxNQjNp3YXrF6IP1tW.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/o8XSR1SONnjcsv84NRu6Mwsl5io.jpg',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Kalki_2898_AD_logo.png',
    directorPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80',
    trailerYoutubeId: '7tP6S-WJ7O0',
    localVideoUrl: '/vidssave.com Prabhas as the POWERFUL Suryaputra Karna ❤️_🔥 _ Kalki 2898 AD _ Netflix India 1080p.mp4',
    cast: [
      { name: 'Prabhas', character: 'Bhairava / Karna', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face&q=80' },
      { name: 'Amitabh Bachchan', character: 'Ashwatthama', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face&q=80' },
      { name: 'Kamal Haasan', character: 'Supreme Yaskin', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face&q=80' },
      { name: 'Deepika Padukone', character: 'Sumati (Sum-80)', photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face&q=80' }
    ]
  },
  {
    id: 'm2',
    title: 'Gladiator II',
    rating: 'A',
    genre: ['Action', 'Adventure', 'History'],
    duration: '2h 28m',
    synopsis: 'Years after witnessing the death of the revered hero Maximus, Lucius is forced to enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.',
    starring: ['Paul Mescal', 'Pedro Pascal', 'Denzel Washington', 'Connie Nielsen'],
    director: 'Ridley Scott',
    ratingScore: 8.9,
    backdrop: 'linear-gradient(135deg, rgba(15,15,22,0.95) 0%, rgba(184,45,45,0.3) 100%)',
    accentColor: '#EF4444', 
    isFeatured: false,
    posterUrl: 'https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/tOqIwliWMovSIZ9DyvHcHI7p2im.jpg',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Gladiator_II_logo.png',
    directorPhotoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&q=80',
    trailerYoutubeId: 'gT8_wYis7tA',
    cast: [
      { name: 'Paul Mescal', character: 'Lucius Verus', photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&h=120&fit=crop&crop=face&q=80' },
      { name: 'Pedro Pascal', character: 'Marcus Acacius', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&crop=face&q=80' },
      { name: 'Denzel Washington', character: 'Macrinus', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&crop=face&q=80' },
      { name: 'Connie Nielsen', character: 'Lucilla', photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=face&q=80' }
    ]
  },
  {
    id: 'm3',
    title: 'Wicked',
    rating: 'U',
    genre: ['Fantasy', 'Musical', 'Romance'],
    duration: '2h 40m',
    synopsis: 'The untold story of the witches of Oz. After meeting at Shiz University, Elphaba, a young woman misunderstood of her green skin, and Glinda, a popular blonde lady, forge an unlikely yet profound friendship.',
    starring: ['Cynthia Erivo', 'Ariana Grande', 'Jonathan Bailey', 'Jeff Goldblum'],
    director: 'Jon M. Chu',
    ratingScore: 9.1,
    backdrop: 'linear-gradient(135deg, rgba(10,25,15,0.95) 0%, rgba(132,204,22,0.3) 100%)',
    accentColor: '#10B981', 
    isFeatured: false,
    posterUrl: 'https://image.tmdb.org/t/p/w500/xDGbZ0JJ3mYaGKy4Nzd9Kph6M9L.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/fyZ6SDUS4o9jp2EHxfZa3qS9ean.jpg',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Wicked_movie_logo.png',
    directorPhotoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&h=150&fit=crop&q=80',
    trailerYoutubeId: 'F_SStP_g6Yw',
    cast: [
      { name: 'Cynthia Erivo', character: 'Elphaba Thropp', photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=120&fit=crop&crop=face&q=80' },
      { name: 'Ariana Grande', character: 'Glinda Upland', photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=face&q=80' },
      { name: 'Jonathan Bailey', character: 'Fiyero Tigelaar', photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=face&q=80' },
      { name: 'Jeff Goldblum', character: 'The Wonderful Wizard of Oz', photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&h=120&fit=crop&crop=face&q=80' }
    ]
  },
  {
    id: 'm4',
    title: 'Dune: Part Two',
    rating: 'UA',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    duration: '2h 46m',
    synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future.',
    starring: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Austin Butler'],
    director: 'Denis Villeneuve',
    ratingScore: 9.5,
    backdrop: 'linear-gradient(135deg, rgba(18,12,8,0.95) 0%, rgba(245,158,11,0.25) 100%)',
    accentColor: '#F59E0B', 
    isFeatured: false,
    posterUrl: 'https://image.tmdb.org/t/p/w500/3HzGtM0JpfH2pWFGugJK22LRP6b.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/eZ239CUp1d6OryZEBPnO2n87gMG.jpg',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Dune_-_Part_Two_logo.svg',
    directorPhotoUrl: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=150&h=150&fit=crop&q=80',
    trailerYoutubeId: 'U2Qp5pL3YIs',
    localVideoUrl: '/vidssave.com Dune_ Part Two _ Official Trailer 1080p.mp4',
    cast: [
      { name: 'Timothée Chalamet', character: 'Paul Atreides', photoUrl: 'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=120&h=120&fit=crop&crop=face&q=80' },
      { name: 'Zendaya', character: 'Chani', photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&h=120&fit=crop&crop=face&q=80' },
      { name: 'Rebecca Ferguson', character: 'Lady Jessica Atreides', photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face&q=80' },
      { name: 'Austin Butler', character: 'Feyd-Rautha Harkonnen', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face&q=80' }
    ]
  },
  {
    id: 'm5',
    title: 'Pushpa 2: The Rule',
    rating: 'UA',
    genre: ['Crime', 'Action', 'Thriller'],
    duration: '2h 58m',
    synopsis: 'The clash continues between Pushpa and Bhanwar Singh Shekhawat in this powerhouse sequel, tracing the rise of Pushpas empire amidst intense rivalry and international smuggling conspiracies.',
    starring: ['Allu Arjun', 'Rashmika Mandanna', 'Fahadh Faasil', 'Sunil'],
    director: 'Sukumar',
    ratingScore: 9.3,
    backdrop: 'linear-gradient(135deg, rgba(20,10,10,0.95) 0%, rgba(220,38,38,0.3) 100%)',
    accentColor: '#DC2626', 
    isFeatured: false,
    posterUrl: 'https://image.tmdb.org/t/p/w500/xkYGdKuK8jfqvGNCZV1uNdYkIfS.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/keC82cQ8q0ZHthrbvzWq04kGnbv.jpg',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Pushpa_2_The_Rule_logo.png',
    directorPhotoUrl: 'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=150&h=150&fit=crop&q=80',
    trailerYoutubeId: 'kGgA6jPqXn0',
    localVideoUrl: '/vidssave.com Pushpa 2 - The Rule Trailer (Hindi) _ Allu Arjun _ Sukumar _ Rashmika Mandanna _ Fahadh Faasil _ DSP 1080p.mp4',
    cast: [
      { name: 'Allu Arjun', character: 'Pushpa Raj', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face&q=80' },
      { name: 'Rashmika Mandanna', character: 'Srivalli Raj', photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face&q=80' },
      { name: 'Fahadh Faasil', character: 'SP Bhanwar Singh Shekhawat', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&crop=face&q=80' },
      { name: 'Jagadeesh Prathap Bandari', character: 'Keshav / Mondhel', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&crop=face&q=80' }
    ]
  },
  {
    id: 'm6',
    title: 'Stree 2',
    rating: 'UA',
    genre: ['Comedy', 'Horror', 'Mystery'],
    duration: '2h 27m',
    synopsis: 'Chanderi is being haunted again, but this time by a headless ghost called Sarkata who is kidnapping women. Out of desperation, the townspeople ask the mysterious lady from the past to save them.',
    starring: ['Shraddha Kapoor', 'Rajkummar Rao', 'Pankaj Tripathi', 'Abhishek Banerjee'],
    director: 'Amar Kaushik',
    ratingScore: 9.1,
    backdrop: 'linear-gradient(135deg, rgba(15,10,25,0.95) 0%, rgba(139,92,246,0.3) 100%)',
    accentColor: '#8B5CF6', 
    isFeatured: false,
    posterUrl: 'https://image.tmdb.org/t/p/w500/2NC7sj8rheKxWqLYAbHnCa4mYBH.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/fVV0A67kDjTTQ4CvUn8LoletRmI.jpg',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Stree_2_logo_transparent.png',
    directorPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80',
    trailerYoutubeId: 'JVX7R6b4_rs',
    cast: [
      { name: 'Shraddha Kapoor', character: 'Stree (Mysterious Woman)', photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=120&fit=crop&crop=face&q=80' },
      { name: 'Rajkummar Rao', character: 'Vicky', photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&h=120&fit=crop&crop=face&q=80' },
      { name: 'Pankaj Tripathi', character: 'Rudra', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&crop=face&q=80' },
      { name: 'Abhishek Banerjee', character: 'Jana', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face&q=80' }
    ]
  },
  {
    id: 'm7',
    title: 'Kantara: Chapter 1',
    rating: 'UA',
    genre: ['Action', 'Drama', 'Thriller'],
    duration: '2h 35m',
    synopsis: 'A pre-quel tracing the ancient origins of the sacred deity covenant, showing the legendary hero who first champions the tribal land rights through ritual spirit dances and deep forest combats.',
    starring: ['Rishab Shetty', 'Kishore', 'Achyuth Kumar'],
    director: 'Rishab Shetty',
    ratingScore: 9.2,
    backdrop: 'linear-gradient(135deg, rgba(12,18,12,0.95) 0%, rgba(16,185,129,0.25) 100%)',
    accentColor: '#10B981', 
    isFeatured: false,
    posterUrl: 'https://image.tmdb.org/t/p/w500/hmprmTW6bwlYLNlNOICYrkXOr0e.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/w57nxiBIODAYHLRs1xmrCY9zEFe.jpg',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Kantara_logo-trans.png',
    directorPhotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&q=80',
    trailerYoutubeId: 'yZqf3r7o2-4',
    localVideoUrl: '/vidssave.com Kantara Chapter 1 Trailer - Hindi _ Rishab Shetty _ Rukmini _ Vijay Kiragandur _ Hombale Films 1080P.mp4',
    cast: [
      { name: 'Rishab Shetty', character: 'Shiva / Kaadubettu Siva', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&crop=face&q=80' },
      { name: 'Kishore', character: 'Muralidhar (Forest Officer)', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face&q=80' },
      { name: 'Achyuth Kumar', character: 'Devendra Suttooru', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face&q=80' }
    ]
  },
  {
    id: 'm8',
    title: 'Manjummel Boys',
    rating: 'U',
    genre: ['Adventure', 'Drama', 'Survival'],
    duration: '2h 15m',
    synopsis: 'A group of friends face the ultimate test of courage and loyalty when one of them falls deep into the Guna Caves, leading to an extraordinary, high-stakes physical rescue mission in Kodaikanal.',
    starring: ['Soubin Shahir', 'Sreenath Bhasi', 'Baloo Varghese', 'Ganapathi'],
    director: 'Chidambaram',
    ratingScore: 9.0,
    backdrop: 'linear-gradient(135deg, rgba(15,20,25,0.95) 0%, rgba(59,130,246,0.3) 100%)',
    accentColor: '#3B82F6', 
    isFeatured: false,
    posterUrl: 'https://image.tmdb.org/t/p/w500/bswrtewwthpsh6nABiqKevU4UBI.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/zGsHpuMN412VyzJZZnQeq4lMdjF.jpg',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Manjummel_Boys_logo.png',
    directorPhotoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&q=80',
    trailerYoutubeId: 'idvUHeZ3FUM',
    cast: [
      { name: 'Soubin Shahir', character: 'Kuttan', photoUrl: 'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=120&h=120&fit=crop&crop=face&q=80' },
      { name: 'Sreenath Bhasi', character: 'Subhash', photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&h=120&fit=crop&crop=face&q=80' },
      { name: 'Baloo Varghese', character: 'Sixen', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face&q=80' },
      { name: 'Ganapathi', character: 'Sajeev', photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=face&q=80' }
    ]
  }
];

// High fidelity list of theaters and dynamic showtimes grouped per city
export const CITY_THEATERS_MAP: Record<string, { name: string; distance: string }[]> = {
  'Mumbai': [
    { name: 'Miraj Cinemas: Fun Square (Kandivali)', distance: '1.2 km' },
    { name: 'Miraj Cinemas: Shalimar Multiplexing (Chambur)', distance: '4.8 km' },
    { name: 'Miraj Cinemas: Premium Palms (Goregaon)', distance: '7.1 km' }
  ],
  'Pune': [
    { name: 'Miraj Cinemas: Shalimar Multiplex (Saras Baug)', distance: '2.1 km' },
    { name: 'Miraj Cinemas: Royal Arcade (Viman Nagar)', distance: '5.3 km' }
  ],
  'Bengaluru': [
    { name: 'Miraj Cinemas: TNS Mall (Koramangala)', distance: '1.8 km' },
    { name: 'Miraj Cinemas: Elementa Multiplex (Whitefield)', distance: '8.4 km' }
  ],
  'Belagavi': [
    { name: 'Miraj Cinemas: Ashoka Multiplex (Khade Bazar)', distance: '0.5 km' },
    { name: 'Miraj Cinemas: Millennium Heights (Ganeshpur)', distance: '3.2 km' }
  ]
};

// Generates stable showtimes for a movie inside a city
export function getShowtimesForCityAndMovie(city: string, movieId: string): TheaterShowtimes[] {
  const theaters = CITY_THEATERS_MAP[city] || CITY_THEATERS_MAP['Mumbai'];
  
  // Consistent showtime slots to assign
  const timeSlotsByTheater: Record<number, { time: string; screenType: Showtime['screenType'] }[]> = {
    0: [
      { time: '10:15 AM', screenType: '2D DOLBY ATMOS' },
      { time: '01:45 PM', screenType: 'IMAX 3D' },
      { time: '05:15 PM', screenType: 'IMAX 3D' },
      { time: '08:45 PM', screenType: 'GOLD VIP' },
      { time: '11:30 PM', screenType: '2D DOLBY ATMOS' }
    ],
    1: [
      { time: '11:00 AM', screenType: '2D DOLBY ATMOS' },
      { time: '03:15 PM', screenType: '4DX' },
      { time: '07:00 PM', screenType: 'GOLD VIP' },
      { time: '10:30 PM', screenType: '4DX' }
    ],
    2: [
      { time: '12:30 PM', screenType: '2D DOLBY ATMOS' },
      { time: '04:30 PM', screenType: '2D DOLBY ATMOS' },
      { time: '08:00 PM', screenType: 'GOLD VIP' }
    ]
  };

  return theaters.map((theater, idx) => {
    const theaterId = `t-${movieId}-${city.toLowerCase()}-${idx}`;
    const slots = timeSlotsByTheater[idx % 3];

    const showtimes: Showtime[] = slots.map((slot, sIdx) => {
      // Different screen types have different pricing scales
      let priceStandard = 250;
      let priceVIP = 450;

      if (slot.screenType === 'GOLD VIP') {
        priceStandard = 380;
        priceVIP = 650;
      } else if (slot.screenType === 'IMAX 3D') {
        priceStandard = 400;
        priceVIP = 700;
      } else if (slot.screenType === '4DX') {
        priceStandard = 350;
        priceVIP = 580;
      }

      // Slightly adjust based on slot time (evening premium)
      if (slot.time.includes('PM')) {
        priceStandard += 50;
        priceVIP += 70;
      }

      return {
        id: `${theaterId}-showtime-${sIdx}`,
        time: slot.time,
        screenType: slot.screenType,
        theaterId,
        theaterName: theater.name,
        priceStandard,
        priceVIP
      };
    });

    return {
      theaterId,
      theaterName: theater.name,
      distance: theater.distance,
      showtimes
    };
  });
}

/**
 * Builds a realistic seating matrix layout
 * Standard row counts, VIP recliners, walk spaces (aisle placeholders)
 * Includes a deterministically random booked seating generation using showtimeId as seed
 */
export function generateSeatingLayout(showtimeId: string): Seat[] {
  // Deterministic random seed from showtime hash so seats don't jitter during renders but feel unique per layout
  let seed = 0;
  for (let i = 0; i < showtimeId.length; i++) {
    seed += showtimeId.charCodeAt(i);
  }
  const seededRandom = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const layout: Seat[] = [];

  // Rows configuration
  // A, B, C, D, E: Standard Seats (14 seats wide, split by physical aisles)
  // F, G: VIP Lounge Recliners
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const columnsCount = 14;

  rows.forEach((rowChar) => {
    const isVipRow = rowChar === 'F' || rowChar === 'G';
    const isPremiumRow = rowChar === 'D' || rowChar === 'E';
    const isBackrow = rowChar === 'G';

    for (let col = 1; col <= columnsCount; col++) {
      const id = `${rowChar}${col}`;

      // Design physical aisles to simulate physical walk spaces (Columns 4 and 11 act as aisles)
      // On VIP rows, columns 4, 5, 10, 11 act as aisles for extra spacing
      const isStandardAisle = col === 4 || col === 11;
      const isVipAisle = isVipRow && (col === 4 || col === 5 || col === 10 || col === 11);
      
      const isAisle = isVipRow ? isVipAisle : isStandardAisle;

      if (isAisle) {
        layout.push({
          id,
          row: rowChar,
          col,
          type: 'aisle',
          status: 'booked' // AISLE is unclickable and faded
        });
        continue;
      }

      // Approximately 30-40% of seats are randomly pre-booked
      const randomVal = seededRandom();
      const status: Seat['status'] = randomVal < 0.38 ? 'booked' : 'available';

      layout.push({
        id,
        row: rowChar,
        col,
        type: isVipRow ? 'vip' : isPremiumRow ? 'premium' : 'standard',
        status
      });
    }
  });

  return layout;
}

// Manager Operations Dashboard Mock Data
export const MOCK_OPERATIONS_ANALYTICS: DailyAnalytics[] = [
  { timeSlot: '09:00 AM', occupancy: 12, velocity: 4 },
  { timeSlot: '11:30 AM', occupancy: 42, velocity: 15 },
  { timeSlot: '02:00 PM', occupancy: 68, velocity: 22 },
  { timeSlot: '04:30 PM', occupancy: 82, velocity: 34 },
  { timeSlot: '07:00 PM', occupancy: 95, velocity: 61 },
  { timeSlot: '09:30 PM', occupancy: 88, velocity: 45 },
  { timeSlot: '11:45 PM', occupancy: 51, velocity: 18 }
];

export const MOCK_THEATER_OCCUPANCY: TheaterOccupancy[] = [
  { movieTitle: 'Kalki 2898 AD', occupancyRate: 88, seatsBooked: 246, totalSeats: 280 },
  { movieTitle: 'Gladiator II', occupancyRate: 64, seatsBooked: 128, totalSeats: 200 },
  { movieTitle: 'Wicked', occupancyRate: 72, seatsBooked: 108, totalSeats: 150 },
  { movieTitle: 'Dune: Part Two', occupancyRate: 81, seatsBooked: 162, totalSeats: 200 }
];

export const MOCK_FOOD_ITEMS: FoodItem[] = [
  {
    id: 'f1',
    name: 'Miraj Trio Combo',
    price: 450,
    description: '1 Large Tub Popcorn + 2 Medium Soft Drinks + 1 Salted Fries. Perfect for sharing.',
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300&h=300&fit=crop&q=80',
    category: 'Combos'
  },
  {
    id: 'f2',
    name: 'Golden Nacho Combo',
    price: 320,
    description: '1 Crispy Jalapeño Cheese Nachos + 1 Medium Pepsi.',
    imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=300&h=300&fit=crop&q=80',
    category: 'Combos'
  },
  {
    id: 'f3',
    name: 'Caramel Glaze Tub (L)',
    price: 260,
    description: 'Jumbo tub of crunchy popcorn coated in delicious buttery caramel.',
    imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=300&h=300&fit=crop&q=80',
    category: 'Snacks'
  },
  {
    id: 'f4',
    name: 'Salted Popcorn Tub (M)',
    price: 190,
    description: 'Warm popcorn seasoned with premium sea salt and melted butter.',
    imageUrl: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1130?w=300&h=300&fit=crop&q=80',
    category: 'Snacks'
  },
  {
    id: 'f5',
    name: 'Crispy Veg Burger',
    price: 180,
    description: 'Toasted bun with crispy potato patty, signature sauce, and fresh lettuce.',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop&q=80',
    category: 'Snacks'
  },
  {
    id: 'f6',
    name: 'Pepsi Black Regular',
    price: 130,
    description: 'Chilled Pepsi Black regular cup. Sugar-free refreshment.',
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&h=300&fit=crop&q=80',
    category: 'Beverages'
  },
  {
    id: 'f7',
    name: 'Chilled Cold Coffee',
    price: 160,
    description: 'Creamy cold brewed coffee served chilled. A perfect pick-me-up.',
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300&h=300&fit=crop&q=80',
    category: 'Beverages'
  }
];

