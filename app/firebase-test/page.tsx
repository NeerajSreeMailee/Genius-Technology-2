"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs, doc, getDoc } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function FirebaseTestPage() {
  const [connectionStatus, setConnectionStatus] = useState<string>("Testing...")
  const [collections, setCollections] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const testFirebaseConnection = async () => {
    try {
      setLoading(true)
      setError(null)
      setConnectionStatus("Testing Firebase connection...")

      // Test different possible collection names
      const possibleCollections = ['mobile', 'products', 'items', 'mobiles']
      const results: Record<string, any> = {}

      for (const collectionName of possibleCollections) {
        try {
          console.log(`Testing collection: ${collectionName}`)
          const collectionRef = collection(db, collectionName)
          const snapshot = await getDocs(collectionRef)
          
          results[collectionName] = {
            exists: true,
            count: snapshot.docs.length,
            sampleDoc: snapshot.docs.length > 0 ? { 
              id: snapshot.docs[0].id, 
              data: snapshot.docs[0].data(),
              fields: Object.keys(snapshot.docs[0].data())
            } : null
          }
          
          console.log(`Collection ${collectionName}: ${snapshot.docs.length} documents`)
          if (snapshot.docs.length > 0) {
            console.log(`Sample document from ${collectionName}:`, snapshot.docs[0].data())
          }
        } catch (collectionError) {
          console.error(`Error testing collection ${collectionName}:`, collectionError)
          results[collectionName] = {
            exists: false,
            error: collectionError instanceof Error ? collectionError.message : String(collectionError)
          }
        }
      }

      setCollections(results)
      setConnectionStatus("Firebase connection test completed!")
      
    } catch (err) {
      console.error("Firebase connection test failed:", err)
      setError(err instanceof Error ? err.message : String(err))
      setConnectionStatus("Firebase connection failed!")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testFirebaseConnection()
  }, [])

  const refreshTest = () => {
    testFirebaseConnection()
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Firebase Connection Test</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`mb-4 ${error ? 'text-red-600' : 'text-green-600'}`}>
            {connectionStatus}
          </p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
              <h4 className="font-semibold text-red-800 mb-2">Error Details:</h4>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          <Button onClick={refreshTest} disabled={loading}>
            {loading ? "Testing..." : "Refresh Test"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Collection Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(collections).length === 0 ? (
            <p>No collection test results yet...</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(collections).map(([collectionName, result]) => (
                <div key={collectionName} className="border rounded p-4">
                  <h4 className="font-semibold text-lg mb-2">{collectionName}</h4>
                  
                  {result.exists ? (
                    <div className="space-y-2">
                      <p className="text-green-600">✅ Collection exists</p>
                      <p><strong>Document count:</strong> {result.count}</p>
                      
                      {result.sampleDoc && (
                        <div className="bg-gray-50 p-3 rounded">
                          <h5 className="font-semibold mb-2">Sample Document:</h5>
                          <p><strong>ID:</strong> {result.sampleDoc.id}</p>
                          <p><strong>Available fields:</strong> {result.sampleDoc.fields.join(', ')}</p>
                          <details className="mt-2">
                            <summary className="cursor-pointer font-medium">View Full Data</summary>
                            <pre className="text-xs mt-2 overflow-auto max-h-40 bg-white p-2 rounded border">
                              {JSON.stringify(result.sampleDoc.data, null, 2)}
                            </pre>
                          </details>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-red-600">❌ Collection does not exist or is empty</p>
                      {result.error && (
                        <p className="text-red-500 text-sm">Error: {result.error}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Environment Variables Check</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>Firebase API Key: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing'}</p>
            <p>Firebase Auth Domain: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing'}</p>
            <p>Firebase Project ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing'}</p>
            <p>Firebase Storage Bucket: {process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Missing'}</p>
            <p>Firebase Messaging Sender ID: {process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✅ Set' : '❌ Missing'}</p>
            <p>Firebase App ID: {process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}