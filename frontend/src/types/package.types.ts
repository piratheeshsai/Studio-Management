
export interface PackageItem {
  id?: string;
  name: string;
  type: 'PRODUCT' | 'SERVICE';
  defDimensions?: string;
  defPages?: number;
  defQuantity?: number;
  description?: string;
  isOptional: boolean;
  extraPrice?: number;
}

export interface Package {
  id: string;
  name: string;
  category: string; // 'WEDDING' | 'BIRTHDAY' | 'CORPORATE' | 'OTHER'
  basePrice: number;
  description?: string;
  items: PackageItem[];
  createdAt: string;
  updatedAt: string;
}
