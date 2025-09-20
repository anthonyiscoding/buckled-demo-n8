"use client";
export function getMockQuotes() {
    return [
        {
            id: 1,
            serviceCenterName: "AutoCare Plus",
            price: 450,
            rating: 4.8,
            description: "Transmission fluid change and brake pad replacement",
            details: "Complete transmission fluid flush with premium fluid, front and rear brake pad replacement with ceramic pads, brake system inspection",
            estimatedTime: "3-4 hours",
            warranty: "12 months / 12,000 miles",
        },
        {
            id: 2,
            serviceCenterName: "Precision Motors",
            price: 425,
            rating: 4.7,
            description: "Transmission service and brake work",
            details: "Transmission fluid and filter change, brake pad replacement, rotor resurfacing if needed",
            estimatedTime: "2-3 hours",
            warranty: "6 months / 6,000 miles",
        },
        {
            id: 3,
            serviceCenterName: "Elite Auto Service",
            price: 380,
            rating: 4.9,
            description: "Complete transmission and brake service",
            details: "Full transmission service, brake pad and rotor replacement, brake fluid flush",
            estimatedTime: "4-5 hours",
            warranty: "18 months / 18,000 miles",
        },
        {
            id: 4,
            serviceCenterName: "Quick Fix Garage",
            price: 320,
            rating: 4.6,
            description: "Transmission fluid and brake maintenance",
            details: "Transmission fluid change, brake pad replacement, basic inspection",
            estimatedTime: "2 hours",
            warranty: "6 months / 6,000 miles",
        },
        {
            id: 5,
            serviceCenterName: "Master Mechanics",
            price: 395,
            rating: 4.8,
            description: "Professional transmission and brake service",
            details: "Premium transmission service, high-performance brake pads, comprehensive inspection",
            estimatedTime: "3 hours",
            warranty: "12 months / 12,000 miles",
        },
    ];
}
export function getCarModels() {
    return {
        Toyota: ["Camry", "Corolla", "RAV4", "Prius", "Highlander"],
        Honda: ["Civic", "Accord", "CR-V", "Pilot", "Fit"],
        Ford: ["F-150", "Escape", "Explorer", "Mustang", "Focus"],
        Chevrolet: ["Silverado", "Equinox", "Malibu", "Tahoe", "Cruze"],
        BMW: ["3 Series", "5 Series", "X3", "X5", "i3"],
        "Mercedes-Benz": ["C-Class", "E-Class", "GLC", "GLE", "A-Class"],
        Audi: ["A4", "A6", "Q5", "Q7", "A3"],
        Volkswagen: ["Jetta", "Passat", "Tiguan", "Golf", "Atlas"],
        Nissan: ["Altima", "Sentra", "Rogue", "Pathfinder", "Leaf"],
        Hyundai: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Accent"],
    };
}
export function getCarMakes() {
    return [
        "Toyota",
        "Honda",
        "Ford",
        "Chevrolet",
        "BMW",
        "Mercedes-Benz",
        "Audi",
        "Volkswagen",
        "Nissan",
        "Hyundai",
    ];
}
