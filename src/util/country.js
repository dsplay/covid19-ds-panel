const namesMap = {
  'USA': 'US',
  'Congo': 'Congo (Brazzaville)',
  'S. Korea': 'Korea, South',
  'Taiwan': 'Taiwan*',
  'UK': 'United Kingdom',
};

export const mapName = (name) => namesMap[name] || name;