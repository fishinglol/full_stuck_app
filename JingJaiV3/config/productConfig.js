// config/productConfig.js

const productConfigs = {
  'attica-bag': {
    name: 'Alexander Wang Attica Bag',
    brand: 'Alexander Wang',
    category: 'luxury-handbags',
    requiredPhotos: [
      {
        id: 'front',
        name: 'Front View',
        description: 'Full front view of the bag showing overall shape and design',
        icon: 'camera-outline',
        required: true
      },
      {
        id: 'material',
        name: 'Material Close-up',
        description: 'Close-up shot of the leather texture and grain',
        icon: 'search-outline',
        required: true
      },
      {
        id: 'label',
        name: 'Brand Label',
        description: 'Clear shot of Alexander Wang brand label or logo',
        icon: 'text-outline',
        required: true
      },
      {
        id: 'serial',
        name: 'Serial Number',
        description: 'Serial number or date code inside the bag',
        icon: 'barcode-outline',
        required: true
      },
      {
        id: 'zipper',
        name: 'Zipper Details',
        description: 'Close-up of zipper pulls and hardware branding',
        icon: 'lock-closed-outline',
        required: true
      },
      {
        id: 'hardware',
        name: 'Hardware',
        description: 'All metal hardware including studs and grommets',
        icon: 'hammer-outline',
        required: true
      },
      {
        id: 'inside',
        name: 'Interior',
        description: 'Interior lining, pockets, and construction',
        icon: 'eye-outline',
        required: true
      },
      {
        id: 'details',
        name: 'Detail Shots',
        description: 'Any unique features or distinguishing characteristics',
        icon: 'star-outline',
        required: true
      }
    ]
  },
  'louis-vuitton-neverfull': {
    name: 'Louis Vuitton Neverfull',
    brand: 'Louis Vuitton',
    category: 'luxury-handbags',
    requiredPhotos: [
      {
        id: 'front',
        name: 'Front View',
        description: 'Full front view showing LV monogram pattern',
        icon: 'camera-outline',
        required: true
      },
      {
        id: 'canvas',
        name: 'Canvas Pattern',
        description: 'Close-up of monogram canvas quality and alignment',
        icon: 'grid-outline',
        required: true
      },
      {
        id: 'date-code',
        name: 'Date Code',
        description: 'Date code location and clear visibility',
        icon: 'calendar-outline',
        required: true
      },
      {
        id: 'hardware',
        name: 'Hardware',
        description: 'All metal hardware and D-rings',
        icon: 'hammer-outline',
        required: true
      },
      {
        id: 'stitching',
        name: 'Stitching',
        description: 'Quality of stitching and thread color',
        icon: 'build-outline',
        required: true
      },
      {
        id: 'handles',
        name: 'Handles',
        description: 'Leather handles and their attachment points',
        icon: 'hand-left-outline',
        required: true
      }
    ]
  },
  'chanel-classic-flap': {
    name: 'Chanel Classic Flap',
    brand: 'Chanel',
    category: 'luxury-handbags',
    requiredPhotos: [
      {
        id: 'front',
        name: 'Front View',
        description: 'Full front view showing quilting pattern',
        icon: 'camera-outline',
        required: true
      },
      {
        id: 'quilting',
        name: 'Quilting Pattern',
        description: 'Close-up of diamond quilting quality',
        icon: 'diamond',
        required: true
      },
      {
        id: 'cc-turnlock',
        name: 'CC Turnlock',
        description: 'Chanel CC turnlock mechanism and engraving',
        icon: 'lock-closed-outline',
        required: true
      },
      {
        id: 'chain',
        name: 'Chain Strap',
        description: 'Chain strap construction and weight',
        icon: 'link-outline',
        required: true
      },
      {
        id: 'serial-sticker',
        name: 'Serial Sticker',
        description: 'Authenticity sticker inside the bag',
        icon: 'bookmark-outline',
        required: true
      },
      {
        id: 'interior',
        name: 'Interior',
        description: 'Interior lining and CC stamp',
        icon: 'eye-outline',
        required: true
      }
    ]
  }
};

// Helper functions
export const getProductConfig = (productId) => {
  return productConfigs[productId] || null;
};

export const getAllProducts = () => {
  return Object.keys(productConfigs).map(id => ({
    id,
    ...productConfigs[id]
  }));
};

export const getProductsByBrand = (brandName) => {
  return Object.keys(productConfigs)
    .map(id => ({ id, ...productConfigs[id] }))
    .filter(product => product.brand.toLowerCase() === brandName.toLowerCase());
};

export const getProductsByCategory = (category) => {
  return Object.keys(productConfigs)
    .map(id => ({ id, ...productConfigs[id] }))
    .filter(product => product.category === category);
};

export default productConfigs;