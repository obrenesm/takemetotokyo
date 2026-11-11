// The facts behind the timeline page (/journey): what kind of activity, and when.
// Every text (titles, roles, summaries…) lives in translations.js under timeline.items.<id>.
//
// Dates are 'YYYY-MM', or just 'YYYY' when only the year is known. An item without `end`
// is a single moment (a course, a certificate). `path` lists when each role in
// timeline.items.<id>.path started, in the same order. `minor` items get a compact row.
// `map` shows a route map (components/timeline/RouteMap.js), labeled by timeline.items.<id>.map.

// The order of the filters and of the lanes in the overview chart
export const CATEGORIES = ['work', 'volunteering', 'studies', 'cycling']

export const timelineItems = [
  { id: 'japanRide', category: 'cycling', start: '2026-05', end: '2026-06', map: 'japanRide' },
  { id: 'arc', category: 'studies', start: '2024-10', end: '2026-03' },
  { id: 'buzz', category: 'work', start: '2023-08', end: '2026-02', path: ['2023-08', '2023-11'] },
  { id: 'udacity', category: 'studies', start: '2017', minor: true },
  { id: 'criticalMass', category: 'work', start: '2016-02', end: '2023-07', path: ['2016-02', '2019', '2021'] },
  // Before TEC: its text says it was studied "while running Clean Cycling"
  { id: 'cleanCycling', category: 'volunteering', start: '2015', end: '2017' },
  { id: 'tec', category: 'studies', start: '2015-01', end: '2015-12' },
  { id: 'la404', category: 'studies', start: '2015', minor: true },
  { id: 'losSantos', category: 'volunteering', start: '2013', end: '2014' },
  { id: 'uci', category: 'studies', start: '2012-11', minor: true },
  { id: 'creativa', category: 'studies', start: '2011-01', end: '2015-07' },
  { id: 'freelance', category: 'work', start: '2011', end: '2015' },
  { id: 'acica', category: 'cycling', start: '2010', end: '2012' },
  { id: 'mtbAssociation', category: 'volunteering', start: '2010', end: '2012' },
  { id: 'covao', category: 'studies', start: '2008-01', end: '2010-12' },
  { id: 'cartago', category: 'cycling', start: '2005', end: '2009' },
  { id: 'firstBike', category: 'cycling', start: '2000' },
]
