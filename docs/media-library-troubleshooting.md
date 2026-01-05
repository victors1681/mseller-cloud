# Media Library - Troubleshooting Guide

## Issue: "Error al cargar imágenes" Despite HTTP 200 Success

### Symptoms

When uploading images to the media library, you see:

- ✅ Success toast: "Imagen cargada a la librería"
- ✅ HTTP 200 response
- ❌ Error toast: "Error al cargar imágenes"
- Response contains: `{"data":{"images":["data:image/png;base64,..."]}}`

### Root Cause

**The Firebase `uploadImages` function has NOT been updated yet.**

The current Firebase Function is returning the OLD format:

```json
{
  "images": ["base64string1", "base64string2"]
}
```

But the frontend expects the NEW format:

```json
{
  "uploads": [
    {
      "id": "abc123",
      "businessId": "xxx",
      "type": "products",
      "originalFile": "path/to/file",
      "thumbnailFile": "path/to/thumbnail",
      "originalUrl": "https://...",
      "thumbnailUrl": "https://...",
      "title": "",
      "description": "",
      "tags": [],
      "usedBy": {},
      ...
    }
  ]
}
```

### Solution

You **MUST** update your Firebase Functions project according to:

📄 **[docs/firebase-functions-media-library-implementation.md](./firebase-functions-media-library-implementation.md)**

#### Quick Fix Steps:

1. **Open your Firebase Functions project** (separate repo)

2. **Modify `uploadImages` function** - Add this code AFTER successful Storage upload:

```typescript
// === NEW CODE: Save metadata to Firestore ===
const uploadResults = []

for (const upload of uploads) {
  const mediaDoc = {
    id: upload.id,
    businessId: businessId,
    type: imageType,
    originalFormat: upload.format,
    uploadedBy: userId,
    originalFile: upload.originalPath,
    thumbnailFile: upload.thumbnailPath,
    originalUrl: upload.originalUrl,
    thumbnailUrl: upload.thumbnailUrl,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    metadata: {
      size: upload.size,
      originalSize: upload.originalSize,
      height: upload.height,
      width: upload.width,
    },
    title: upload.filename || '',
    description: '',
    tags: [],
    usedBy: {
      products: [],
      customers: [],
    },
  }

  // Save to Firestore media_library collection
  await admin
    .firestore()
    .collection('media_library')
    .doc(upload.id)
    .set(mediaDoc)

  uploadResults.push(mediaDoc)
}

return { uploads: uploadResults } // CHANGED: return 'uploads' not 'images'
```

3. **Deploy the function:**

```bash
firebase deploy --only functions:uploadImages
```

4. **Verify the fix** by uploading an image again

---

## Current Behavior (Temporary)

The frontend has been updated with **backward compatibility** to detect the old format:

- ✅ If Firebase function returns `uploads` array → Upload succeeds
- ❌ If Firebase function returns `images` array → Shows error message: "Firebase Function no actualizada"

---

## Additional Functions Needed

After fixing `uploadImages`, you also need to create these 6 new functions:

1. ✅ `listMedia` - Query media library with filters/pagination
2. ✅ `updateMediaMetadata` - Edit title, description, tags
3. ✅ `deleteMedia` - Delete single media with validation
4. ✅ `bulkDeleteMedia` - Batch delete operations
5. ✅ `addUsageReference` - Track entity usage
6. ✅ `removeUsageReference` - Remove usage tracking

All implementations are documented in:
📄 **[docs/firebase-functions-media-library-implementation.md](./firebase-functions-media-library-implementation.md)**

---

## Testing After Fix

1. Upload an image at `/apps/media/`
2. Verify you see only ONE toast: ✅ "Imágenes cargadas a la librería"
3. Check the media appears in the grid below
4. Verify Firestore `media_library` collection has the new document
5. Try searching, filtering, editing metadata, and deleting

---

## Questions?

- Check Firebase Functions logs: `firebase functions:log`
- Test in emulator first: `firebase emulators:start`
- Verify JWT token structure: `business` and `type` claims must be present
