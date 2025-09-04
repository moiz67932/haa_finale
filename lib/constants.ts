// Centralized constants for dropdowns and predefined options
// Home room presets for quick home creation
export const HOME_PRESETS = [
  { label: "2BDRM / 2BA", bedrooms: 2, bathrooms: 2 },
  { label: "3BDRM / 2.5BA", bedrooms: 3, bathrooms: 2.5 },
  { label: "4BDRM / 3BA", bedrooms: 4, bathrooms: 3 }
];

export const ROOM_TYPES = [
  "Living Room",
  "Family Room / Den",
  "Dining Room",
  "Kitchen",
  "Master Bedroom",
  "Bedroom",
  "Nursery",
  "Master Bathroom",
  "Full Bathroom",
  "Half Bathroom / Powder Room",
  "Laundry Room",
  "Mudroom",
  "Pantry",
  "Closet / Walk-in Closet",
  "Garage",
  "Finished Basement",
  "Unfinished Basement",
  "Attic",
  "Home Office",
  "Playroom",
  "Home Gym",
  "Media Room / Theater",
  "Game Room",
  "Patio / Deck",
  "Porch",
  "Balcony",
  "Backyard / Garden"
];

// Hierarchical mapping for room categories to types
export const ROOM_CATEGORY_MAP: Record<string, string[]> = {
  "Main Living Areas": [
    "Living Room",
    "Family Room / Den",
    "Dining Room",
    "Kitchen"
  ],
  Bedrooms: ["Master Bedroom", "Bedroom (Child/Guest/Other)", "Nursery"],
  Bathrooms: [
    "Master Bathroom",
    "Full Bathroom",
    "Half Bathroom / Powder Room"
  ],
  "Utility / Functional": [
    "Laundry Room",
    "Mudroom",
    "Pantry",
    "Closet / Walk-in Closet",
    "Garage"
  ],
  "Basement / Attic": [
    "Finished Basement",
    "Unfinished Basement",
    "Attic"
  ],
  "Office / Recreation": [
    "Home Office",
    "Playroom",
    "Home Gym",
    "Media Room / Theater",
    "Game Room"
  ],
  "Outdoor Spaces": [
    "Patio / Deck",
    "Porch",
    "Balcony",
    "Backyard / Garden"
  ]
};

export const HOME_SERVICE_CATEGORIES_INSIDE = [
  "Plumbing",
  "Electrical",
  "HVAC",
  "Appliance Repair",
  "Flooring Repair",
  "Painting",
  "Lighting Install/Repair",
  "Drywall Repair / Patching",
  "Pest Control",
  "Cleaning Services",
  "Kitchen Remodel",
  "Bathroom Remodel",
  "Flooring Installation",
  "Smart Home Devices",
  "Furniture Assembly / Installation",
  "Interior Design / Decorating"
];

export const HOME_SERVICE_CATEGORIES_OUTSIDE = [
  "Lawn Care",
  "Tree & Bush Trimming / Removal",
  "Irrigation System Install / Repair",
  "Gutter Cleaning & Repair",
  "Power Washing",
  "Roof Repair / Inspection",
  "Fence Repair / Maintenance",
  "Pest Control (Yard)",
  "Deck / Patio Build or Repair",
  "Fence Installation",
  "Exterior Painting / Siding Work",
  "Outdoor Lighting Install",
  "Driveway / Concrete Work",
  "Landscaping",
  "Outdoor Furniture Assembly",
  "Pool Install / Maintenance"
];

export const VEHICLE_SERVICE_TYPES = [
  "Oil & Filter Change",
  "Tire Rotation / Balance",
  "Brake Service",
  "Battery Replacement",
  "Air Filter Replacement",
  "Wiper Blade Replacement",
  "Fluid Checks & Top-offs",
  "Scheduled Maintenance / Tune-up",
  "Tire Replacement / Flat Repair",
  "Check Engine Light Diagnostics",
  "Alternator / Starter Repair",
  "Suspension / Shock & Strut Replacement",
  "Exhaust / Muffler Repair",
  "AC / Heating Service",
  "Transmission Service / Repair"
];

// Simplified core maintenance service types for quick entry
export const CORE_VEHICLE_MAINTENANCE_TYPES = [
  "Oil Change",
  "Tire Rotation",
  "Brake Service",
  "General Inspection",
  "Other"
];

export const VEHICLE_REPAIR_ISSUES = [
  "Engine",
  "Transmission",
  "Brakes",
  "Electrical",
  "Suspension",
  "Cooling System",
  "Fuel System",
  "Other"
];

export const WARRANTY_OPTIONS = [
  "No Warranty",
  "6 months",
  "1 year",
  "2 years",
  "Other"
];

export const LABOR_PART_WARRANTY = [
  "30 days",
  "90 days",
  "1 year",
  "Custom"
];

// Consolidated list of common home systems/services for maintenance records
export const HOME_MAINTENANCE_SYSTEMS = [
  "HVAC",
  "Plumbing",
  "Electrical",
  "Appliance",
  "Roofing",
  "Flooring",
  "Painting",
  "Pest Control",
  "Landscaping",
  "Gutter Cleaning",
  "Garage Door",
  "Water Heater",
  "Foundation",
  "Pool / Spa",
  "Security System",
  "Other"
];

export const HOME_IMPROVEMENT_MATERIAL_CATEGORIES = [
  "Paint",
  "Flooring",
  "Lighting",
  "Furniture"
];

export const SERVICE_PROVIDER_CATEGORIES = {
  Home: {
    Plumbing: [
      "General Plumbing",
      "Leak Detection & Repair",
      "Water Heater Service / Replacement",
      "Pipe Installation / Replacement",
      "Sewer / Drain Cleaning"
    ],
    Electrical: [
      "General Electrical",
      "Wiring & Rewiring",
      "Outlet / Switch Installation",
      "Ceiling Fan / Lighting Fixtures",
      "Panel Upgrades"
    ],
    HVAC: ["Heating", "Cooling", "Duct Cleaning", "Thermostat / Smart Controls"],
    ApplianceRepair: [
      "Kitchen Appliances",
      "Laundry Appliances",
      "Small Appliance Repair"
    ],
    Flooring: ["Carpet Install / Repair", "Hardwood / Laminate", "Tile / Stone", "Vinyl / LVP"],
    Painting: ["Interior Painting", "Exterior Painting", "Staining"],
    Roofing: ["Roof Inspection", "Roof Repair", "Roof Replacement"],
    Landscaping: [
      "Lawn Mowing / Maintenance",
      "Fertilization / Aeration",
      "Mulching / Planting",
      "Sod Installation"
    ],
    TreeServices: ["Trimming / Pruning", "Tree Removal", "Stump Grinding"],
    Irrigation: ["Installation", "Repair / Maintenance"],
    GutterServices: ["Cleaning", "Repair / Replacement"],
    PestControl: ["Termites", "Rodents", "General Pest Control"],
    Remodeling: ["Kitchen Remodel", "Bathroom Remodel", "Basement Remodel", "General Renovation"],
    DeckPatio: ["New Construction", "Repair / Refinishing"],
    FenceServices: ["Installation", "Repair"],
    CleaningServices: ["Residential Cleaning", "Commercial Cleaning", "Carpet / Upholstery Cleaning"],
    Pools: ["Installation", "Maintenance / Cleaning"]
  },
  Auto: {
    GeneralAutoRepair: ["Diagnostics", "Scheduled Maintenance", "Tune-ups"],
    OilChange: ["Conventional Oil Change", "Synthetic Oil Change"],
    Tires: ["Tire Rotation", "Tire Replacement", "Wheel Alignment", "Balancing"],
    Brakes: ["Brake Pads / Rotors", "Brake Fluid Service"],
    Transmission: ["Fluid Service", "Transmission Repair"],
    EngineServices: ["Diagnostics", "Engine Rebuild / Replacement"],
    ElectricalBattery: ["Battery Replacement", "Alternator / Starter Repair", "Wiring / Electrical Diagnostics"],
    SuspensionSteering: ["Shock / Strut Replacement", "Steering System Repair"],
    ExhaustMuffler: ["Muffler Replacement", "Exhaust System Repair"],
    ACHeating: ["AC Recharge", "Heater Core Repair"],
    Detailing: ["Exterior Wash / Wax", "Interior Detailing"],
    AutoGlass: ["Windshield Replacement", "Window Repair"],
    BodyShop: ["Dent / Scratch Repair", "Collision Work", "Paint / Refinishing"],
    CarElectronics: ["Audio Installation", "Navigation Systems", "Dash Cameras"],
    PerformanceUpgrades: ["Custom Exhausts", "Suspension Upgrades", "Engine Tuning"]
  },
  Other: {
    InsuranceProviders: ["Home Insurance", "Auto Insurance", "Bundled Services"],
    RealEstate: ["Real Estate Agents", "Property Inspectors"],
    SmartHomeSecurity: ["Camera Installations", "Alarm Systems", "Smart Devices"],
    MovingStorage: ["Moving Companies", "Storage Facilities"]
  }
};

// New hierarchical mapping for service provider creation (top-level -> subcategories)
export const SERVICE_PROVIDER_CATEGORY_MAP: Record<string, string[]> = {
  Plumbing: [
    "General Plumbing",
    "Leak Detection & Repair",
    "Water Heater Service / Replacement",
    "Pipe Installation / Replacement",
    "Sewer / Drain Cleaning"
  ],
  Electrical: [
    "General Electrical",
    "Wiring & Rewiring",
    "Outlet / Switch Installation",
    "Ceiling Fan / Lighting Fixtures",
    "Panel Upgrades"
  ],
  HVAC: [
    "Heating (Furnace / Boiler)",
    "Cooling (AC / Mini-Split)",
    "Duct Cleaning",
    "Thermostat / Smart Controls"
  ],
  "Appliance Repair": [
    "Kitchen Appliances",
    "Laundry Appliances",
    "Small Appliance Repair"
  ],
  Flooring: [
    "Carpet Install / Repair",
    "Hardwood / Laminate",
    "Tile / Stone",
    "Vinyl / LVP"
  ],
  Painting: ["Interior Painting", "Exterior Painting", "Staining"],
  Roofing: ["Roof Inspection", "Roof Repair", "Roof Replacement"],
  "Landscaping / Lawn Care": [
    "Lawn Mowing / Maintenance",
    "Fertilization / Aeration",
    "Mulching / Planting",
    "Sod Installation"
  ],
  "Tree Services": ["Trimming / Pruning", "Tree Removal", "Stump Grinding"],
  "Irrigation / Sprinklers": ["Installation", "Repair / Maintenance"],
  "Gutter Services": ["Cleaning", "Repair / Replacement"],
  "Pest Control": ["Termites", "Rodents", "General Pest Control"],
  "Remodeling / Renovation": [
    "Kitchen Remodel",
    "Bathroom Remodel",
    "Basement Remodel",
    "General Renovation"
  ],
  "Deck / Patio": ["New Construction", "Repair / Refinishing"],
  "Fence Services": ["Installation", "Repair"],
  "Cleaning Services": [
    "Residential Cleaning",
    "Commercial Cleaning",
    "Carpet / Upholstery Cleaning"
  ],
  Pools: ["Installation", "Maintenance / Cleaning"],
  "General Auto Repair": ["Diagnostics", "Scheduled Maintenance", "Tune-ups"],
  "Oil Change / Lube Services": [
    "Conventional Oil Change",
    "Synthetic Oil Change"
  ],
  Tires: [
    "Tire Rotation",
    "Tire Replacement",
    "Wheel Alignment",
    "Balancing"
  ],
  Brakes: ["Brake Pads / Rotors", "Brake Fluid Service"],
  Transmission: ["Fluid Service", "Transmission Repair"],
  "Engine Services": ["Diagnostics", "Engine Rebuild / Replacement"],
  "Electrical / Battery": [
    "Battery Replacement",
    "Alternator / Starter Repair",
    "Wiring / Electrical Diagnostics"
  ],
  "Suspension / Steering": [
    "Shock / Strut Replacement",
    "Steering System Repair"
  ],
  "Exhaust / Muffler": ["Muffler Replacement", "Exhaust System Repair"],
  "AC / Heating": ["AC Recharge", "Heater Core Repair"],
  "Detailing / Car Wash": ["Exterior Wash / Wax", "Interior Detailing"],
  "Auto Glass": ["Windshield Replacement", "Window Repair"],
  "Body Shop / Collision": [
    "Dent / Scratch Repair",
    "Collision Work",
    "Paint / Refinishing"
  ],
  "Car Electronics": [
    "Audio Installation",
    "Navigation Systems",
    "Dash Cameras"
  ],
  "Performance Upgrades": [
    "Custom Exhausts",
    "Suspension Upgrades",
    "Engine Tuning"
  ],
  "Insurance Providers": ["Home Insurance", "Auto Insurance", "Bundled Services"],
  "Real Estate": ["Real Estate Agents", "Property Inspectors"],
  "Smart Home / Security": [
    "Camera Installations",
    "Alarm Systems",
    "Smart Devices"
  ],
  "Moving / Storage": ["Moving Companies", "Storage Facilities"],
  Other: ["General / Misc"]
};

export const SERVICE_PROVIDER_TOP_LEVEL_CATEGORIES = Object.keys(SERVICE_PROVIDER_CATEGORY_MAP);

// Common vehicle makes and models (subset for dropdown). Additional models can be appended later or loaded dynamically.
export const VEHICLE_MAKES = [
  "Toyota",
  "Honda",
  "Ford",
  "Chevrolet",
  "Nissan",
  "BMW",
  "Mercedes-Benz",
  "Volkswagen",
  "Subaru",
  "Hyundai",
  "Kia",
  "Tesla",
  "Jeep"
];

export const VEHICLE_MODELS: Record<string, string[]> = {
  Toyota: [
    "Camry",
    "Corolla",
    "RAV4",
    "Highlander",
    "Tacoma",
    "4Runner"
  ],
  Honda: ["Civic", "Accord", "CR-V", "Pilot", "Odyssey"],
  Ford: ["F-150", "Escape", "Explorer", "Mustang", "Edge"],
  Chevrolet: ["Silverado", "Equinox", "Malibu", "Tahoe", "Traverse"],
  Nissan: ["Altima", "Sentra", "Rogue", "Pathfinder", "Frontier"],
  BMW: ["3 Series", "5 Series", "X3", "X5", "X1"],
  "Mercedes-Benz": ["C-Class", "E-Class", "GLC", "GLE", "GLA"],
  Volkswagen: ["Jetta", "Passat", "Tiguan", "Atlas", "Golf"],
  Subaru: ["Outback", "Forester", "Impreza", "Crosstrek", "Ascent"],
  Hyundai: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Kona"],
  Kia: ["Sorento", "Sportage", "Optima", "Telluride", "Soul"],
  Tesla: ["Model 3", "Model Y", "Model S", "Model X"],
  Jeep: ["Wrangler", "Grand Cherokee", "Cherokee", "Compass", "Renegade"],
};

// Recommended default mileage intervals for next due calculations (miles)
export const VEHICLE_SERVICE_DEFAULT_INTERVALS: Record<string, number> = {
  "Oil Change": 5000,
  "Tire Rotation": 6000,
  "Brake Service": 12000,
};

// Recommended default date intervals (months) for date-based services
export const VEHICLE_SERVICE_DEFAULT_MONTH_INTERVALS: Record<string, number> = {
  "General Inspection": 6,
};
