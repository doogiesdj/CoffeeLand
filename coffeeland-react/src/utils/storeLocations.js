// Generate sample store locations for each city and chain
export const generateStoreLocations = (city, chainName) => {
  // Actual store coordinates matching real addresses
  const cityData = {
    'New York': {
      stores: [
        { 
          name: 'Times Square', 
          address: '1585 Broadway, New York, NY 10036', 
          hours: '6:00 AM - 11:00 PM', 
          phone: '(212) 221-7800',
          position: { lat: 40.7580, lng: -73.9855 } // Actual Times Square coordinates
        },
        { 
          name: 'Union Square', 
          address: '33 Union Square West, New York, NY 10003', 
          hours: '6:30 AM - 10:00 PM', 
          phone: '(212) 253-1820',
          position: { lat: 40.7359, lng: -73.9911 } // Actual Union Square coordinates
        },
        { 
          name: 'Columbus Circle', 
          address: '10 Columbus Circle, New York, NY 10019', 
          hours: '7:00 AM - 9:00 PM', 
          phone: '(212) 823-9750',
          position: { lat: 40.7681, lng: -73.9819 } // Actual Columbus Circle coordinates
        },
        { 
          name: 'Wall Street', 
          address: '195 Broadway, New York, NY 10007', 
          hours: '6:00 AM - 8:00 PM', 
          phone: '(212) 571-1760',
          position: { lat: 40.7115, lng: -74.0095 } // Actual Wall Street coordinates
        },
        { 
          name: 'Grand Central', 
          address: '89 E 42nd St, New York, NY 10017', 
          hours: '5:30 AM - 11:00 PM', 
          phone: '(212) 883-2420',
          position: { lat: 40.7527, lng: -73.9772 } // Actual Grand Central coordinates
        }
      ]
    },
    'Los Angeles': {
      stores: [
        { 
          name: 'Hollywood', 
          address: '6801 Hollywood Blvd, Los Angeles, CA 90028', 
          hours: '6:00 AM - 10:00 PM', 
          phone: '(323) 467-8915',
          position: { lat: 34.1016, lng: -118.3406 } // Hollywood Blvd
        },
        { 
          name: 'Downtown', 
          address: '800 W 1st St, Los Angeles, CA 90012', 
          hours: '6:30 AM - 9:00 PM', 
          phone: '(213) 617-3600',
          position: { lat: 34.0562, lng: -118.2566 } // Downtown LA
        },
        { 
          name: 'Santa Monica', 
          address: '1356 3rd St Promenade, Santa Monica, CA 90401', 
          hours: '6:00 AM - 10:00 PM', 
          phone: '(310) 458-0605',
          position: { lat: 34.0149, lng: -118.4966 } // Santa Monica Promenade
        },
        { 
          name: 'Beverly Hills', 
          address: '9420 Wilshire Blvd, Beverly Hills, CA 90212', 
          hours: '6:30 AM - 9:30 PM', 
          phone: '(310) 278-5388',
          position: { lat: 34.0679, lng: -118.3892 } // Wilshire Blvd
        }
      ]
    },
    'Chicago': {
      stores: [
        { 
          name: 'Magnificent Mile', 
          address: '646 N Michigan Ave, Chicago, IL 60611', 
          hours: '6:00 AM - 10:00 PM', 
          phone: '(312) 266-1698',
          position: { lat: 41.8936, lng: -87.6251 } // Michigan Ave
        },
        { 
          name: 'Loop', 
          address: '11 W Jackson Blvd, Chicago, IL 60604', 
          hours: '6:00 AM - 9:00 PM', 
          phone: '(312) 554-0670',
          position: { lat: 41.8779, lng: -87.6298 } // Loop area
        },
        { 
          name: 'Navy Pier', 
          address: '600 E Grand Ave, Chicago, IL 60611', 
          hours: '7:00 AM - 10:00 PM', 
          phone: '(312) 595-5437',
          position: { lat: 41.8919, lng: -87.6051 } // Navy Pier
        },
        { 
          name: 'Wrigleyville', 
          address: '3639 N Clark St, Chicago, IL 60613', 
          hours: '6:30 AM - 9:00 PM', 
          phone: '(773) 525-8038',
          position: { lat: 41.9484, lng: -87.6553 } // Wrigleyville
        }
      ]
    },
    'San Francisco': {
      stores: [
        { 
          name: 'Union Square', 
          address: '1 Stockton St, San Francisco, CA 94108', 
          hours: '6:00 AM - 9:30 PM', 
          phone: '(415) 989-2100',
          position: { lat: 37.7879, lng: -122.4074 } // Union Square
        },
        { 
          name: 'Fisherman\'s Wharf', 
          address: '2665 Taylor St, San Francisco, CA 94133', 
          hours: '6:30 AM - 10:00 PM', 
          phone: '(415) 775-5200',
          position: { lat: 37.8049, lng: -122.4183 } // Fisherman's Wharf
        },
        { 
          name: 'Financial District', 
          address: '1 Market St, San Francisco, CA 94105', 
          hours: '6:00 AM - 8:00 PM', 
          phone: '(415) 495-0322',
          position: { lat: 37.7938, lng: -122.3965 } // Financial District
        }
      ]
    },
    'Seattle': {
      stores: [
        { 
          name: 'Pike Place', 
          address: '1912 Pike Pl, Seattle, WA 98101', 
          hours: '6:00 AM - 9:00 PM', 
          phone: '(206) 448-8762',
          position: { lat: 47.6097, lng: -122.3421 } // Pike Place Market
        },
        { 
          name: 'Capitol Hill', 
          address: '434 Broadway E, Seattle, WA 98102', 
          hours: '5:30 AM - 10:00 PM', 
          phone: '(206) 329-1553',
          position: { lat: 47.6233, lng: -122.3210 } // Capitol Hill
        },
        { 
          name: 'University District', 
          address: '4101 University Way NE, Seattle, WA 98105', 
          hours: '6:00 AM - 9:30 PM', 
          phone: '(206) 632-2003',
          position: { lat: 47.6588, lng: -122.3126 } // U-District
        }
      ]
    },
    'Seoul': {
      stores: [
        { 
          name: 'Gangnam', 
          address: '429 Gangnam-daero, Seocho-gu, Seoul', 
          hours: '7:00 AM - 11:00 PM', 
          phone: '+82-2-3444-5500',
          position: { lat: 37.4979, lng: 127.0276 } // Gangnam Station area
        },
        { 
          name: 'Myeongdong', 
          address: '52 Myeongdong-gil, Jung-gu, Seoul', 
          hours: '7:00 AM - 10:00 PM', 
          phone: '+82-2-318-8500',
          position: { lat: 37.5636, lng: 126.9850 } // Myeongdong shopping area
        },
        { 
          name: 'Hongdae', 
          address: '188 Yanghwa-ro, Mapo-gu, Seoul', 
          hours: '7:00 AM - 12:00 AM', 
          phone: '+82-2-336-7800',
          position: { lat: 37.5563, lng: 126.9233 } // Hongdae area
        },
        { 
          name: 'Itaewon', 
          address: '119 Itaewon-ro, Yongsan-gu, Seoul', 
          hours: '7:00 AM - 11:00 PM', 
          phone: '+82-2-795-8900',
          position: { lat: 37.5347, lng: 126.9943 } // Itaewon
        }
      ]
    },
    'London': {
      stores: [
        { 
          name: 'Piccadilly Circus', 
          address: '1 Piccadilly Circus, London W1J 0DA', 
          hours: '7:00 AM - 10:00 PM', 
          phone: '+44 20 7734 5200',
          position: { lat: 51.5101, lng: -0.1340 } // Piccadilly Circus
        },
        { 
          name: 'Oxford Street', 
          address: '350 Oxford St, London W1C 1BY', 
          hours: '6:30 AM - 9:00 PM', 
          phone: '+44 20 7493 2300',
          position: { lat: 51.5155, lng: -0.1410 } // Oxford Street
        },
        { 
          name: 'Covent Garden', 
          address: '35 Southampton St, London WC2E 7HG', 
          hours: '7:00 AM - 9:00 PM', 
          phone: '+44 20 7836 4400',
          position: { lat: 51.5118, lng: -0.1226 } // Covent Garden
        }
      ]
    },
    'Tokyo': {
      stores: [
        { 
          name: 'Shibuya', 
          address: '1-2-1 Dogenzaka, Shibuya-ku, Tokyo', 
          hours: '7:00 AM - 11:00 PM', 
          phone: '+81-3-3463-0950',
          position: { lat: 35.6595, lng: 139.7004 } // Shibuya Crossing
        },
        { 
          name: 'Shinjuku', 
          address: '3-38-1 Shinjuku, Shinjuku-ku, Tokyo', 
          hours: '7:00 AM - 10:00 PM', 
          phone: '+81-3-5367-8150',
          position: { lat: 35.6938, lng: 139.7036 } // Shinjuku Station area
        },
        { 
          name: 'Ginza', 
          address: '5-2-1 Ginza, Chuo-ku, Tokyo', 
          hours: '7:00 AM - 9:00 PM', 
          phone: '+81-3-3572-8900',
          position: { lat: 35.6717, lng: 139.7644 } // Ginza shopping district
        }
      ]
    }
  };

  const defaultData = {
    stores: [
      { 
        name: 'Downtown', 
        address: 'Main Street', 
        hours: '7:00 AM - 9:00 PM', 
        phone: 'N/A',
        position: { lat: 40.7128, lng: -74.0060 }
      },
      { 
        name: 'Shopping District', 
        address: 'Commercial Ave', 
        hours: '7:00 AM - 10:00 PM', 
        phone: 'N/A',
        position: { lat: 40.7228, lng: -74.0160 }
      },
      { 
        name: 'Business Center', 
        address: 'Office Plaza', 
        hours: '6:30 AM - 8:00 PM', 
        phone: 'N/A',
        position: { lat: 40.7028, lng: -73.9960 }
      }
    ]
  };

  const data = cityData[city] || defaultData;
  
  return data.stores.map((store) => ({
    name: `${chainName} - ${store.name}`,
    address: store.address,
    hours: store.hours,
    phone: store.phone,
    position: store.position
  }));
};
