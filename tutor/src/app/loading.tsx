export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="loader mx-auto" style={{ width: '60px', height: '60px' }}></div>
        <p className="mt-6 text-gray-600 text-lg">Loading...</p>
      </div>
    </div>
  )
}