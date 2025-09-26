const admin = require("firebase-admin")

// Initialize Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

async function setupFirestore() {
  console.log("Setting up Firestore collections and initial data...")

  try {
    // Create sample categories
    const categories = [
      {
        id: "audio-accessories",
        name: "Audio Accessories",
        slug: "audio-accessories",
        description: "Premium headphones, speakers, and audio devices",
        image: "/placeholder.svg?height=300&width=400&text=Audio+Accessories",
        isActive: true,
        productCount: 0,
      },
      {
        id: "charging-solutions",
        name: "Charging Solutions",
        slug: "charging-solutions",
        description: "Fast chargers, power banks, and charging cables",
        image: "/placeholder.svg?height=300&width=400&text=Charging+Solutions",
        isActive: true,
        productCount: 0,
      },
      {
        id: "mobile-accessories",
        name: "Mobile Accessories",
        slug: "mobile-accessories",
        description: "Cases, holders, and mobile enhancement accessories",
        image: "/placeholder.svg?height=300&width=400&text=Mobile+Accessories",
        isActive: true,
        productCount: 0,
      },
      {
        id: "smart-devices",
        name: "Smart Devices",
        slug: "smart-devices",
        description: "Smart watches, fitness trackers, and IoT devices",
        image: "/placeholder.svg?height=300&width=400&text=Smart+Devices",
        isActive: true,
        productCount: 0,
      },
    ]

    for (const category of categories) {
      await db
        .collection("categories")
        .doc(category.id)
        .set({
          ...category,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        })
    }

    // Create sample brands
    const brands = [
      {
        id: "apple",
        name: "Apple",
        slug: "apple",
        logo: "/placeholder.svg?height=60&width=120&text=Apple",
        description: "Premium Apple accessories and compatible products",
        isActive: true,
        productCount: 0,
      },
      {
        id: "samsung",
        name: "Samsung",
        slug: "samsung",
        logo: "/placeholder.svg?height=60&width=120&text=Samsung",
        description: "Samsung mobile accessories and smart devices",
        isActive: true,
        productCount: 0,
      },
      {
        id: "oneplus",
        name: "OnePlus",
        slug: "oneplus",
        logo: "/placeholder.svg?height=60&width=120&text=OnePlus",
        description: "OnePlus accessories and charging solutions",
        isActive: true,
        productCount: 0,
      },
    ]

    for (const brand of brands) {
      await db
        .collection("brands")
        .doc(brand.id)
        .set({
          ...brand,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        })
    }

    // Create sample products
    const products = [
      {
        id: "wireless-headphones-pro",
        name: "Premium Wireless Headphones Pro",
        description:
          "High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals.",
        price: 2499,
        originalPrice: 3999,
        images: [
          "/placeholder.svg?height=400&width=400&text=Headphones+1",
          "/placeholder.svg?height=400&width=400&text=Headphones+2",
          "/placeholder.svg?height=400&width=400&text=Headphones+3",
        ],
        category: "audio-accessories",
        brand: "apple",
        sku: "GT-WH-001",
        stock: 25,
        rating: 4.8,
        reviewCount: 156,
        features: [
          "Active Noise Cancellation",
          "30-hour battery life",
          "Premium leather ear cups",
          "Wireless charging case",
          "Hi-Res Audio certified",
        ],
        specifications: {
          "Driver Size": "40mm",
          "Frequency Response": "20Hz - 40kHz",
          "Battery Life": "30 hours",
          "Charging Time": "2 hours",
          Weight: "250g",
          Connectivity: "Bluetooth 5.2",
        },
        isActive: true,
        isFeatured: true,
      },
      {
        id: "fast-charging-power-bank",
        name: "Fast Charging Power Bank 20000mAh",
        description:
          "High-capacity power bank with fast charging technology. Charge multiple devices simultaneously with advanced safety features.",
        price: 1999,
        originalPrice: 2999,
        images: [
          "/placeholder.svg?height=400&width=400&text=Power+Bank+1",
          "/placeholder.svg?height=400&width=400&text=Power+Bank+2",
        ],
        category: "charging-solutions",
        brand: "samsung",
        sku: "GT-PB-002",
        stock: 18,
        rating: 4.6,
        reviewCount: 203,
        features: [
          "20000mAh high capacity",
          "22.5W fast charging",
          "Multiple device charging",
          "LED power indicator",
          "Advanced safety protection",
        ],
        specifications: {
          Capacity: "20000mAh",
          Input: "USB-C 18W",
          Output: "USB-A 22.5W, USB-C 20W",
          "Charging Time": "6-8 hours",
          Weight: "420g",
          Dimensions: "150 x 68 x 29mm",
        },
        isActive: true,
        isFeatured: true,
      },
    ]

    for (const product of products) {
      await db
        .collection("products")
        .doc(product.id)
        .set({
          ...product,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        })
    }

    // Create admin user
    const adminUser = {
      email: "admin@geniustechnology.com",
      name: "Admin User",
      role: "admin",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }

    await db.collection("users").doc("admin-user").set(adminUser)

    // Create sample settings
    const settings = {
      siteName: "Genius Technology",
      siteDescription: "Premium Mobile Accessories & Smart Devices",
      contactEmail: "support@geniustechnology.com",
      contactPhone: "1800-123-4567",
      address: {
        street: "123 Tech Street",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        country: "India",
      },
      socialMedia: {
        facebook: "https://facebook.com/geniustechnology",
        instagram: "https://instagram.com/geniustechnology",
        twitter: "https://twitter.com/geniustechnology",
        youtube: "https://youtube.com/geniustechnology",
      },
      paymentMethods: {
        razorpay: { enabled: true },
        stripe: { enabled: true },
        payu: { enabled: true },
        cod: { enabled: true },
      },
      shipping: {
        freeShippingThreshold: 499,
        standardShipping: 49,
        expressShipping: 99,
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }

    await db.collection("settings").doc("site-settings").set(settings)

    console.log("✅ Firestore setup completed successfully!")
    console.log("📦 Created collections: categories, brands, products, users, settings")
    console.log("👤 Admin user created: admin@geniustechnology.com")
    console.log("🛍️ Sample products and categories added")
  } catch (error) {
    console.error("❌ Error setting up Firestore:", error)
  }
}

// Run the setup
setupFirestore()
  .then(() => {
    console.log("🎉 Firebase setup completed!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("💥 Setup failed:", error)
    process.exit(1)
  })
