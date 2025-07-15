"use client"

import type React from "react"

import { useState } from "react"
import { Upload, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function AddAnnouncementPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setUploadedImage(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log({ title, description, image: uploadedImage })
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Announcement</h1>
        <p className="text-gray-600">Share important updates with your students</p>
      </div>

      <Card className="shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Create New Announcement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                Announcement Title
              </Label>
              <Input
                id="title"
                placeholder="Enter announcement title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Write your announcement details here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="border-gray-200 focus:border-pink-300 focus:ring-pink-200 resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Upload Image (Optional)</Label>

              {!uploadedImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-300 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                      <Upload className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Click to upload image</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Uploaded preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 w-8 h-8"
                    onClick={removeImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white px-6">
                Publish Announcement
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
              >
                Save as Draft
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Preview Card */}
      {(title || description) && (
        <Card className="mt-6 shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {title && <h3 className="text-xl font-bold text-gray-900">{title}</h3>}
              {uploadedImage && (
                <img
                  src={uploadedImage || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              {description && <p className="text-gray-700 whitespace-pre-wrap">{description}</p>}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Posted by John Doe</span>
                <span>•</span>
                <span>Just now</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
