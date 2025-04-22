//here types are saved

//Search mobile types
export type FormValues = {
  search: string;
};

export type Variation = {
  id: number;
  color: string;
  size: string;
  price: string;
  product_id: number;
  created_at: string;
  updated_at: string;
};

export type Batch = {
  id: number;
  batch_number: string;
  manufacturing_date: string;
  expiration_date: string;
  quantity_in_batch: number;
  product_id: number;
  created_at: string;
  updated_at: string;
};

//Product Models
export type Product = {
  subProducts: [];
  id: number;
  product_id: number;
  store_id: number;
  quantity: number;
  reviews: [];
  slug: string;
  unit: { symbol: string };
  average_rating: string;
  media: [];
  name: string;
  qty_in_stock: string;
  weight: string;
  SKU: string;
  reviews_count: string;
  description: string;
  thumbnail: { file_path: string };
  gallery: { gallery: string };
  price: number;
  created_at: string;
  updated_at: string;
  product_store: { quantity: number };
  category: { name: string; id: number };
  base_selling_price: number;
  base_buying_price: number;
  variations: [];
  batches: [];
  product: {
    id: number;
    category_id: number;
    brand_id: number;
    average_rating: number;
    reviews_count: number;
    unit_id: number;
    name: string;
    weight: string;
    max_delivarable_qty: number;
    min_delivarable_qty: number;
    batches: [];
    slug: string;
    description: string;
    details: string | null;
    youtube_link: string | null;
    SKU: string;
    code: string | null;
    min_deliverable_qty: number;
    max_deliverable_qty: number | null;
    discout_type: string | null;
    discount: number | undefined;
    status: number;
    created_at: string;
    updated_at: string;
    gallery: {
      id: number;
      file_path: string | null;
      gallery: string | null;
    };
    category: {
      id: number;
      parent_id: number | null;
      name: string;
      slug: string;
      description: string;
      created_at: string;
      updated_at: string;
    };
    media: Array<{
      id: number;
      file_path: string | null;
      gallery: string | null;
    }>;
    thumbnail: {
      id: number;
      file_path: string;
      gallery: string | null;
    };
    unit: {
      id: number;
      name: string;
      symbol: string;
      active: number;
      created_at: string;
      updated_at: string;
    };
  };
  store: {
    id: number;
    parent_id: number | null;
    name: string;
    slug: string;
    location: string;
    created_at: string;
    updated_at: string;
  };
};

export type Detail = {
  name: string;
  value: string;
};

export type Page = {
  id: string;
  name: string;
  link: string;
  subPage: SubPage[];
  createdAt: Date;
};

export type SubPage = {
  id: string;
  name: string;
  link: string;
  slug: string;
  parent: string;
  createdAt: Date;
};

export type Question = {
  name: string;
  value: string;
};

export type Review = {
  id?: string;
  user?: User;
  rating: number;
  comment: string;
  product: Product;
  created_at: Date;
  updated_at?: Date;
};

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  image: string;
  password: string;
  role: string;
  createdAt?: Date;
  address: Address[];
  phone: string;
  date_of_birth: string;
  address_line1: string;
  address_line2: string;
  city: string;
  region: string;
  zone: string;
  woreda: string;
  kebele: string;
  location: string;
  country: string;
  // TODO:Complete user
};

export type SubProduct = {
  sku: string;
  style: Style;
  options: Option[];
};

export type Style = {
  name: string;
  color: string;
  image: string;
};

export type Option = {
  qty: number;
  price: number;
  sold: number;
  option: string;
  images: string[];
  discount: number;
};

export type Category = {
  id: string;
  parent_id: number;
  name: string;
  link: string;
  slug: string;
  image: string;
  createdAt?: Date;
  children?: SubCategory[];
  products: [];
  thumbnail: { file_path: string };
};

export type SubCategory = {
  id: string;
  name: string;
  link: string;
  slug: string;
  parent?: string;
  createdAt?: Date;
  thumbnail: { file_path: string };
};

export type Brand = {
  id: string;
  name: string;
  link: string;
  slug: string;
  image: string;
  createdAt?: Date;
  logo: { file_path: string };
};

export type CartItem = {
  product: { product: { price: string } };
  quantity: number;
  name: string;
  description: string;
  optionBefore: number;
  option: string;
  slug: string;
  sku: string;
  shipping: string;
  images: string[];
  style: Style;
  price: number;
  priceBefore: number;
  qty: number;
  stock: number;
  brand: string;
  likes: string[];
  id: string;
  thumbnail: { file_path: string };
  product_store: {
    product: {
      name: string;
      thumbnail: { file_path: string };
      description: string;
      slug: string;
    };
  };
};

export type Order = {
  id: string;
  user: User;
  items: [];
  subtotal: number;
  discount_amount: number;
  total_amount: number;
  products: ProductOrder[];
  order_number: string;
  payment_method: {
    name: string;
    provider: string;
    status: string;
    type: string;
  };
  total: number;
  shipping_price: number;
  taxPrice: number;
  isPaid: boolean;
  status: string;
  totalBeforeDiscount: number;
  couponApplied: Coupon;
  shippingStatus: string;
  shippingAddress: Address;
  paymentResult: string;
  shippingTimes: string;
  shipping: Address;
  created_at: string;
};

export type ProductOrder = {
  id: string;
  product: string;
  name: string;
  images: string;
  option: string;
  qty: number;
  style: Style;
  price: number;
  quantity: number;
  total_amount: number;
  discount_amount: number;
  product_store: {
    product: {
      thumbnail: { file_path: string };
      name: string;
      slug: string;
    };
  };
};
export type Coupon = {
  id: string;
  coupon: string;
  startDate: Date;
  endDate: Date;
  discount: number;
};
export type Address = {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  zipCode: string;
  address: string;
  phoneNumber: string;
  state: string;
};

export type Slide = {
  thumbnail: { file_path: string };
  id: string;
  name: string;
  link: string;
  btn: string;
  title: string;
  description: string;
  subtitle: string;
  slug: string;
  image: string;
  textColor: string;
  createdAt?: Date;
  banner: { file_path: string };
};

export type Cart = {
  id: number;
  user: User;
  items: CartItem[];
  length: number;
  discount_amount: number;
  total: number;
  subtotal: number;
};

export type Delivery = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  times: string;
  price: number;
};

export type Payment = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  slug: string;
  name: string;
  status: string;
  provider: string;
  type: string;
  logo: { file_path: string };
};

export type sendEmailTypes = {
  subject: string;
  email: string;
  message: string;
};
