const IDS = [
  "photo-1489987707025-afc232f7ea0f",
  "photo-1495385794356-15371f348c31",
  "photo-1544022613-e87ca75a784a",
  "photo-1509631179647-0177331693ae",
  "photo-1487222477894-8943e31ef7b2",
  "photo-1490481651871-ab68de25d43d",
  "photo-1571513800374-df1bbe650e56",
  "photo-1445205170230-053b83016050",
  "photo-1591369822096-ffd140ec948f",
  "photo-1616763355603-9755a640a287",
  "photo-1618244972963-dbee1a7edc95",
  "photo-1552902865-b72c031ac5ea",
  "photo-1583743814966-8936f5b7be1a",
  "photo-1506629082955-511b1aa562c8",
];

export function img(index: number, width = 800) {
  const id = IDS[index % IDS.length];
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;
}

export function imgSet(startIndex: number, count: number, width = 800) {
  return Array.from({ length: count }, (_, i) => img(startIndex + i, width));
}

export const IMAGE_COUNT = IDS.length;
