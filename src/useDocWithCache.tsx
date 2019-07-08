import React, { useState, useEffect } from "react"
import { db } from "./firebase"

const cache: { [key: string]: any } = {}
const pendingCache: { [key: string]: any } = {}

export default function useDocWithCache<T>(path: string): T {
  const [doc, setDoc] = useState<T>(cache[path])

  useEffect(() => {
    if (doc) {
      return
    }
    let stillMounted = true
    // pendingCache is a cahche of promises
    // check if we have already tried to get the doc at the current path
    // check if we have a promise pending for fetching this path
    const pending = pendingCache[path]
    // if we have not tried to get the doc at the current path, fetch it, and add the pending promise to the pendingCache so we do not fetch it again
    const promise = pending || (pendingCache[path] = db.doc(path).get())
    // after fetching the doc from firebase, set state with the doc, and add the doc to cache
    promise.then((doc: any) => {
      if (stillMounted) {
        const currDoc = {
          ...doc.data(),
          id: doc.id
        }
        setDoc(currDoc)
        cache[path] = currDoc
      }
    })
    return () => {
      stillMounted = false
    }
  }, [path])

  return doc
}
