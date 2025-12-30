// Generate sample store locations for each city and chain
export const generateStoreLocations = (city, chainName) => {
  // City coordinates with slight variations for different stores
  const cityData = {
    'New York': {
      center: { lat: 40.7128, lng: -74.0060 },
      stores: [
        { offset: { lat: 0.010, lng: 0.005 }, name: 'Times Square', address: '1585 Broadway, New York, NY 10036', hours: '6:00 AM - 11:00 PM', phone: '(212) 221-7800' },
        { offset: { lat: -0.008, lng: 0.012 }, name: 'Union Square', address: '33 Union Square West, New York, NY 10003', hours: '6:30 AM - 10:00 PM', phone: '(212) 253-1820' },
        { offset: { lat: 0.015, lng: -0.010 }, name: 'Columbus Circle', address: '10 Columbus Circle, New York, NY 10019', hours: '7:00 AM - 9:00 PM', phone: '(212) 823-9750' },
        { offset: { lat: -0.012, lng: -0.008 }, name: 'Wall Street', address: '195 Broadway, New York, NY 10007', hours: '6:00 AM - 8:00 PM', phone: '(212) 571-1760' },
        { offset: { lat: 0.005, lng: 0.015 }, name: 'Grand Central', address: '89 E 42nd St, New York, NY 10017', hours: '5:30 AM - 11:00 PM', phone: '(212) 883-2420' }
      ]
    },
    'Los Angeles': {
      center: { lat: 34.0522, lng: -118.2437 },
      stores: [
        { offset: { lat: 0.008, lng: 0.010 }, name: 'Hollywood', address: '6801 Hollywood Blvd, Los Angeles, CA 90028', hours: '6:00 AM - 10:00 PM', phone: '(323) 467-8915' },
        { offset: { lat: -0.010, lng: 0.008 }, name: 'Downtown', address: '800 W 1st St, Los Angeles, CA 90012', hours: '6:30 AM - 9:00 PM', phone: '(213) 617-3600' },
        { offset: { lat: 0.012, lng: -0.012 }, name: 'Santa Monica', address: '1356 3rd St Promenade, Santa Monica, CA 90401', hours: '6:00 AM - 10:00 PM', phone: '(310) 458-0605' },
        { offset: { lat: -0.006, lng: -0.015 }, name: 'Beverly Hills', address: '9420 Wilshire Blvd, Beverly Hills, CA 90212', hours: '6:30 AM - 9:30 PM', phone: '(310) 278-5388' }
      ]
    },
    'Chicago': {
      center: { lat: 41.8781, lng: -87.6298 },
      stores: [
        { offset: { lat: 0.008, lng: 0.006 }, name: 'Magnificent Mile', address: '646 N Michigan Ave, Chicago, IL 60611', hours: '6:00 AM - 10:00 PM', phone: '(312) 266-1698' },
        { offset: { lat: -0.010, lng: 0.008 }, name: 'Loop', address: '11 W Jackson Blvd, Chicago, IL 60604', hours: '6:00 AM - 9:00 PM', phone: '(312) 554-0670' },
        { offset: { lat: 0.012, lng: -0.010 }, name: 'Navy Pier', address: '600 E Grand Ave, Chicago, IL 60611', hours: '7:00 AM - 10:00 PM', phone: '(312) 595-5437' },
        { offset: { lat: -0.008, lng: -0.012 }, name: 'Wrigleyville', address: '3639 N Clark St, Chicago, IL 60613', hours: '6:30 AM - 9:00 PM', phone: '(773) 525-8038' }
      ]
    },
    'San Francisco': {
      center: { lat: 37.7749, lng: -122.4194 },
      stores: [
        { offset: { lat: 0.010, lng: 0.008 }, name: 'Union Square', address: '1 Stockton St, San Francisco, CA 94108', hours: '6:00 AM - 9:30 PM', phone: '(415) 989-2100' },
        { offset: { lat: -0.008, lng: 0.010 }, name: 'Fisherman\'s Wharf', address: '2665 Taylor St, San Francisco, CA 94133', hours: '6:30 AM - 10:00 PM', phone: '(415) 775-5200' },
        { offset: { lat: 0.012, lng: -0.012 }, name: 'Financial District', address: '1 Market St, San Francisco, CA 94105', hours: '6:00 AM - 8:00 PM', phone: '(415) 495-0322' }
      ]
    },
    'Seattle': {
      center: { lat: 47.6062, lng: -122.3321 },
      stores: [
        { offset: { lat: 0.008, lng: 0.006 }, name: 'Pike Place', address: '1912 Pike Pl, Seattle, WA 98101', hours: '6:00 AM - 9:00 PM', phone: '(206) 448-8762' },
        { offset: { lat: -0.010, lng: 0.012 }, name: 'Capitol Hill', address: '434 Broadway E, Seattle, WA 98102', hours: '5:30 AM - 10:00 PM', phone: '(206) 329-1553' },
        { offset: { lat: 0.012, lng: -0.010 }, name: 'University District', address: '4101 University Way NE, Seattle, WA 98105', hours: '6:00 AM - 9:30 PM', phone: '(206) 632-2003' }
      ]
    },
    'Seoul': {
      center: { lat: 37.5665, lng: 126.9780 },
      stores: [
        { offset: { lat: 0.008, lng: 0.010 }, name: 'Gangnam', address: '429 Gangnam-daero, Seocho-gu, Seoul', hours: '7:00 AM - 11:00 PM', phone: '+82-2-3444-5500' },
        { offset: { lat: -0.010, lng: 0.008 }, name: 'Myeongdong', address: '52 Myeongdong-gil, Jung-gu, Seoul', hours: '7:00 AM - 10:00 PM', phone: '+82-2-318-8500' },
        { offset: { lat: 0.012, lng: -0.012 }, name: 'Hongdae', address: '188 Yanghwa-ro, Mapo-gu, Seoul', hours: '7:00 AM - 12:00 AM', phone: '+82-2-336-7800' },
        { offset: { lat: -0.008, lng: -0.010 }, name: 'Itaewon', address: '119 Itaewon-ro, Yongsan-gu, Seoul', hours: '7:00 AM - 11:00 PM', phone: '+82-2-795-8900' }
      ]
    },
    'London': {
      center: { lat: 51.5074, lng: -0.1278 },
      stores: [
        { offset: { lat: 0.008, lng: 0.010 }, name: 'Piccadilly Circus', address: '1 Piccadilly Circus, London W1J 0DA', hours: '7:00 AM - 10:00 PM', phone: '+44 20 7734 5200' },
        { offset: { lat: -0.010, lng: 0.012 }, name: 'Oxford Street', address: '350 Oxford St, London W1C 1BY', hours: '6:30 AM - 9:00 PM', phone: '+44 20 7493 2300' },
        { offset: { lat: 0.012, lng: -0.010 }, name: 'Covent Garden', address: '35 Southampton St, London WC2E 7HG', hours: '7:00 AM - 9:00 PM', phone: '+44 20 7836 4400' }
      ]
    },
    'Tokyo': {
      center: { lat: 35.6762, lng: 139.6503 },
      stores: [
        { offset: { lat: 0.010, lng: 0.008 }, name: 'Shibuya', address: '1-2-1 Dogenzaka, Shibuya-ku, Tokyo', hours: '7:00 AM - 11:00 PM', phone: '+81-3-3463-0950' },
        { offset: { lat: -0.012, lng: 0.010 }, name: 'Shinjuku', address: '3-38-1 Shinjuku, Shinjuku-ku, Tokyo', hours: '7:00 AM - 10:00 PM', phone: '+81-3-5367-8150' },
        { offset: { lat: 0.008, lng: -0.012 }, name: 'Ginza', address: '5-2-1 Ginza, Chuo-ku, Tokyo', hours: '7:00 AM - 9:00 PM', phone: '+81-3-3572-8900' }
      ]
    }
  };

  const defaultData = {
    center: { lat: 40.7128, lng: -74.0060 },
    stores: [
      { offset: { lat: 0.010, lng: 0.008 }, name: 'Downtown', address: 'Main Street', hours: '7:00 AM - 9:00 PM', phone: 'N/A' },
      { offset: { lat: -0.008, lng: 0.012 }, name: 'Shopping District', address: 'Commercial Ave', hours: '7:00 AM - 10:00 PM', phone: 'N/A' },
      { offset: { lat: 0.012, lng: -0.010 }, name: 'Business Center', address: 'Office Plaza', hours: '6:30 AM - 8:00 PM', phone: 'N/A' }
    ]
  };

  const data = cityData[city] || defaultData;
  
  return data.stores.map((store, index) => ({
    name: `${chainName} - ${store.name}`,
    address: store.address,
    hours: store.hours,
    phone: store.phone,
    position: {
      lat: data.center.lat + store.offset.lat,
      lng: data.center.lng + store.offset.lng
    }
  }));
};
