export const SCHOOL_MAPPING: Record<string, string> = {
  'exscl-01': 'LFG Digi High School',
  'exscl-02': 'Sreyas the School',
  'exscl-03': 'Vashistha Model school, bollaram',
  'exscl-04': 'Jeevan Jyothi School',
  'exscl-05': 'Sangamithra School, Dammaiguda',
  'exscl-06': 'Sri Vaagdevi School (main branch)',
  'exscl-07': 'Glorious School',
  'exscl-08': 'Sree Gouthami High School',
  'exscl-09': 'KVR High School',
  'exscl-10': 'Vashistha School, chitkul',
  'exscl-11': 'vashistha School,Rampally',
  'exscl-12': 'Geethanjali,Isnapur',
  'exscl-13': 'Sri Vaagdevi School -2',
  'exscl-14': 'Vashistha School,Indresham',
  'exscl-15': 'Vashistha School',
  'exscl-16': 'Excellence School 16',
  'exscl-17': 'Excellence School 17',
  'exscl-18': 'Excellence School 18',
};

export const getSchoolName = (code: string): string => {
  return SCHOOL_MAPPING[code] || code;
};
