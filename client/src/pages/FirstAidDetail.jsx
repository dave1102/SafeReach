import { useParams, Link } from 'react-router-dom'
import firstAidGuides from '../data/firstAidData.js'
import GlassCard from '../components/GlassCard.jsx'
import useSpeech from '../hooks/useSpeech.js'

export default function FirstAidDetail() {
  const { slug } = useParams()
  const guide = firstAidGuides.find((g) => g.slug === slug)
  const { supported, speak } = useSpeech()

  if (!guide) {
    return (
      <div className="pt-8 text-center text-mist-500">
        Guide not found. <Link to="/first-aid" className="text-trust-600 font-medium">Back to library</Link>
      </div>
    )
  }

  const readAloud = () => {
    const text = `${guide.title}. ${guide.summary}. Steps: ${guide.steps.join('. ')}. Seek urgent help if: ${guide.seekHelpIf.join('. ')}`
    speak(text)
  }

  return (
    <div className="flex flex-col gap-4 pt-4 max-w-2xl mx-auto">
      <Link to="/first-aid" className="text-sm text-trust-600 dark:text-trust-300 font-medium">← Back to library</Link>

      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-mist-800 dark:text-mist-100">{guide.title}</h1>
        {supported && (
          <button onClick={readAloud} className="btn-outline !px-3 !py-2 text-sm">🔈 Read aloud</button>
        )}
      </div>

      <GlassCard>
        <h2 className="section-title mb-3">Steps</h2>
        <ol className="flex flex-col gap-2 list-decimal list-inside text-sm text-mist-700 dark:text-mist-200">
          {guide.steps.map((s, i) => <li key={i}>{s}</li>)}
        </ol>
      </GlassCard>

      <GlassCard className="border-alert-200">
        <h2 className="section-title mb-3 text-alert-700 dark:text-alert-300">Seek urgent medical help if…</h2>
        <ul className="flex flex-col gap-2 list-disc list-inside text-sm text-mist-700 dark:text-mist-200">
          {guide.seekHelpIf.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </GlassCard>

      <p className="text-xs text-mist-400 text-center px-4">
        This guide provides general first aid information and is not a substitute for professional
        medical care or training. In a life-threatening emergency, call your local emergency number immediately.
      </p>
    </div>
  )
}
