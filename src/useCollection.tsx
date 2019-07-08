import React, { useState, useEffect } from "react"
import { db } from "./firebase"

export default function useCollection<T>(path: string, orderBy?: string, where: Array<any> = []): Array<T> {
  const [docs, setDocs] = useState<Array<T>>([])
  const [queryField, queryOperator, queryValue] = where
  useEffect(() => {
    // onSnapshot returns an unsubscribe function
    let collection: any = db.collection(path)
    if (orderBy) {
      collection = collection.orderBy(orderBy)
    }
    if (queryField) {
      collection = collection.where(queryField, queryOperator, queryValue)
    }
    return collection.onSnapshot((snapshot: any) => {
      let docs: Array<T> = []
      // forEach is a method on snapshot. snapshot is not an array, and does not have array methods like map etc..
      snapshot.forEach((doc: any) => {
        docs.push({
          ...(doc.data() as any),
          id: doc.id
        })
      })
      setDocs(docs)
    })
  }, [path, orderBy, queryField, queryOperator, queryValue])

  return docs
}
