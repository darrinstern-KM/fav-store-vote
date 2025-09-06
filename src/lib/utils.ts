import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMerchandise(codes: string | null | undefined): string {
  if (!codes) return 'General Craft Supplies';
  
  const merchandiseMap: Record<string, string> = {
    'Q': 'Quilt',
    'Y': 'Yarn',
    'N': 'Needlepoint',
    'W': 'Weaving',
    'S': 'Spinning',
    'C': 'Cross-Stitch',
    'HE': 'Hand Embroidery',
    'ME': 'Machine Embroidery',
    'M': 'Machines'
  };
  
  // Split codes by comma and map to full names
  const codeArray = codes.split(',').map(code => code.trim());
  const fullNames = codeArray.map(code => merchandiseMap[code] || code);
  
  return fullNames.join(', ');
}
