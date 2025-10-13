import Chat from '../../components/chat/Chat'

export const metadata = {
  title: 'Local Ollama Chat',
}

export default function Page() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Local Ollama Chat</h1>
      <Chat />
    </main>
  )
}
