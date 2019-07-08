import React, { useState, useEffect } from "react"
import { db } from "./firebase"

export default function useDoc<T>(path: string): T | null {
  const [doc, setDoc] = useState<T | null>(null)

  useEffect(() => {
    return db.doc(path).onSnapshot((doc: any) => {
      setDoc({
        ...doc.data(),
        id: doc.id
      })
    })
  }, [path])

  return doc
}
