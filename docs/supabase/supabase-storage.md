Storage
Use Supabase to store and serve files.
Supabase Storage makes it simple to upload and serve files of any size, providing a robust framework for file access controls.

Features#
You can use Supabase Storage to store images, videos, documents, and any other file type. Serve your assets with a global CDN to reduce latency from over 285 cities globally. Supabase Storage includes a built-in image optimizer, so you can resize and compress your media files on the fly.

Examples#
Check out all of the Storage templates and examples in our GitHub repository.

Resumable Uploads with Uppy
Resumable Uploads with Uppy

Use Uppy to upload files to Supabase Storage using the TUS protocol (resumable uploads).
Resources#
Find the source code and documentation in the Supabase GitHub repository.

Supabase Storage API

View the source code.
OpenAPI Spec

Standard Uploads
Learn how to upload files to Supabase Storage.
Uploading#
The standard file upload method is ideal for small files that are not larger than 6MB.

It uses the traditional multipart/form-data format and is simple to implement using the supabase-js SDK. Here's an example of how to upload a file using the standard upload method:

Though you can upload up to 5GB files using the standard upload method, we recommend using TUS Resumable Upload for uploading files greater than 6MB in size for better reliability.


JavaScript

Dart

Swift

Kotlin

Python
import { createClient } from '@supabase/supabase-js'

// Create Supabase client
const supabase = createClient('your_project_url', 'your_supabase_api_key')

// Upload file using standard upload
async function uploadFile(file) {
  const { data, error } = await supabase.storage.from('bucket_name').upload('file_path', file)
  if (error) {
    // Handle error
  } else {
    // Handle success
  }
}

Overwriting files#
When uploading a file to a path that already exists, the default behavior is to return a 400 Asset Already Exists error.
If you want to overwrite a file on a specific path you can set the upsert options to true or using the x-upsert header.


JavaScript

Dart

Swift

Kotlin

Python
// Create Supabase client
const supabase = createClient('your_project_url', 'your_supabase_api_key')

await supabase.storage.from('bucket_name').upload('file_path', file, {
  upsert: true,
})

We do advise against overwriting files when possible, as our Content Delivery Network will take sometime to propagate the changes to all the edge nodes leading to stale content.
Uploading a file to a new path is the recommended way to avoid propagation delays and stale content.

Content type#
By default, Storage will assume the content type of an asset from the file extension. If you want to specify the content type for your asset simply pass the contentType option during upload.


JavaScript

Dart

Swift

Kotlin

Python
// Create Supabase client
const supabase = createClient('your_project_url', 'your_supabase_api_key')

await supabase.storage.from('bucket_name').upload('file_path', file, {
  contentType: 'image/jpeg',
})

Concurrency#
When two or more clients upload a file to the same path, the first client to complete the upload will succeed and the other clients will receive a 400 Asset Already Exists error.
If you provide the x-upsert header the last client to complete the upload will succeed instead.

Edit this page on GitHub


