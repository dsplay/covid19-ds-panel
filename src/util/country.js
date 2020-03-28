const namesMap = {
  'USA': 'US',
  'Congo': 'Congo (Brazzaville)',
  'S. Korea': 'Korea, South',
  'Taiwan': 'Taiwan*',
  'United Kingdom': 'UK',
};

export const mapName = (name) => namesMap[name] || name;