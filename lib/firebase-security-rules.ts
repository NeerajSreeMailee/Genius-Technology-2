// Firestore Security Rules
export const firestoreRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Products are readable by all, writable by admins only
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Mobile collection is readable by all, writable by admins only
    match /mobile/{mobileId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Categories are readable by all, writable by admins only
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Brands are readable by all, writable by admins only
    match /brands/{brandId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Orders can be read by the user who created them or admins
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Reviews can be read by all, written by authenticated users
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Blog posts are readable by all, writable by admins only
    match /blog/{postId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Coupons are readable by authenticated users, writable by admins only
    match /coupons/{couponId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
`

// Storage Security Rules
export const storageRules = `
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can upload their own profile images
    match /users/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Product images can be uploaded by admins only
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Brand logos can be uploaded by admins only
    match /brands/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Category images can be uploaded by admins only
    match /categories/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
`
