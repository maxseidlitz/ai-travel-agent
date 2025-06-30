import ChatWithCanvas from '@/components/chat/ChatWithCanvas'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">
                  🧳 AI Travel Agent
                </h1>
              </div>
            </div>
            <div className="hidden md:block">
              <p className="text-sm text-gray-500">
                Ihr persönlicher KI-Reiseberater
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Chat Area with Notes Sidebar */}
        <div className="h-[600px]">
          <ChatWithCanvas />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>AI Travel Agent - Ihr intelligenter Reiseberater</p>
            <p className="mt-2">
              Entwickelt mit modernster KI-Technologie für die beste Reiseplanung
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
