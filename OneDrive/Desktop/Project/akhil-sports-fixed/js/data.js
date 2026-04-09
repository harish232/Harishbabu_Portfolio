// ===== APPLICATION DATA =====

let products = [
  {id:1,name:'English Willow Bat',sub:'Grade 1 · Full Size',cat:'Cricket',price:2499,old:3200,badge:'sale',stock:12,imgs:['https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=900&q=80']},
  {id:2,name:'SG Cricket Ball',sub:'Match Quality · Red',cat:'Cricket',price:349,old:null,badge:'',stock:45,imgs:['https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=900&q=80']},
  {id:3,name:'Batting Gloves',sub:'Adult · Right Hand',cat:'Cricket',price:699,old:899,badge:'sale',stock:20,imgs:['https://images.unsplash.com/photo-1562077772-3bd90403f7f0?auto=format&fit=crop&w=900&q=80']},
  {id:4,name:'Cricket Kit Bag',sub:'Full Size · Wheels',cat:'Cricket',price:1499,old:null,badge:'new',stock:8,imgs:['https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=900&q=80']},
  {id:5,name:'Training Football',sub:'Size 5 · Match Quality',cat:'Football',price:899,old:null,badge:'',stock:30,imgs:['https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=80']},
  {id:6,name:'Football Boots',sub:'Moulded · Size 7-11',cat:'Football',price:1299,old:1699,badge:'sale',stock:15,imgs:['https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=900&q=80']},
  {id:7,name:'Football Kit Set',sub:'Jersey + Shorts',cat:'Football',price:649,old:null,badge:'hot',stock:25,imgs:['https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=900&q=80']},
  {id:8,name:'Goalkeeper Gloves',sub:'Pro Grip',cat:'Football',price:799,old:null,badge:'',stock:10,imgs:['https://images.unsplash.com/photo-1513875528450-1cd6f41cd5fc?auto=format&fit=crop&w=900&q=80']},
  {id:9,name:'Yonex Racket',sub:'Graphite · Strung',cat:'Badminton',price:1899,old:2400,badge:'sale',stock:18,imgs:['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=900&q=80']},
  {id:10,name:'Shuttlecock Pack',sub:'Feather · Pack of 6',cat:'Badminton',price:299,old:null,badge:'',stock:60,imgs:['https://images.unsplash.com/photo-1533587851505-80cca7f14bcd?auto=format&fit=crop&w=900&q=80']},
  {id:11,name:'Racket Bag',sub:'2 Racket Capacity',cat:'Badminton',price:599,old:null,badge:'new',stock:14,imgs:['https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=900&q=80']},
  {id:12,name:'Basketball',sub:'Size 7 · Rubber',cat:'Basketball',price:999,old:1299,badge:'sale',stock:22,imgs:['https://images.unsplash.com/photo-1519861531473-920026076fb1?auto=format&fit=crop&w=900&q=80']},
  {id:13,name:'Tennis Racket',sub:'Aluminium · Strung',cat:'Tennis',price:1199,old:null,badge:'',stock:16,imgs:['https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=900&q=80']},
  {id:14,name:'Dumbbell Set',sub:'5kg Pair · Rubber',cat:'Fitness',price:1099,old:1400,badge:'sale',stock:19,imgs:['https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=80']},
  {id:15,name:'Resistance Bands',sub:'Set of 5 · Heavy',cat:'Fitness',price:449,old:null,badge:'hot',stock:40,imgs:['https://images.unsplash.com/photo-1598970434795-0c54fe7c0642?auto=format&fit=crop&w=900&q=80']},
  {id:16,name:'Running Shoes',sub:'Lightweight · All surfaces',cat:'Running',price:1799,old:null,badge:'new',stock:28,imgs:['https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80']},
  {id:17,name:'Boxing Gloves',sub:'12oz · PU Leather',cat:'Boxing',price:1399,old:1799,badge:'sale',stock:11,imgs:['https://images.unsplash.com/photo-1518655048521-f130df041f66?auto=format&fit=crop&w=900&q=80']},
  {id:18,name:'Skipping Rope',sub:'Adjustable · Steel',cat:'Fitness',price:249,old:null,badge:'',stock:50,imgs:['https://images.unsplash.com/photo-1571019613418-7c4c8d8caa0b?auto=format&fit=crop&w=900&q=80']},
];

let allOrders = [
  {id:'AS-482910',cust:'Ravi Kumar',phone:'9876543210',items:'English Willow Bat x1',total:2499,status:'delivered',date:'28 Mar 2025',pay:'COD'},
  {id:'AS-371820',cust:'Priya Sharma',phone:'9123456789',items:'Training Football x1',total:899,status:'shipped',date:'15 Mar 2025',pay:'UPI'},
  {id:'AS-260730',cust:'Suresh Reddy',phone:'9988776655',items:'Yonex Racket x1, Shuttlecock x2',total:2497,status:'delivered',date:'2 Mar 2025',pay:'Card'},
  {id:'AS-159640',cust:'Anitha Rao',phone:'9765432100',items:'Dumbbell Set x1, Resistance Bands x1',total:1548,status:'processing',date:'1 Apr 2025',pay:'UPI'},
  {id:'AS-048550',cust:'Kiran Babu',phone:'9654321099',items:'Football Boots x1',total:1299,status:'pending',date:'2 Apr 2025',pay:'COD'},
];

let customers = [
  {name:'Ravi Kumar',email:'ravi@email.com',phone:'9876543210',orders:3,spent:5247,pass:'ravi123'},
  {name:'Priya Sharma',email:'priya@email.com',phone:'9123456789',orders:1,spent:899,pass:'priya123'},
];

// Load data from localStorage on initial load
function loadInitialData() {
  const savedProducts = Storage.get('products');
  if (savedProducts) products = savedProducts;

  const savedOrders = Storage.get('allOrders');
  if (savedOrders) allOrders = savedOrders;

  const savedCustomers = Storage.get('customers');
  if (savedCustomers) customers = savedCustomers;

  const savedAddressesData = Storage.get('savedAddresses');
  if (savedAddressesData) savedAddresses = savedAddressesData;

  const savedCart = Storage.get('cart');
  if (savedCart) cart = savedCart;

  const savedUser = Storage.get('currentUser');
  if (savedUser) currentUser = savedUser;
}

// Initialize data on page load
document.addEventListener('DOMContentLoaded', loadInitialData);
