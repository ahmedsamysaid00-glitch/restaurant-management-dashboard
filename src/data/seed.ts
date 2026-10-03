import type {
  Category,
  Customer,
  Order,
  OrderStatus,
  Product,
  User,
  CafeSettings,
  FulfillmentMethod,
} from '@/types';

export const seedCategories: Category[] = [
  { id: 'cat-hot-coffee', name: 'Hot Coffee', description: 'Rich, aromatic espresso-based drinks' },
  { id: 'cat-iced-coffee', name: 'Iced Coffee', description: 'Chilled and refreshing coffee beverages' },
  { id: 'cat-tea', name: 'Tea', description: 'Premium loose-leaf teas and infusions' },
  { id: 'cat-pastries', name: 'Pastries', description: 'Freshly baked daily treats' },
  { id: 'cat-desserts', name: 'Desserts', description: 'Decadent sweet indulgences' },
];

export const seedProducts: Product[] = [
  {
    id: 'prod-espresso',
    name: 'Espresso',
    description: 'A bold, concentrated shot of pure coffee',
    longDescription: 'Our signature espresso is crafted from a blend of Arabica beans sourced from the highlands of Ethiopia and Colombia. Pulled with precision for a rich crema and intense flavor profile with notes of dark chocolate and toasted nuts.',
    price: 45,
    categoryId: 'cat-hot-coffee',
    image: 'https://images.pexels.com/photos/33856911/pexels-photo-33856911.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    available: true,
    popularity: 85,
    hasSizes: false,
  },
  {
    id: 'prod-americano',
    name: 'Americano',
    description: 'Espresso diluted with hot water for a smooth cup',
    longDescription: 'A classic Americano combines our signature espresso with hot water, creating a smooth, full-bodied coffee with a clean finish. Perfect for those who enjoy a longer, less intense coffee experience.',
    price: 50,
    categoryId: 'cat-hot-coffee',
    image: 'https://images.pexels.com/photos/5665246/pexels-photo-5665246.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    available: true,
    popularity: 72,
    hasSizes: true,
  },
  {
    id: 'prod-cappuccino',
    name: 'Cappuccino',
    description: 'Espresso with steamed milk and velvety foam',
    longDescription: 'The timeless Italian classic. Equal parts espresso, steamed milk, and microfoam, topped with intricate latte art. A harmonious balance of strong coffee and creamy texture.',
    price: 65,
    categoryId: 'cat-hot-coffee',
    image: 'https://images.pexels.com/photos/28496565/pexels-photo-28496565.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    available: true,
    popularity: 95,
    hasSizes: true,
  },
  {
    id: 'prod-flat-white',
    name: 'Flat White',
    description: 'Double ristretto with silky microfoam',
    longDescription: 'A specialty coffee favorite featuring a double shot of ristretto topped with thin, velvety steamed milk microfoam. Smaller and stronger than a latte, with a smooth, integrated flavor.',
    price: 70,
    categoryId: 'cat-hot-coffee',
    image: 'https://images.pexels.com/photos/36851643/pexels-photo-36851643.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    available: true,
    popularity: 80,
    hasSizes: true,
  },
  {
    id: 'prod-spanish-latte',
    name: 'Spanish Latte',
    description: 'Espresso with condensed milk for a sweet twist',
    longDescription: 'A creamy, sweet latte made with condensed milk for a rich, dessert-like coffee experience. The condensed milk adds a luxurious sweetness that balances beautifully with the espresso.',
    price: 75,
    categoryId: 'cat-hot-coffee',
    image: 'https://images.pexels.com/photos/19154599/pexels-photo-19154599.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    available: true,
    popularity: 88,
    hasSizes: true,
  },
  {
    id: 'prod-caramel-latte',
    name: 'Caramel Latte',
    description: 'Latte with house-made caramel syrup',
    longDescription: 'Our caramel latte features smooth espresso, steamed milk, and our house-made caramel syrup, topped with a drizzle of caramel. A perfect balance of coffee and sweet caramel flavors.',
    price: 80,
    categoryId: 'cat-hot-coffee',
    image: 'https://images.pexels.com/photos/20854091/pexels-photo-20854091.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    available: true,
    popularity: 90,
    hasSizes: true,
  },
  {
    id: 'prod-mocha',
    name: 'Mocha',
    description: 'Espresso with chocolate and steamed milk',
    longDescription: 'A decadent combination of espresso, steamed milk, and rich chocolate, topped with whipped cream and a dusting of cocoa. The perfect treat for chocolate and coffee lovers alike.',
    price: 85,
    categoryId: 'cat-hot-coffee',
    image: 'https://images.pexels.com/photos/17558646/pexels-photo-17558646.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    available: true,
    popularity: 82,
    hasSizes: true,
  },
  {
    id: 'prod-turkish-coffee',
    name: 'Turkish Coffee',
    description: 'Traditional finely ground coffee brewed in a cezve',
    longDescription: 'Authentic Turkish coffee prepared in a traditional copper cezve. Finely ground coffee is simmered to create a strong, unfiltered brew with a thick foam. Served with a piece of Turkish delight.',
    price: 55,
    categoryId: 'cat-hot-coffee',
    image: 'https://images.pexels.com/photos/29764355/pexels-photo-29764355.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    available: true,
    popularity: 70,
    hasSizes: false,
  },
  {
    id: 'prod-iced-americano',
    name: 'Iced Americano',
    description: 'Chilled espresso over ice with cold water',
    longDescription: 'A refreshing iced coffee made by pouring espresso over ice and cold water. Clean, crisp, and invigorating — the perfect pick-me-up for warm days.',
    price: 55,
    categoryId: 'cat-iced-coffee',
    image: 'https://images.pexels.com/photos/38028984/pexels-photo-38028984.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    available: true,
    popularity: 78,
    hasSizes: true,
  },
  {
    id: 'prod-iced-spanish-latte',
    name: 'Iced Spanish Latte',
    description: 'Cold espresso with condensed milk over ice',
    longDescription: 'Our popular Spanish latte served over ice. The condensed milk blends with cold espresso for a sweet, creamy, and refreshing coffee experience. A customer favorite year-round.',
    price: 80,
    categoryId: 'cat-iced-coffee',
    image: 'https://images.pexels.com/photos/18635176/pexels-photo-18635176.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    available: true,
    popularity: 92,
    hasSizes: true,
  },
  {
    id: 'prod-iced-mocha',
    name: 'Iced Mocha',
    description: 'Espresso, chocolate, and milk over ice',
    longDescription: 'A chilled version of our classic mocha. Espresso, chocolate syrup, and cold milk poured over ice, finished with whipped cream and a chocolate drizzle. Rich and refreshing.',
    price: 90,
    categoryId: 'cat-iced-coffee',
    image: 'https://images.pexels.com/photos/17558645/pexels-photo-17558645.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    available: true,
    popularity: 75,
    hasSizes: true,
  },
  {
    id: 'prod-matcha-latte',
    name: 'Matcha Latte',
    description: 'Premium matcha whisked with steamed milk',
    longDescription: 'Ceremonial-grade matcha from Uji, Japan, whisked with steamed milk for a smooth, earthy, and naturally sweet beverage. A beautiful, vibrant green latte rich in antioxidants.',
    price: 85,
    categoryId: 'cat-iced-coffee',
    image: 'https://images.pexels.com/photos/14704657/pexels-photo-14704657.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    available: true,
    popularity: 68,
    hasSizes: true,
  },
  {
    id: 'prod-english-breakfast-tea',
    name: 'English Breakfast Tea',
    description: 'Full-bodied black tea blend',
    longDescription: 'A robust, full-bodied blend of Assam, Ceylon, and Kenyan black teas. Served with milk and sugar on the side. The perfect traditional English tea experience.',
    price: 40,
    categoryId: 'cat-tea',
    image: 'https://images.pexels.com/photos/6195509/pexels-photo-6195509.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    available: true,
    popularity: 60,
    hasSizes: false,
  },
  {
    id: 'prod-butter-croissant',
    name: 'Butter Croissant',
    description: 'Flaky, buttery French-style croissant',
    longDescription: 'A classic French-style croissant made with European butter, hand-laminated and baked fresh every morning. Golden, flaky, and irresistibly buttery.',
    price: 35,
    categoryId: 'cat-pastries',
    image: 'https://images.pexels.com/photos/7333002/pexels-photo-7333002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    available: true,
    popularity: 85,
    hasSizes: false,
  },
  {
    id: 'prod-chocolate-croissant',
    name: 'Chocolate Croissant',
    description: 'Croissant filled with rich dark chocolate',
    longDescription: 'A pain au chocolat featuring the same flaky, buttery dough as our croissant, filled with two sticks of premium dark chocolate. Baked fresh daily until golden.',
    price: 45,
    categoryId: 'cat-pastries',
    image: 'https://images.pexels.com/photos/13439698/pexels-photo-13439698.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    available: true,
    popularity: 82,
    hasSizes: false,
  },
  {
    id: 'prod-blueberry-muffin',
    name: 'Blueberry Muffin',
    description: 'Moist muffin with fresh blueberries',
    longDescription: 'A soft, moist muffin loaded with fresh blueberries and a hint of lemon zest. Topped with a crunchy sugar crust. Baked fresh every morning.',
    price: 40,
    categoryId: 'cat-pastries',
    image: 'https://images.pexels.com/photos/8017963/pexels-photo-8017963.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    available: true,
    popularity: 65,
    hasSizes: false,
  },
  {
    id: 'prod-chocolate-brownie',
    name: 'Chocolate Brownie',
    description: 'Fudgy, rich chocolate brownie',
    longDescription: 'A dense, fudgy brownie made with 70% dark chocolate and a pinch of sea salt. Gooey center with a crackly top. A chocolate lovers dream.',
    price: 50,
    categoryId: 'cat-desserts',
    image: 'https://images.pexels.com/photos/38028993/pexels-photo-38028993.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    available: true,
    popularity: 88,
    hasSizes: false,
  },
  {
    id: 'prod-new-york-cheesecake',
    name: 'New York Cheesecake',
    description: 'Classic creamy cheesecake on a graham crust',
    longDescription: 'A rich, creamy New York-style cheesecake on a buttery graham cracker crust. Dense, smooth, and perfectly balanced with a hint of vanilla and lemon.',
    price: 75,
    categoryId: 'cat-desserts',
    image: 'https://images.pexels.com/photos/24206900/pexels-photo-24206900.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    available: true,
    popularity: 90,
    hasSizes: false,
  },
  {
    id: 'prod-cinnamon-roll',
    name: 'Cinnamon Roll',
    description: 'Swirled pastry with cinnamon and cream cheese glaze',
    longDescription: 'A soft, pillowy cinnamon roll swirled with butter, brown sugar, and cinnamon, topped with a cream cheese glaze. Served warm. The ultimate comfort pastry.',
    price: 45,
    categoryId: 'cat-pastries',
    image: 'https://images.pexels.com/photos/27244307/pexels-photo-27244307.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    available: false,
    popularity: 70,
    hasSizes: false,
  },
  {
    id: 'prod-tiramisu',
    name: 'Tiramisu',
    description: 'Italian dessert with coffee-soaked ladyfingers',
    longDescription: 'An authentic Italian tiramisu made with espresso-soaked ladyfingers layered with mascarpone cream and dusted with cocoa powder. Light, airy, and deeply coffee-flavored.',
    price: 85,
    categoryId: 'cat-desserts',
    image: 'https://images.pexels.com/photos/17558644/pexels-photo-17558644.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    available: true,
    popularity: 92,
    hasSizes: false,
  },
];

export const seedUsers: User[] = [
  {
    id: 'user-admin',
    name: 'Admin User',
    email: 'admin@brewhouse.demo',
    password: 'Admin123!',
    role: 'admin',
    phone: '+20 100 000 0000',
    createdAt: '2025-01-01T08:00:00Z',
  },
  {
    id: 'user-customer',
    name: 'Sarah Mahmoud',
    email: 'customer@brewhouse.demo',
    password: 'Customer123!',
    role: 'customer',
    phone: '+20 100 123 4567',
    createdAt: '2025-01-01T08:00:00Z',
  },
];

export const seedCustomers: Customer[] = [
  { id: 'cust-1', name: 'Sarah Mahmoud', email: 'customer@brewhouse.demo', phone: '+20 100 123 4567', totalOrders: 3, totalSpending: 540, createdAt: '2025-09-15T10:30:00Z' },
  { id: 'cust-2', name: 'Ahmed Hassan', email: 'ahmed.hassan@email.com', phone: '+20 101 234 5678', totalOrders: 5, totalSpending: 890, createdAt: '2025-08-20T14:00:00Z' },
  { id: 'cust-3', name: 'Yasmin El-Sayed', email: 'yasmin.elsayed@email.com', phone: '+20 102 345 6789', totalOrders: 2, totalSpending: 320, createdAt: '2025-09-01T09:15:00Z' },
  { id: 'cust-4', name: 'Omar Farouk', email: 'omar.farouk@email.com', phone: '+20 103 456 7890', totalOrders: 7, totalSpending: 1250, createdAt: '2025-07-10T16:45:00Z' },
  { id: 'cust-5', name: 'Layla Ibrahim', email: 'layla.ibrahim@email.com', phone: '+20 104 567 8901', totalOrders: 1, totalSpending: 165, createdAt: '2025-09-25T11:20:00Z' },
  { id: 'cust-6', name: 'Khaled Mostafa', email: 'khaled.mostafa@email.com', phone: '+20 105 678 9012', totalOrders: 4, totalSpending: 680, createdAt: '2025-08-05T13:30:00Z' },
  { id: 'cust-7', name: 'Nour Abdel-Rahman', email: 'nour.abdelrahman@email.com', phone: '+20 106 789 0123', totalOrders: 6, totalSpending: 1020, createdAt: '2025-07-25T08:00:00Z' },
  { id: 'cust-8', name: 'Mariam Adel', email: 'mariam.adel@email.com', phone: '+20 107 890 1234', totalOrders: 2, totalSpending: 295, createdAt: '2025-09-10T15:10:00Z' },
];

const orderStatusFlow: OrderStatus[] = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed'];

function daysAiso(days: number, hours = 10): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hours, 0, 0, 0);
  return d.toISOString();
}

function buildStatusHistory(createdAt: string, finalStatus: OrderStatus): { status: OrderStatus; timestamp: string; note?: string }[] {
  const history: { status: OrderStatus; timestamp: string; note?: string }[] = [];
  const created = new Date(createdAt);
  const flowIdx = orderStatusFlow.indexOf(finalStatus);
  const statusToRecord = finalStatus === 'Cancelled' ? ['Pending', 'Confirmed', 'Cancelled'] : orderStatusFlow.slice(0, flowIdx + 1);
  for (let i = 0; i < statusToRecord.length; i++) {
    const ts = new Date(created.getTime() + i * 20 * 60 * 1000);
    history.push({ status: statusToRecord[i] as OrderStatus, timestamp: ts.toISOString() });
  }
  if (finalStatus === 'Cancelled') {
    history[history.length - 1].note = 'Cancelled by customer request';
  }
  return history;
}

function makeOrderItem(productId: string, name: string, price: number, image: string, quantity: number, sizeAdj = 0) {
  const unitPrice = price + sizeAdj;
  return {
    productId,
    name,
    price,
    image,
    quantity,
    size: sizeAdj > 0 ? ('Large' as const) : undefined,
    sizePriceAdjustment: sizeAdj > 0 ? sizeAdj : undefined,
    lineTotal: unitPrice * quantity,
  };
}

const p = (id: string) => seedProducts.find((pr) => pr.id === id)!;

export const seedOrders: Order[] = [
  {
    id: 'order-seed-1', orderNumber: 'BH-1001', customerId: 'cust-2', customerName: 'Ahmed Hassan', customerEmail: 'ahmed.hassan@email.com', customerPhone: '+20 101 234 5678',
    items: [makeOrderItem('prod-cappuccino', p('prod-cappuccino').name, 65, p('prod-cappuccino').image, 2, 10), makeOrderItem('prod-butter-croissant', p('prod-butter-croissant').name, 35, p('prod-butter-croissant').image, 1)],
    subtotal: 165, total: 165, fulfillmentMethod: 'Dine-in' as FulfillmentMethod, tableNumber: '5', paymentMethod: 'Cash on Pickup', paymentStatus: 'paid' as const, status: 'Completed', statusHistory: [], createdAt: daysAiso(14, 9), isSeeded: true,
  },
  {
    id: 'order-seed-2', orderNumber: 'BH-1002', customerId: 'cust-4', customerName: 'Omar Farouk', customerEmail: 'omar.farouk@email.com', customerPhone: '+20 103 456 7890',
    items: [makeOrderItem('prod-spanish-latte', p('prod-spanish-latte').name, 75, p('prod-spanish-latte').image, 1, 10), makeOrderItem('prod-tiramisu', p('prod-tiramisu').name, 85, p('prod-tiramisu').image, 1)],
    subtotal: 180, total: 180, fulfillmentMethod: 'Takeaway' as FulfillmentMethod, paymentMethod: 'Cash on Pickup', paymentStatus: 'paid' as const, status: 'Completed', statusHistory: [], createdAt: daysAiso(13, 14), isSeeded: true,
  },
  {
    id: 'order-seed-3', orderNumber: 'BH-1003', customerId: 'cust-7', customerName: 'Nour Abdel-Rahman', customerEmail: 'nour.abdelrahman@email.com', customerPhone: '+20 106 789 0123',
    items: [makeOrderItem('prod-iced-spanish-latte', p('prod-iced-spanish-latte').name, 80, p('prod-iced-spanish-latte').image, 2)],
    subtotal: 160, total: 160, fulfillmentMethod: 'Dine-in' as FulfillmentMethod, tableNumber: '3', paymentMethod: 'Cash on Pickup', paymentStatus: 'paid' as const, status: 'Completed', statusHistory: [], createdAt: daysAiso(12, 11), isSeeded: true,
  },
  {
    id: 'order-seed-4', orderNumber: 'BH-1004', customerId: 'cust-1', customerName: 'Sarah Mahmoud', customerEmail: 'customer@brewhouse.demo', customerPhone: '+20 100 123 4567',
    items: [makeOrderItem('prod-caramel-latte', p('prod-caramel-latte').name, 80, p('prod-caramel-latte').image, 1, 10), makeOrderItem('prod-chocolate-brownie', p('prod-chocolate-brownie').name, 50, p('prod-chocolate-brownie').image, 1)],
    subtotal: 150, total: 150, fulfillmentMethod: 'Takeaway' as FulfillmentMethod, paymentMethod: 'Cash on Pickup', paymentStatus: 'paid' as const, status: 'Completed', statusHistory: [], createdAt: daysAiso(10, 8), isSeeded: true,
  },
  {
    id: 'order-seed-5', orderNumber: 'BH-1005', customerId: 'cust-4', customerName: 'Omar Farouk', customerEmail: 'omar.farouk@email.com', customerPhone: '+20 103 456 7890',
    items: [makeOrderItem('prod-flat-white', p('prod-flat-white').name, 70, p('prod-flat-white').image, 1), makeOrderItem('prod-new-york-cheesecake', p('prod-new-york-cheesecake').name, 75, p('prod-new-york-cheesecake').image, 1)],
    subtotal: 145, total: 145, fulfillmentMethod: 'Dine-in' as FulfillmentMethod, tableNumber: '7', paymentMethod: 'Cash on Pickup', paymentStatus: 'paid' as const, status: 'Completed', statusHistory: [], createdAt: daysAiso(9, 16), isSeeded: true,
  },
  {
    id: 'order-seed-6', orderNumber: 'BH-1006', customerId: 'cust-6', customerName: 'Khaled Mostafa', customerEmail: 'khaled.mostafa@email.com', customerPhone: '+20 105 678 9012',
    items: [makeOrderItem('prod-mocha', p('prod-mocha').name, 85, p('prod-mocha').image, 2, 10)],
    subtotal: 190, total: 190, fulfillmentMethod: 'Takeaway' as FulfillmentMethod, paymentMethod: 'Cash on Pickup', paymentStatus: 'paid' as const, status: 'Completed', statusHistory: [], createdAt: daysAiso(8, 10), isSeeded: true,
  },
  {
    id: 'order-seed-7', orderNumber: 'BH-1007', customerId: 'cust-2', customerName: 'Ahmed Hassan', customerEmail: 'ahmed.hassan@email.com', customerPhone: '+20 101 234 5678',
    items: [makeOrderItem('prod-americano', p('prod-americano').name, 50, p('prod-americano').image, 2), makeOrderItem('prod-chocolate-croissant', p('prod-chocolate-croissant').name, 45, p('prod-chocolate-croissant').image, 2)],
    subtotal: 190, total: 190, fulfillmentMethod: 'Dine-in' as FulfillmentMethod, tableNumber: '2', paymentMethod: 'Cash on Pickup', paymentStatus: 'paid' as const, status: 'Completed', statusHistory: [], createdAt: daysAiso(7, 9), isSeeded: true,
  },
  {
    id: 'order-seed-8', orderNumber: 'BH-1008', customerId: 'cust-7', customerName: 'Nour Abdel-Rahman', customerEmail: 'nour.abdelrahman@email.com', customerPhone: '+20 106 789 0123',
    items: [makeOrderItem('prod-tiramisu', p('prod-tiramisu').name, 85, p('prod-tiramisu').image, 1), makeOrderItem('prod-cappuccino', p('prod-cappuccino').name, 65, p('prod-cappuccino').image, 1)],
    subtotal: 150, total: 150, fulfillmentMethod: 'Dine-in' as FulfillmentMethod, tableNumber: '4', paymentMethod: 'Cash on Pickup', paymentStatus: 'paid' as const, status: 'Completed', statusHistory: [], createdAt: daysAiso(6, 15), isSeeded: true,
  },
  {
    id: 'order-seed-9', orderNumber: 'BH-1009', customerId: 'cust-3', customerName: 'Yasmin El-Sayed', customerEmail: 'yasmin.elsayed@email.com', customerPhone: '+20 102 345 6789',
    items: [makeOrderItem('prod-matcha-latte', p('prod-matcha-latte').name, 85, p('prod-matcha-latte').image, 1), makeOrderItem('prod-blueberry-muffin', p('prod-blueberry-muffin').name, 40, p('prod-blueberry-muffin').image, 1)],
    subtotal: 125, total: 125, fulfillmentMethod: 'Takeaway' as FulfillmentMethod, paymentMethod: 'Cash on Pickup', paymentStatus: 'paid' as const, status: 'Completed', statusHistory: [], createdAt: daysAiso(5, 12), isSeeded: true,
  },
  {
    id: 'order-seed-10', orderNumber: 'BH-1010', customerId: 'cust-4', customerName: 'Omar Farouk', customerEmail: 'omar.farouk@email.com', customerPhone: '+20 103 456 7890',
    items: [makeOrderItem('prod-iced-mocha', p('prod-iced-mocha').name, 90, p('prod-iced-mocha').image, 2)],
    subtotal: 180, total: 180, fulfillmentMethod: 'Takeaway' as FulfillmentMethod, paymentMethod: 'Cash on Pickup', paymentStatus: 'paid' as const, status: 'Completed', statusHistory: [], createdAt: daysAiso(4, 17), isSeeded: true,
  },
  {
    id: 'order-seed-11', orderNumber: 'BH-1011', customerId: 'cust-8', customerName: 'Mariam Adel', customerEmail: 'mariam.adel@email.com', customerPhone: '+20 107 890 1234',
    items: [makeOrderItem('prod-turkish-coffee', p('prod-turkish-coffee').name, 55, p('prod-turkish-coffee').image, 1), makeOrderItem('prod-cinnamon-roll', p('prod-cinnamon-roll').name, 45, p('prod-cinnamon-roll').image, 1)],
    subtotal: 100, total: 100, fulfillmentMethod: 'Dine-in' as FulfillmentMethod, tableNumber: '6', paymentMethod: 'Cash on Pickup', paymentStatus: 'paid' as const, status: 'Completed', statusHistory: [], createdAt: daysAiso(3, 10), isSeeded: true,
  },
  {
    id: 'order-seed-12', orderNumber: 'BH-1012', customerId: 'cust-1', customerName: 'Sarah Mahmoud', customerEmail: 'customer@brewhouse.demo', customerPhone: '+20 100 123 4567',
    items: [makeOrderItem('prod-new-york-cheesecake', p('prod-new-york-cheesecake').name, 75, p('prod-new-york-cheesecake').image, 1), makeOrderItem('prod-caramel-latte', p('prod-caramel-latte').name, 80, p('prod-caramel-latte').image, 1)],
    subtotal: 155, total: 155, fulfillmentMethod: 'Takeaway' as FulfillmentMethod, paymentMethod: 'Cash on Pickup', paymentStatus: 'paid' as const, status: 'Completed', statusHistory: [], createdAt: daysAiso(2, 14), isSeeded: true,
  },
  {
    id: 'order-seed-13', orderNumber: 'BH-1013', customerId: 'cust-6', customerName: 'Khaled Mostafa', customerEmail: 'khaled.mostafa@email.com', customerPhone: '+20 105 678 9012',
    items: [makeOrderItem('prod-espresso', p('prod-espresso').name, 45, p('prod-espresso').image, 2), makeOrderItem('prod-chocolate-brownie', p('prod-chocolate-brownie').name, 50, p('prod-chocolate-brownie').image, 1)],
    subtotal: 140, total: 140, fulfillmentMethod: 'Dine-in' as FulfillmentMethod, tableNumber: '1', paymentMethod: 'Cash on Pickup', paymentStatus: 'paid' as const, status: 'Ready', statusHistory: [], createdAt: daysAiso(1, 9), isSeeded: true,
  },
  {
    id: 'order-seed-14', orderNumber: 'BH-1014', customerId: 'cust-2', customerName: 'Ahmed Hassan', customerEmail: 'ahmed.hassan@email.com', customerPhone: '+20 101 234 5678',
    items: [makeOrderItem('prod-iced-americano', p('prod-iced-americano').name, 55, p('prod-iced-americano').image, 2)],
    subtotal: 110, total: 110, fulfillmentMethod: 'Takeaway' as FulfillmentMethod, paymentMethod: 'Cash on Pickup', paymentStatus: 'paid' as const, status: 'Preparing', statusHistory: [], createdAt: daysAiso(0, 11), isSeeded: true,
  },
  {
    id: 'order-seed-15', orderNumber: 'BH-1015', customerId: 'cust-5', customerName: 'Layla Ibrahim', customerEmail: 'layla.ibrahim@email.com', customerPhone: '+20 104 567 8901',
    items: [makeOrderItem('prod-spanish-latte', p('prod-spanish-latte').name, 75, p('prod-spanish-latte').image, 1), makeOrderItem('prod-english-breakfast-tea', p('prod-english-breakfast-tea').name, 40, p('prod-english-breakfast-tea').image, 1)],
    subtotal: 115, total: 115, fulfillmentMethod: 'Dine-in' as FulfillmentMethod, tableNumber: '8', paymentMethod: 'Cash on Pickup', paymentStatus: 'paid' as const, status: 'Pending', statusHistory: [], createdAt: daysAiso(0, 15), isSeeded: true,
  },
];

// Fill in status history for seeded orders
seedOrders.forEach((order) => {
  order.statusHistory = buildStatusHistory(order.createdAt, order.status);
});

export const seedSettings: CafeSettings = {
  cafeName: 'Brew House',
  contactPhone: '+20 2 1234 5678',
  address: '14 Tahrir Street, Downtown, Cairo, Egypt',
  openingHours: 'Mon–Fri: 7:00 AM – 11:00 PM | Sat–Sun: 8:00 AM – 12:00 AM',
  currencyDisplay: 'EGP',
  orderNotifications: true,
  newOrderSound: false,
};

export const heroImage = 'https://images.pexels.com/photos/6612572/pexels-photo-6612572.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
export const storyImage = 'https://images.pexels.com/photos/14490407/pexels-photo-14490407.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
